var express = require('express');
var fs = require('fs');
var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');
var app = express();
var jsonfile = require('jsonfile');
var michelin = require('./michelin');
var lafourchette = require('./lafourchette');
var cors = require('cors');

var results = require('./data/results_old.json');

app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/offers', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(results));
})

app.listen('8080')
console.log('Server running on port 8080');

exports = module.exports = app;