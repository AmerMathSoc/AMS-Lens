window.MathJax = {
     jax: ["input/TeX", "input/MathML","output/HTML-CSS"],
     extensions: ["MathMenu.js","MathZoom.js", "CHTML-preview.js"],
     "HTML-CSS": { linebreaks: { automatic: true }, EqnChunk: 9999 },
     SVG: { linebreaks: { automatic: true }, EqnChunk: 9999  },
     TeX: {
       extensions: ["AMSmath.js","AMSsymbols.js","noErrors.js","noUndefined.js"]
     },
     "displayAlign": "left",
     "displayIndent": "5em" // TODO will often be article dependent. How do we implemet this?
};
(function(d, script) {
  script = d.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.onload = function() {
    // remote script has loaded
  };
  script.src = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=MML_HTMLorMML-full';
  d.getElementsByTagName('head')[0].appendChild(script);
}(document));
