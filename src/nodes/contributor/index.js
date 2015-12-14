"use strict";

var LensNodes = require("lens/article/nodes");
var CoverModel = LensNodes["contributor"].Model;

module.exports = {
  Model: CoverModel,
  View: require('./contributor_view')
};
