window.Lens = require("./src/ams-lens");

// Little helper used to parse query strings from urls
// --------
//

var qs = function () {
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
      // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  }
  return query_string;
} ();

// This document gets loaded by default
// --------

var documentURL = "data/kitchen_sink.xml";

$(function() {

  // Create a new Lens app instance
  // --------
  //
  // Injects itself into body

  var app = new window.Lens({
    document_url: qs.url ? decodeURIComponent(qs.url) : documentURL
  });

  app.start();

  window.app = app;

});