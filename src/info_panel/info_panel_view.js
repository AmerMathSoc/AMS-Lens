"use strict";

var $$ = require("lens/substance/application").$$;
var ContainerPanelView = require("lens/reader/panels/container_panel_view");

var InfoPanelView = function( panelCtrl, viewFactory, config ) {
  ContainerPanelView.call(this, panelCtrl, viewFactory, config);
};

InfoPanelView.Prototype = function() {

  this.render = function() {
    ContainerPanelView.prototype.render.call(this);

    // AMS Copyright statement and links
    // ----------------

    var copyrightAMSNode = $$('.ams-copyright.content-node', {
      children: [
        $$('span', {html: '&copy; 2015 '}),
        $$('a', {href: 'http://www.ams.org/about-us/copyright', text: 'American Mathematical Society'}),
        $$('span', {html: ' | '}),
        $$('a', {href: 'http://www.ams.org/about-us/contact/reach', text: 'Contact us'}),
        $$('span', {html: ' | '}),
        $$('a', {href: 'http://www.ams.org/about-us/privacy', text: 'Privacy statement'})
      ]
    });

    this.surface.$nodes.append(copyrightAMSNode);

    return this;
  };
};

InfoPanelView.Prototype.prototype = ContainerPanelView.prototype;
InfoPanelView.prototype = new InfoPanelView.Prototype();
InfoPanelView.prototype.constructor = InfoPanelView;

module.exports = InfoPanelView;
