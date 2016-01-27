window.MathJax = {
    //  jax: ["input/TeX", "input/MathML","output/HTML-CSS"],
    //  extensions: ["MathMenu.js","MathZoom.js", "CHTML-preview.js"],
    CommonHTML: {
      // linebreaks: { automatic: true, width: "95% container" },
      EqnChunk: 100, EqnChunkFactor: 2.5, EqnChunkDelay: 10},
     "HTML-CSS": {
      //  linebreaks: { automatic: true, width: "95% container" },
       EqnChunk: 100, EqnChunkFactor: 2.5, EqnChunkDelay: 10},
     SVG: {
      //  linebreaks: { automatic: true, width: "95% container" },
       EqnChunk: 100, EqnChunkFactor: 2.5, EqnChunkDelay: 10},
     "fast-preview": {disabled: true},
     showProcessingMessages: false,
     messageStyle: "none",
     skipStartupTypeset: true,
     menuSettings: { zoom: "Click" },
    //  extensions: ["[Contrib]/img.js"],
    //  TeX: {extensions: ["AMSmath.js","AMSsymbols.js", "action.js"]},
     "displayAlign": "left",
     "displayIndent": "40px", // TODO will often be article dependent. How do we implement this?
     AuthorInit: function () {
          // MathJax.Ajax.config.path["Contrib"] = "./assets/lib";
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = 'lens.js';
          document.getElementsByTagName('head')[0].appendChild(script);
          //Reflow
          // MathJax.Hub.Register.MessageHook("End Process", function (message) {
          //   var timeout = false, // holder for timeout id
          //   delay = 250; // delay after event is "complete" to run callback
          //   var reflowMath = function() {
          //     var dispFormulas = document.getElementsByClassName("formula");
          //     if (dispFormulas){
          //     for (var i=0; i<dispFormulas.length; i++){
          //       var dispFormula = dispFormulas[i];
          //       var child = dispFormula.getElementsByClassName("MathJax_Preview")[0].nextSibling.firstChild;
          //       var isMultiline = MathJax.Hub.getAllJax(dispFormula)[0].root.isMultiline;
          //       if(dispFormula.offsetWidth < child.offsetWidth || isMultiline){
          //         MathJax.Hub.Queue(["Rerender", MathJax.Hub, dispFormula]);
          //       }
          //     }
          //   }
          //   };
          //   window.addEventListener('resize', function() {
          //       // clear the timeout
          //     clearTimeout(timeout);
          //     // start timing for event "completion"
          //     timeout = setTimeout(reflowMath, delay);
          //   });
          // });
          // shrink (leave zoom to MathJax)
          MathJax.Hub.Register.MessageHook("End Process", function (message) {
            //HACK clean up bad Lens nodes; cf. https://github.com/AmerMathSoc/AMS-Lens/issues/37
            var nodes = document.querySelectorAll(".paragraph > .content > .text > .content");
            for (var i = 0; i < nodes.length; i++){
              if(nodes[i].innerHTML.trim().length === 0){
                 var parent = nodes[i].parentNode.parentNode.parentNode;
                 console.log(parent);
                 parent.parentNode.removeChild(parent);
               }
            }
            };
            shrinkMath();
            window.addEventListener('resize', function() {
                // clear the timeout
              clearTimeout(timeout);
              // start timing for event "completion"
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
