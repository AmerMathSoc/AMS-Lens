var _ = require('underscore');
var Document = require('lens/substance/document');

var AMSContributor = function(node, doc) {
  Document.Node.call(this, node, doc);
};

AMSContributor.type = {
  "id": "AMSContributor",
  "parent": "content",
  "properties": {
    "source_id": "string",
    "name": "string", // full name
    "role": "string",
    "AMSContributor_type": "string",
    "affiliations": ["array", "affiliation"],
    "present_address": ["string"],
    "fundings": ["array", "string"],
    "image": "string", // optional
    "emails": ["array", "string"],
    "contribution": "string",
    "bio": ["array", "paragraph"],
    "deceased": "boolean",
    "members": ["array", "string"],
    "orcid": "string",
    "equal_contrib": ["array", "string"],
    "competing_interests": ["array", "string"],
    "mrauth": "string"
  }
};

AMSContributor.Prototype = function() {

  this.getAffiliations = function() {
    return _.map(this.properties.affiliations, function(affId) {
      return this.document.get(affId);
    }, this);
  };

  this.getHeader = function() {
    return this.properties.AMSContributor_type || 'Author';
  };

};

AMSContributor.Prototype.prototype = Document.Node.prototype;
AMSContributor.prototype = new AMSContributor.Prototype();
AMSContributor.prototype.constructor = AMSContributor;

Document.Node.defineProperties(AMSContributor);

module.exports = AMSContributor;
