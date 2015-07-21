"use strict";

var _ = require('underscore');
var Lens = require("lens/reader");
var LensMath = require("lens/extensions/math");
var MathConverter = LensMath.MathConverter;
var MathNodes = LensMath.MathNodes;
var MathPanel = LensMath.MathPanel;
var panels = Lens.getDefaultPanels();

// Insert math panel at next to last position
panels.splice(1, 0, new MathPanel());

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