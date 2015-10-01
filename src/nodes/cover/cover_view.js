var LensNodes = require("lens/article/nodes");
var articleUtil = require("lens/article/article_util");
var CoverView = LensNodes["cover"].View;
var $$ = require("lens/substance/application").$$;
var _ = require("underscore");

var AMSCoverView = function(node, viewFactory) {
  CoverView.call(this, node, viewFactory);
};

var LABELS = {
  "amsrefs": "AMSRefs",
  "bibtex": "BibTeX"
};

AMSCoverView.Prototype = function() {
  this.render = function() {
    CoverView.prototype.render.call(this);

    var refUrl = encodeURIComponent(window.location.href);
    var pubInfo = this.node.document.get('publication_info');
    var journalId = this.node.document.get('publication_info');
    if (pubInfo.doi) {
      var doi = 'http://doi.org/' + pubInfo.doi;
    } else {
      doi = 'http://www.ams.org';
    }

    // Add cover data
    var journalinfoEl;
    if (pubInfo.journal === 'Proceedings of the American Mathematical Society, Series B') {
      journalinfoEl = $$('.journalinfo', {
        children: [
          $$('.journalinfo-img', {
            html: '<a href="http://www.ams.org/bproc/"><img height="120em" src="images/bproc-cover.png" alt="Journal Cover" /></a>'
          }),
          $$('.journalinfo-oa', {
            html: '<a href="http://www.ams.org/publications/journals/open-access/open-access"><img height=40em" src="images/oa-logo.svg" alt="This article is open access" /></a>'
          }),
          $$('.journalinfo-share', {
            children: [
              $$('a.share', {
                href: doi,
                //target: "_blank",
                html: '<i class="fa fa-share"></i> Share'
              })
            ]
          })
        ]
      });
    }
else if (pubInfo.journal === 'Transactions of the American Mathematical Society, Series B') {
      journalinfoEl = $$('.journalinfo', {
        children: [
          $$('.journalinfo-img', {
            html: '<a href="http://www.ams.org/btran/"><img height="120em" src="images/btran-cover.png" alt="Journal Cover" /></a>'
          }),
          $$('.journalinfo-oa', {
            html: '<a href="http://www.ams.org/publications/journals/open-access/open-access"><img height=40em" src="images/oa-logo.svg" alt="This article is open access" /></a>'
          }),
          $$('.journalinfo-share', {
            children: [
              $$('a.share', {
                href: doi,
                html: '<i class="fa fa-share"></i> Share'
              })
            ]
          })
        ]
      });
    } else {
      journalinfoEl = $$('.journalinfo', {
        children: [
          $$('.journalinfo-share', {
            children: [
              $$('a.share', {
                href: 'https://github.com/AmerMathSoc/AMS-Lens',
                html: '<i class="fa fa-share"></i> AMS Lens'
              })
            ]
          })
        ]
      });

    }

    // Prepend journalinfo
    this.content.insertBefore(journalinfoEl, this.content.firstChild);

    var rawFormatsEl = $$('.raw-formats', {
      html: ""
    });
    _.each(pubInfo.raw_formats, function(rawFormat) {
      var type = rawFormat.type;
      var formatEl = $$('a.raw-format.' + type, {
        href: "data:text/plain;charset=UTF-8," + encodeURIComponent(rawFormat.content),
        target: "_blank",
        "data-type": type,
        html: '<i class="fa fa-file-text-o"></i> ' + LABELS[type],
      });
      rawFormatsEl.appendChild(formatEl);
    }, this);

    // Append
    this.content.appendChild(rawFormatsEl);

    return this;
  }
};

AMSCoverView.Prototype.prototype = CoverView.prototype;
AMSCoverView.prototype = new AMSCoverView.Prototype();
AMSCoverView.prototype.constructor = AMSCoverView;

module.exports = AMSCoverView;
