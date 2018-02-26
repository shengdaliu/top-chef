var express = require('express');
var fs = require('fs');
var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');
var app = express();
var jsonfile = require('jsonfile');
var michelin = require('./michelin');
var lafourchette = require('./lafourchette');

// michelin.get();
// lafourchette.storeUrl();
// lafourchette.getAllSales();

var results = require('./results.json');

app.get('/test', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(results));
})

app.listen('8081')

console.log('Server running on port 8081');

exports = module.exports = app;