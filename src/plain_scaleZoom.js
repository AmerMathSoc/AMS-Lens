var scaleMath = function() {
  var dispFormulas = document.getElementsByClassName("MJXc-display");
  if (dispFormulas) {
    // caculate relative size of indentation
    // var contentTest = document.getElementsByClassName("MJXc-display")[0];
    // var nodesWidth = contentTest.offsetWidth;
    // var mathIndent = MathJax.Hub.config.displayIndent; //assuming indent is in px's
    // var mathIndentValue = mathIndent.substring(0,mathIndent.length - 2);
    for (var i = 0; i < dispFormulas.length; i++) {
      var dispFormula = dispFormulas[i];
      var child = dispFormula.firstChild;
      dispFormula.style["-webkit-transform-origin"] = "top left";
      dispFormula.style["-moz-transform-origin"] = "top left";
      dispFormula.style["-ms-transform-origin"] = "top left";
      dispFormula.style.transformOrigin = "top left";
      // cache the real widths; it would be nice if mathjax-node could expose that
      if (!dispFormula.getAttribute("data-scale-height-org")) {
        var height = window.getComputedStyle(dispFormula).height;
        dispFormula.setAttribute("data-scale-height-org", height);
      }
      // TODO store scale as data-* and get oldScale from there
      var oldScale = dispFormula.getAttribute("data-scale-scale") || "scale(1.00)";
      var rootWidth = dispFormula.offsetWidth;
      var childWidth = child.offsetWidth;
      // workaround for labeled equations.
      var checkLabel = dispFormula.querySelector('.mjx-mlabeledtr');
      if (checkLabel) {
        var table = checkLabel.parentNode;
        var style = window.getComputedStyle(table);
        var tableWidth = parseFloat(style.width) + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        childWidth = Math.max(childWidth, tableWidth);
      }
      var newValue = Math.min(rootWidth / childWidth, 1.0).toFixed(2);
      var newScale = "scale(" + newValue + ")";
      if (!(newScale === oldScale)) {
        dispFormula.style["-webkit-transform"] = newScale;
        dispFormula.style["-moz-transform"] = newScale;
        dispFormula.style["-ms-transform"] = newScale;
        dispFormula.style.transform = newScale;
        dispFormula.style["margin-left"] = Math.pow(newValue, 4) + "px";
        var dispFormulaHeight = parseFloat(dispFormula.getAttribute("data-scale-height-org"));
        var newHeight =  "" + (dispFormulaHeight * newValue) + "px";
        dispFormula.style.height = newHeight;
        dispFormula.setAttribute("data-scale-height-current",newHeight);
        dispFormula.setAttribute("data-scale-scale", newScale);
        if (newValue === "1.00") {
          dispFormula.style.cursor = "";
          dispFormula.removeEventListener("click", upscaleMath, false);
        } else {
          dispFormula.addEventListener("click", upscaleMath, false);
          dispFormula.style.cursor = "zoom-in";
        }
      }

    }
  }
};

var upscaleMath = function() {
  var dispFormula = this;
  var scale = dispFormula.getAttribute("data-scale-scale");
  var dispFormulaHeightOrg = dispFormula.getAttribute("data-scale-height-org");
  var dispFormulaHeightCurrent = dispFormula.getAttribute("data-scale-height-current");

  var checked = dispFormula.getAttribute("data-scale-click");
  if (checked === ""){
    dispFormula.style.height = dispFormulaHeightCurrent;
    dispFormula.style["-webkit-transform"] = scale;
    dispFormula.style["-moz-transform"] = scale;
    dispFormula.style["-ms-transform"] = scale;
    dispFormula.style.transform = scale;
    dispFormula.removeAttribute("data-scale-click");
    dispFormula.style["overflow-x"] = "";
    dispFormula.style["overflow-y"] = "";
    dispFormula.style.padding = "0";
  }
  else {
    dispFormula.style.height = dispFormulaHeightOrg;
    dispFormula.style["-webkit-transform"] = "scale(1.00)";
    dispFormula.style["-moz-transform"] = "scale(1.00)";
    dispFormula.style["-ms-transform"] = "scale(1.00)";
    dispFormula.style.transform = "scale(1.00)";
    dispFormula.setAttribute("data-scale-click","");
    dispFormula.style["overflow-x"] = "auto";
    dispFormula.style["overflow-y"] = "hidden";
    dispFormula.style["padding-bottom"] = "5em";
  }
};

var scaleZoom = function() {
  // debounce setup
  var timeout = false;
  var delay = 250;
  // the main function for scaling
  scaleMath();
  window.addEventListener('resize', function() {
    clearTimeout(timeout);
    timeout = setTimeout(scaleMath, delay);
  });


  //HACK clean up bad Lens nodes; cf. https://github.com/AmerMathSoc/AMS-Lens/issues/37
  var nodes = document.querySelectorAll(".paragraph > .content > .text > .content");
  for (var i = 0; i < nodes.length; i++){
    node = nodes[i];
    if(node.innerHTML.trim().length === 0){
      console.log(node);
       var parent = node.parentNode.parentNode.parentNode;
       parent.parentNode.removeChild(parent);
     }
  }
  // HACK remove padding of formulas following formulas
  var formulas = document.querySelectorAll(".document .formula + .formula");
  for (var i = 0; i < formulas.length; i++){
    console.log(formula);
    var formula = formulas[i];
    formula.style["padding-top"]= "0px";
    formula.previousSibling.style["padding-bottom"]= "0px";
  }

};

module.exports = scaleZoom;
