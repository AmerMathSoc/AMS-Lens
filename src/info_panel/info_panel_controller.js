"use strict";

var ContainerPanelController = require("lens/reader/panels/container_panel_controller");

var InfoPanelView = require("./info_panel_view");

var InfoPanelController = function( doc, config ) {
  ContainerPanelController.call(this, doc, config);
};

InfoPanelController.Prototype = function() {

  this.createView = function() {
    ContainerPanelController.prototype.createView.call(this);
    return new InfoPanelView(this, this.viewFactory, this.config);
  };

};
InfoPanelController.Prototype.prototype = ContainerPanelController.prototype;
InfoPanelController.prototype = new InfoPanelController.Prototype();

module.exports = InfoPanelController;
