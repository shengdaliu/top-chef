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
// var restaurants = require('./test.json');
// lafourchette.getDeal()

function getLaFourchette() {
    var urlLaFourchette = 'https://www.lafourchette.com/search-refine/'
    const data = require('./restaurants.json');
    var results = [];

    var options = {
        uri: encodeURI(urlLaFourchette),
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    data.forEach(element => {
        options.uri = encodeURI(urlLaFourchette + element.name);
        rp(options)
            .then(function ($) {
                $('#results').find('.resultItem').each((index, element) => {
                    if ($(element).find('.resultItem-saleType').length >= 1) {
                        if ($(element).find('.resultItem-saleType').children().text().indexOf('Non réservable sur LaFourchette') === -1 ||
                            null || '') {
                            console.log($(element).find('.resultItem-name').children().text());
                            console.log($(element).find('.resultItem-saleType').children().text());
                            // var obj = {
                            //     name: '',
                            //     offer: $(element).children().text()
                            // };
                            // results.push(obj);
                        }
                    }
                });
            })
    });

    // rp(options).then(function () {
    //     jsonfile.writeFile(file, results, {
    //         spaces: 2
    //     }, function (err) {
    //         if(err)
    //             console.error(err)
    //         else
    //             console.log("The file was saved!");
    //     });
    // })
}

getLaFourchette();

app.listen('8081')

console.log('Server running on port 8081');

exports = module.exports = app;