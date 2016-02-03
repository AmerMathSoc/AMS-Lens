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
            //HACK clean up bad Lens nodes; cf. https://github.com/AmerMathSoc/AMS-Lens/issues/37
            var nodes = document.querySelectorAll(".paragraph > .content > .text > .content");
            for (var i = 0; i < nodes.length; i++){
              node = nodes[i];
              if(node.innerHTML.trim().length === 0){
                 var parent = node.parentNode.parentNode.parentNode;
                 parent.parentNode.removeChild(parent);
               }
            }
            // shrink with zoom from MathJax.
            var timeout = false;
            var delay = 250;
            var shrinkMath = function() {
              var dispFormulas = document.getElementsByClassName("formula");
              if (dispFormulas){
                // caculate relative size of indentation
                var contentTest = document.getElementsByClassName("content")[0];
                var nodesWidth = contentTest.offsetWidth;
                var mathIndent = MathJax.Hub.config.displayIndent; //assuming indent is in px's
                var mathIndentValue = mathIndent.substring(0,mathIndent.length - 2);
                for (var i=0; i<dispFormulas.length; i++){
                  var dispFormula = dispFormulas[i];
                  var wrapper = dispFormula.getElementsByClassName("MathJax_Preview")[0].nextSibling;
                  var child = wrapper.firstChild;
                  wrapper.style.transformOrigin = "top left";
                  var oldScale = child.style.transform;
                  var newValue = Math.min(0.80*dispFormula.offsetWidth / child.offsetWidth,1.0).toFixed(2);
                  var newScale = "scale(" + newValue + ")";
                  if(!(newScale === oldScale)){
                    wrapper.style.transform = newScale;
                    wrapper.style["margin-left"]= Math.pow(newValue,4)*mathIndentValue + "px";
                    var wrapperStyle = window.getComputedStyle(wrapper);
                    var wrapperHeight = parseFloat(wrapperStyle.height);
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
            shrinkMath();
            window.addEventListener('resize', function() {
              clearTimeout(timeout);
              timeout = setTimeout(shrinkMath, delay);
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
