"use strict";

var NodeView = require("lens/article/nodes/node").View;
var $$ = require("lens/substance/application").$$;

var _labels = {
  "received": "received",
  "accepted" : "accepted",
  "revised": "revised",
  "corrected": "corrected",
  "rev-recd": "revised",
  "rev-request": "returned for modification",
  "published": "published",
  "default": "updated",
};

// Lens.PublicationInfo.View
// ==========================================================================

var PublicationInfoView = function(node, viewFactory) {
  NodeView.call(this, node, viewFactory);
};

PublicationInfoView.Prototype = function() {

  this.render = function() {

    NodeView.prototype.render.call(this);

    var i, valEl;

    // Display article meta information
    // ----------------

    var metaData = $$('.meta-data');

    // Article Type
    //

    if (this.node.article_type) {
      var articleTypeEl = $$('.article-type.container', {
        children: [
          $$('div.label', {text: "Article Type"}),
          $$('div.value', {
            text: this.node.article_type
          })
        ]
      });
      metaData.appendChild(articleTypeEl);
    }

    // Subject
    //

    if (this.node.subjects && this.node.subjects.length > 0) {
      var subjectEl = $$('.subject.container', {
        children: [
          $$('div.label', {text: "Subject"}),
          $$('div.value', {
            text: this.node.subjects.join(', ')
          })
        ]
      });
      metaData.appendChild(subjectEl);
    }

    // Keywords
    //

    if (this.node.keywords && this.node.keywords.length > 0) {
      var keywords = this.node.keywords;
      var keywordsEl = $$('.keywords.container');
      keywordsEl.appendChild(
        $$('div.label', {text: "Keywords"})
      );
      var valEl = $$('div.value');
      for (i = 0; i < keywords.length; i++) {
        var keywordEl = $$('span');
        this.renderAnnotatedText(['publication_info', 'keywords', i], keywordEl);
        keywordEl.appendChild($$('.'));
        valEl.appendChild(keywordEl);
      }
      keywordsEl.appendChild(valEl);
      metaData.appendChild(keywordsEl);
    }

    // Funding information
    //

    if (this.node.funding_info && this.node.funding_info.length > 0) {
      var fundingEl = $$('.funding.container');
      fundingEl.appendChild(
        $$('div.label', {text: "Funding"})
      );
      var valEl = $$('div.value');
      for (var i = 0; i < this.node.funding_info.length; i++) {
        var fundingInfoEl = $$('span');
        this.renderAnnotatedText(['publication_info', 'funding_info', i], fundingInfoEl);
        fundingInfoEl.appendChild($$('.'));
        valEl.appendChild(fundingInfoEl);
      }
      fundingEl.appendChild(valEl);
      metaData.appendChild(fundingEl);
    }

    // DOI
    //

    if (this.node.doi) {
      var doiEl = $$('.doi.container', {
        children: [
          $$('div.label', {text: "DOI"}),
          $$('div.value', {
            children: [$$('a', {href: "http://dx.doi.org/"+this.node.doi, text: this.node.doi, target: '_blank'})]
          })
        ]
      });
      metaData.appendChild(doiEl);
    }

    // Related Article
    //

    if (this.node.related_article) {
      var relatedArticleEl = $$('.related-article.container', {
        children: [
          $$('div.label', {text: "Related Article"}),
          $$('div.value', {
            children: [$$('a', {href: this.node.related_article, text: this.node.related_article})]
          })
        ]
      });
      metaData.appendChild(relatedArticleEl);
    }

    var historyEl = this.describePublicationHistory();

    metaData.appendChild(historyEl);


    this.content.appendChild(metaData);

    // Display article information
    // ----------------

    var articleInfo = this.node.getArticleInfo();

    // Remove Dedication children, cf. https://github.com/AmerMathSoc/AMS-Lens/issues/45
    var ch = articleInfo.children;
    var i = ch.indexOf("dedication");
    if(i != -1) {
      ch.splice(i, 1); // remove dedication
      ch.splice(i, 1); // remove the dedication-text as well
    }
    articleInfo.children = ch;

    var articleInfoView = this.viewFactory.createView(articleInfo);
    var articleInfoViewEl = articleInfoView.render().el;

    this.content.appendChild(articleInfoViewEl);


    return this;
  };

  // Creates an element with a narrative description of the publication history
  // ----------------
  //

  this.describePublicationHistory = function() {
    var datesEl = $$('.dates');
    var i;

    var dateEntries = [];
    if (this.node.history && this.node.history.length > 0) {
      dateEntries = dateEntries.concat(this.node.history);
    }

    if (this.node.published_on) {
      dateEntries.push({
        type: 'published',
        date: this.node.published_on
      });
    }

    // If there is any pub history, create a narrative following
    // 'The article was ((<action> on <date>, )+ and) <action> on <date>'
    // E.g.,
    // 'This article was published on 11. Oct. 2014'
    // 'This article was accepted on 06.05.2014, and published on 11. Oct. 2014'

    if (dateEntries.length > 0) {
      datesEl.appendChild(document.createTextNode("This article was "));
      for (i = 0; i < dateEntries.length; i++) {
        // conjunction with ', ' or ', and'
        if (i > 0) {
          datesEl.appendChild(document.createTextNode(', '));
          if (i === dateEntries.length-1) {
            datesEl.appendChild(document.createTextNode('and '));
          }
        }
        var entry = dateEntries[i];
        datesEl.appendChild(document.createTextNode((_labels[entry.type] || _labels.default)+ ' on '));
        datesEl.appendChild($$('b', {
          text: entry.date
        }));
      }
      datesEl.appendChild(document.createTextNode('.'));
    }

    return datesEl;
  };

  this.dispose = function() {
    NodeView.prototype.dispose.call(this);
  };
};

PublicationInfoView.Prototype.prototype = NodeView.prototype;
PublicationInfoView.prototype = new PublicationInfoView.Prototype();

module.exports = PublicationInfoView;
