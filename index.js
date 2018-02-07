var express = require('express');
var fs = require('fs');
var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');
var app = express();
var jsonfile = require('jsonfile')

var url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
var data = [];
var file = 'test.json'

var options = {
    uri: url,
    transform: function (body) {
        return cheerio.load(body);
    }
};


for (i = 0; i <= 34; i++) {
    page = '/page-' + i;
    options.uri += page;
    rp(options)
        .then(function ($) {
            $('div[attr-gtm-type="poi"]').each((index, element) => {
                var obj = {
                    name: $(element).attr('attr-gtm-title'),
                    uri: $(element).find('.poi-card-link').attr('href')
                };
                data.push(obj);
            });
        })
}

rp(options).then(function () {
    jsonfile.writeFile(file, data, {
        spaces: 2
    }, function (err) {
        console.error(err)
        console.log("The file was saved!");
    });
})

// document.querySelectorAll('.resultItem-saleType')[0].textContent

app.listen('8081')

console.log('Server running on port 8081');

exports = module.exports = app;