window.MathJax = {
    //  jax: ["input/TeX", "input/MathML","output/HTML-CSS"],
    //  extensions: ["MathMenu.js","MathZoom.js", "CHTML-preview.js"],
    CommonHTML: { linebreaks: { automatic: true }, EqnChunk: 100, EqnChunkFactor: 2.5, EqnChunkDelay: 10},
     "HTML-CSS": { linebreaks: { automatic: true }, EqnChunk: 100, EqnChunkFactor: 2.5, EqnChunkDelay: 10},
     SVG: { linebreaks: { automatic: true }, EqnChunk: 100, EqnChunkFactor: 2.5, EqnChunkDelay: 10},
     "fast-preview": {disabled: true},
     showProcessingMessages: false,
     messageStyle: "none",
    //  extensions: ["[Contrib]/img.js"],
    //  TeX: {extensions: ["AMSmath.js","AMSsymbols.js", "action.js"]},
     "displayAlign": "left",
     "displayIndent": "5em", // TODO will often be article dependent. How do we implement this?
     AuthorInit: function () {
          // MathJax.Ajax.config.path["Contrib"] = "./assets/lib";
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = 'lens.js';
          document.getElementsByTagName('head')[0].appendChild(script);
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
