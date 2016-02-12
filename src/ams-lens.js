"use strict";

var _ = require('underscore');
var Lens = require("lens/reader");
var LensMath = require("lens/extensions/math");
var util = require("lens/substance/util");
var MathConverter = LensMath.MathConverter;
var MathPanel = LensMath.MathPanel;
var MathNodes = LensMath.MathNodes;
var panels = Lens.getDefaultPanels();
var InfoPanel = require("./info_panel");
var amsNodes = require("./nodes");


MathConverter.prototype.contributor =  function(state, contrib) {
    var doc = state.doc;

    var id = state.nextId("contributor");
    var contribNode = {
      id: id,
      source_id: contrib.getAttribute("id"),
      type: "contributor",
      name: "",
      affiliations: [],
      fundings: [],
      bio: [],

      // Not yet supported... need examples
      image: "",
      deceased: false,
      emails: [],
      contribution: "",
      members: []
    };


    // Extract emails

    // TODO: a corresp element allows *much* more than just an email
    // Thus, we are leaving this like untouched, so that it may be grabbed by extractAuthorNotes()
    // state.used[correspId] = true;
    var emails = contrib.querySelectorAll("email");
    _.each(emails, function(email) {
      contribNode.emails.push(email.textContent);
    });

    // Extract contrib type
    var contribType = contrib.getAttribute("contrib-type");

    // Assign human readable version
    contribNode["contributor_type"] = this._contribTypeMapping[contribType];

    // Extract role
    var role = contrib.querySelector("role");
    if (role) {
      contribNode["role"] = role.textContent;
    }

    // Search for author bio and author image
    var bio = contrib.querySelector("bio");
    if (bio) {
      _.each(util.dom.getChildren(bio), function(par) {
        var graphic = par.querySelector("graphic");
        if (graphic) {
          var imageUrl = graphic.getAttribute("xlink:href");
          contribNode.image = imageUrl;
        } else {
          var pars = this.paragraphGroup(state, par);
          if (pars.length > 0) {
            contribNode.bio = [ pars[0].id ];
          }
        }
      }, this);
    }

    // Deceased?

    if (contrib.getAttribute("deceased") === "yes") {
      contribNode.deceased = true;
    }

    // Extract ORCID
    // -----------------
    //
    // <uri content-type="orcid" xlink:href="http://orcid.org/0000-0002-7361-560X"/>

    var orcidURI = contrib.querySelector("contrib-id[contrib-id-type=orcid]");
    if (orcidURI) {
      contribNode.orcid = orcidURI.textContent;
    }

    var mrAuth = contrib.querySelector("contrib-id[contrib-id-type=mrauth]");
    if (mrAuth) {
      contribNode.mrauth = mrAuth.textContent;
    }

    // Extracting equal contributions
    var nameEl = contrib.querySelector("name");
    if (nameEl) {
      contribNode.name = this.getName(nameEl);
    } else {
      var collab = contrib.querySelector("collab");
      // Assuming this is an author group
      if (collab) {
        contribNode.name = collab.textContent;
      } else {
        contribNode.name = "N/A";
      }
    }

    this.extractContributorProperties(state, contrib, contribNode);


    // HACK: for cases where no explicit xrefs are given per
    // contributor we assin all available affiliations
    if (contribNode.affiliations.length === 0) {
      contribNode.affiliations = state.affiliations;
    }

    // HACK: if author is assigned a conflict, remove the redundant
    // conflict entry "The authors have no competing interests to declare"
    // This is a data-modelling problem on the end of our input XML
    // so we need to be smart about it in the converter
    if (contribNode.competing_interests.length > 1) {
      contribNode.competing_interests = _.filter(contribNode.competing_interests, function(confl) {
        return confl.indexOf("no competing") < 0;
      });
    }

    if (contrib.getAttribute("contrib-type") === "author") {
      doc.nodes.document.authors.push(id);
    }

    doc.create(contribNode);
    doc.show("info", contribNode.id);
  };


// Add custom Nodes
_.extend(MathNodes, amsNodes);

// Insert math panel at next to last position
panels.splice(1, 0, new MathPanel());

var infoPanel = new InfoPanel({
  type: 'resource',
  name: 'info',
  container: 'info',
  title: 'Info',
  icon: 'fa-info',
  references: ['contributor_reference'],
});

// HACK: remove the old info panel, assuming at the last position
panels.pop();
panels.push(infoPanel);

var AMSLens = function(config) {
  Lens.call(this, config);
};

AMSLens.Prototype = function() {

  this.getConverters = function(converterOptions) {
    if (!converterOptions) converterOptions = {};
    converterOptions.nodeTypes = MathNodes;
    return [ new MathConverter(converterOptions) ];
  };

  this.getPanels = function() {
    return panels.slice(0);
  };

  this.getWorkflows = function() {
    var workflows = Lens.getDefaultWorkflows();
    workflows.push(new LensMath.ToggleFormula());
    workflows.push(new LensMath.ToggleMathEnvironment());
    workflows.push(new LensMath.ZoomFormula());
    return workflows;
  };

};

AMSLens.Prototype.prototype = Lens.prototype;
AMSLens.prototype = new AMSLens.Prototype();
AMSLens.prototype.constructor = AMSLens;

module.exports = AMSLens;
