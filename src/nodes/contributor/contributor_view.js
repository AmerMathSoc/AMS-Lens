"use strict";

var LensNodes = require("lens/article/nodes");
var articleUtil = require("lens/article/article_util");
var ContributorView = LensNodes["contributor"].View;
var $$ = require("lens/substance/application").$$;
var _ = require("underscore");

var AMSContributorView = function(node, viewFactory) {
  ContributorView.call(this, node, viewFactory);
};

var LABELS = {
  "amsrefs": "AMSRefs",
  "bibtex": "BibTeX"
};

AMSContributorView.Prototype = function() {
  this.renderBody = function() {
    // Contributor Name
    // -------

    this.content.appendChild($$('.contributor-name', {text: this.node.name}));

    // Contributor Role
    // -------

    if (this.node.role) {
      this.content.appendChild($$('.role', {text: this.node.role}));
    }


    // Add Affiliations
    // -------

    this.content.appendChild($$('.affiliations', {
      children: _.map(this.node.getAffiliations(), function(aff) {

        var affText = _.compact([
          aff.department,
          aff.institution,
          aff.city,
          aff.country
        ]).join(', ');

        return $$('.affiliation', {text: affText});
      })
    }));



    // Present Address
    // -------

    if (this.node.present_address) {
      this.content.appendChild($$('.label', {text: 'Present address'}));
      this.content.appendChild($$('.contribution', {text: this.node.present_address}));
    }

    // Contribution
    // -------

    if (this.node.contribution) {
      this.content.appendChild($$('.label', {text: 'Contribution'}));
      this.content.appendChild($$('.contribution', {text: this.node.contribution}));
    }

    // Equal contribution
    // -------

    if (this.node.equal_contrib && this.node.equal_contrib.length > 0) {
      this.content.appendChild($$('.label', {text: 'Contributed equally with'}));
      this.content.appendChild($$('.equal-contribution', {text: this.node.equal_contrib}));
    }


    // Emails
    // -------

    if (this.node.emails.length > 0) {
      this.content.appendChild($$('.label', {text: 'For correspondence'}));
      this.content.appendChild($$('.emails', {
        children: _.map(this.node.emails, function(email) {
          return $$('a', {href: "mailto:"+email, text: email});
        })
      }));
    }


    // Funding
    // -------

    if (this.node.fundings.length > 0) {
      this.content.appendChild($$('.label', {text: 'Funding'}));
      this.content.appendChild($$('.fundings', {
        children: _.map(this.node.fundings, function(funding) {
          return $$('.funding', {text: funding});
        })
      }));
    }


    // Competing interests
    // -------

    if (this.node.competing_interests.length > 0) {
      this.content.appendChild($$('.label', {text: 'Competing Interests'}));
      this.content.appendChild($$('.competing-interests', {
        children: _.map(this.node.competing_interests, function(ci) {
          return $$('.conflict', {text: ci});
        })
      }));
    }

    // MR if available
    // -------

    if (this.node.properties.mrauth) {
      this.content.appendChild($$('.label', { text: 'MathSciNet' }));
      this.content.appendChild($$('a.mrauth', { href: this.node.properties.mrauth, text: this.node.properties.mrauth }));
    }

    // ORCID if available
    // -------

    if (this.node.orcid) {
      this.content.appendChild($$('.label', { text: 'ORCID' }));
      this.content.appendChild($$('a.orcid', { href: this.node.orcid, text: this.node.orcid }));
    }

    // Group member (in case contributor is a person group)
    // -------

    if (this.node.members.length > 0) {
      this.content.appendChild($$('.label', {text: 'Group Members'}));
      this.content.appendChild($$('.members', {
        children: _.map(this.node.members, function(member) {
          return $$('.member', {text: member});
        })
      }));
    }


    // Contributor Bio
    // -------

    if (this.node.image || (this.node.bio && this.node.bio.length > 0) ) {
      var bio = $$('.bio');
      var childs = [$$('img', {src: this.node.image}), bio];

      _.each(this.node.bio, function(par) {
        bio.appendChild(this.createView(par).render().el);
      }, this);

      this.content.appendChild($$('.contributor-bio.container', {
        children: childs
      }));
    }

    // Deceased?
    // -------

    if (this.node.deceased) {
      // this.content.appendChild($$('.label', {text: 'Present address'}));
      this.content.appendChild($$('.label', {text: "* Deceased"}));
    }

  };
};

AMSContributorView.Prototype.prototype = ContributorView.prototype;
AMSContributorView.prototype = new AMSContributorView.Prototype();
AMSContributorView.prototype.constructor = AMSContributorView;

module.exports = AMSContributorView;
