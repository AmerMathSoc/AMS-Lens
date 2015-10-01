"use strict";

var ContainerPanel = require("lens/reader/panels/container_panel");
var InfoPanelController = require("./info_panel_controller");

var InfoPanel = function(config) {
  ContainerPanel.call(this, config);
};

InfoPanel.Prototype = function() {
  this.createController = function(doc) {
    return new InfoPanelController(doc, this.config);
  };
};
InfoPanel.Prototype.prototype = ContainerPanel.prototype;
InfoPanel.prototype = new InfoPanel.Prototype();

module.exports = InfoPanel;
