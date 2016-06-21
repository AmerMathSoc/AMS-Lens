var scaleZoom = require("./plain_scaleZoom");
var hacks = function() {
    var hack = function() {
      // HACK remove empty References headings in TOC and Content Panel, cf. https://github.com/AmerMathSoc/AMS-Lens/issues/49
      var headings = document.getElementsByClassName("level-1");
      for (var i = 0; i < headings.length; i++) {
          var heading = headings[i];
          if (heading.textContent.trim() === "References") {
              console.log("HACK for issue #49: hiding 'References' heading:");
              console.log(heading);
              heading.style.visibility = "hidden";
          }
      }
      //HACK clean up bad Lens nodes; cf. https://github.com/AmerMathSoc/AMS-Lens/issues/37
      var nodes = document.querySelectorAll(".paragraph > .content > .text > .content");
      for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          if (node.innerHTML.trim().length === 0) {
              console.log("HACK: clean up empty Lens nodes");
              var parent = node.parentNode.parentNode.parentNode;
              parent.parentNode.removeChild(parent);
          }
      }
      // HACK remove padding of formulas following formulas
      var formulas = document.querySelectorAll(".document .formula + .formula");
      for (var i = 0; i < formulas.length; i++) {
          console.log("HACK: remove padding between consecutive formulas");
          var formula = formulas[i];
          formula.style["padding-top"] = "0px";
          formula.previousSibling.style["padding-bottom"] = "0px";
      }
      // Start Zoom
      scaleZoom();
    }
    var MutationObserver = (function() {
        var prefixes = ['WebKit', 'Moz', 'O', 'Ms', '']
        for (var i = 0; i < prefixes.length; i++) {
            if (prefixes[i] + 'MutationObserver' in window) {
                return window[prefixes[i] + 'MutationObserver'];
            }
        }
        return false;
    }());

    if (MutationObserver) {
        document.addEventListener("DOMContentLoaded", function(event) {
            // console.log("DOM fully loaded and parsed");
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (document.body.className === "current-view reader") {
                        observer.disconnect;
                        hack();
                    }
                });
            });

            // Notify me of everything!
            var observerConfig = {
                attributes: true,
                childList: false,
                characterData: false
            };

            // Node, config
            // In this case we'll listen to all changes to body and child nodes
            var targetNode = document.body;
            observer.observe(targetNode, observerConfig);

        });
    } else {
        // Fallback
    }

}
module.exports = hacks;
