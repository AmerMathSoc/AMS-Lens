var http = require('http');
var express = require('express');
var path = require('path');
var _ = require("underscore");
var fs = require('fs');
var path = require("path");

var sass = require('node-sass');
var browserify = require('browserify');

var app = express();

var port = process.env.PORT || 4001;
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());


app.get('/lens.js', function (req, res, next) {
  browserify({ debug: true, cache: false })
    .add(path.join(__dirname, "boot.js"))
    .bundle()
    .on('error', function(err, data){
      console.error(err.message);
      res.send('console.log("'+err.message+'");');
    })
    .pipe(res);
});

var handleError = function(err, res) {
  console.error(err);
  res.status(400).json(err);
};

var renderSass = function(cb) {
  sass.render({
    file: path.join(__dirname, "lens.scss"),
    sourceMap: true,
    outFile: 'lens.css',
  }, cb);
};

app.get('/lens.css', function(req, res) {
  renderSass(function(err, result) {
    if (err) return handleError(err, res);
    res.set('Content-Type', 'text/css');
    res.send(result.css);
  });
});

app.get('/lens.css.map', function(req, res) {
  renderSass(function(err, result) {
    if (err) return handleError(err, res);
    res.set('Content-Type', 'text/css');
    res.send(result.map);
  });
});

// Serve files from root dir
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'assets')));

// Serve Lens in dev mode
// --------

app.use(app.router);

http.createServer(app).listen(port, function(){
  console.log("Lens running on port " + port);
  console.log("http://127.0.0.1:"+port+"/");
});