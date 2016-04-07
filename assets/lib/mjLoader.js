window.MathJax = {
    CommonHTML: {
      EqnChunk: 100, EqnChunkFactor: 2.5, EqnChunkDelay: 10},
     "HTML-CSS": {
       EqnChunk: 100, EqnChunkFactor: 2.5, EqnChunkDelay: 10},
     SVG: {
       EqnChunk: 100, EqnChunkFactor: 2.5, EqnChunkDelay: 10},
     "fast-preview": {disabled: true},
     showProcessingMessages: false,
     messageStyle: "none",
     skipStartupTypeset: true,
     menuSettings: { zoom: "Click" },
     "displayAlign": "left",
     "displayIndent": "40px",
     AuthorInit: function () {
          // MathJax.Ajax.config.path["Contrib"] = "./assets/lib";
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = 'lens.js';
          document.getElementsByTagName('head')[0].appendChild(script);
          MathJax.Hub.Register.MessageHook("End Process", function (message) {
            // HACK remove empty References headings in TOC and Content Panel, cf. https://github.com/AmerMathSoc/AMS-Lens/issues/49
            var headings = document.getElementsByClassName("level-1");
            for (var i = 0; i < headings.length; i++){
              var heading = headings[i];
              if (heading.innerText.trim() === "References"){
                console.log("HACK for issue #49: hiding 'References' heading:");
                console.log(heading);
                heading.style.visibility = "hidden";
              }
            }
            //HACK clean up bad Lens nodes; cf. https://github.com/AmerMathSoc/AMS-Lens/issues/37
            var nodes = document.querySelectorAll(".paragraph > .content > .text > .content");
            for (var i = 0; i < nodes.length; i++){
              node = nodes[i];
              if(node.innerHTML.trim().length === 0){
                 var parent = node.parentNode.parentNode.parentNode;
                 parent.parentNode.removeChild(parent);
               }
            }
            // HACK remove padding of formulas following formulas
            var formulas = document.querySelectorAll(".document .formula + .formula");
            for (var i = 0; i < formulas.length; i++){
              var formula = formulas[i];
              formula.style["padding-top"]= "0px";
              formula.previousSibling.style["padding-bottom"]= "0px";
            }
            // shrink with zoom from MathJax.
            // debounce setup
            var timeout = false;
            var delay = 250;
            // cache the real widths; it would be nice if MathJax did that
            var dispForms = document.querySelectorAll(".formula[data-id^='formula']");
            if (dispForms){
              for (var i=0; i < dispForms.length; i++){
                  var dispForm = dispForms[i];
                  var wrapper = dispForm.getElementsByClassName("MathJax_Preview")[0].nextSibling;
                  var height = window.getComputedStyle(wrapper).height;
                  wrapper.setAttribute("data-scale-height", height);
              }
            }
            // the main function for scaling
            var scaleMath = function() {
              var dispFormulas = document.querySelectorAll(".formula[data-id^='formula']");
              if (dispFormulas){
                // caculate relative size of indentation
                var contentTest = document.getElementsByClassName("content")[0];
                var nodesWidth = contentTest.offsetWidth;
                var mathIndent = MathJax.Hub.config.displayIndent; //assuming indent is in px's
                var mathIndentValue = mathIndent.substring(0,mathIndent.length - 2);
                for (var i=0; i < dispFormulas.length; i++){
                  var dispFormula = dispFormulas[i];
                  var wrapper = dispFormula.getElementsByClassName("MathJax_Preview")[0].nextSibling;
                  var child = wrapper.firstChild;
                  wrapper.style.transformOrigin = "top left";
                  var oldScale = child.style.transform;
                  var newValue = Math.min(0.80*dispFormula.offsetWidth / child.offsetWidth,1.0).toFixed(2); //80% from experimentation
                  var newScale = "scale(" + newValue + ")";
                  if(!(newScale === oldScale)){
                    wrapper.style.transform = newScale;
                    wrapper.style["margin-left"]= Math.pow(newValue,4)*mathIndentValue + "px";
                    var wrapperHeight = parseFloat(wrapper.getAttribute("data-scale-height"));
                    wrapper.style.height = "" + (wrapperHeight * newValue) + "px";
                    if(newValue === "1.00"){
                      wrapper.style.cursor = "";
                    }
                    else {
                      wrapper.style.cursor = "zoom-in";
                    }
                  }

                }
            }
            };
            scaleMath();
            window.addEventListener('resize', function() {
              clearTimeout(timeout);
              timeout = setTimeout(scaleMath, delay);
            });
          });
      }
};
(function(d, script) {
  script = d.createElement('script');
  script.type = 'text/javascript';
  script.onload = function() {
    // remote script has loaded
  };
  script.src = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=MML_CHTML-full';
  d.getElementsByTagName('head')[0].appendChild(script);
}(document));
