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
// var restaurants = require('./restaurants.json');
// lafourchette.getDeal()

// function getLaFourchette() {
//     var urlLaFourchette = 'https://www.lafourchette.com/search-refine/'
//     const data = require('./restaurants.json');
//     var results = [];

//     var options = {
//         uri: encodeURI(urlLaFourchette),
//         timeout: 600000, // 10 min.
//         resolveWithFullResponse: true,
//         transform: function (body) {
//             return cheerio.load(body);
//         }
//     };

//     var count = 0;
//     data.forEach(restaurant => {
//         options.uri = encodeURI(urlLaFourchette + restaurant.name);

//         rp(options)
//             .then(function ($) {
//                 $('#results').find('.resultItem').each((index, element) => {
//                     console.log(options.uri);
//                     console.log($(element).find('.resultItem-address').text());
//                     console.log(restaurant.postalCode);
//                     if ($(element).find('.resultItem-saleType').length >= 1) {
//                         if ($(element).find('.resultItem-saleType').children().text().indexOf('Non réservable sur LaFourchette') === -1 &&
//                             $(element).find('.resultItem-saleType').children().text() === null &&
//                             $(element).find('.resultItem-saleType').children().text() === '' &&
//                             $(element).find('.resultItem-address').text().indexOf(restaurant.postalCode) > 0) {

//                             // count++;
//                             // console.log(count);
//                             // console.log($(element).find('.resultItem-name').children().text());
//                             // console.log($(element).find('.resultItem-saleType').children().text());
//                             // var obj = {
//                             //     name: $(element).find('.resultItem-name').children().text(),
//                             //     offer: $(element).find('.resultItem-saleType').children().text()
//                             // };
//                             // results.push(obj);
//                         }
//                     }
//                 });
//             })
//     });

//     // rp(options).then(function () {
//     //     jsonfile.writeFile(file, results, {
//     //         spaces: 2
//     //     }, function (err) {
//     //         if(err)
//     //             console.error(err)
//     //         else
//     //             console.log("The file was saved!");
//     //     });
//     // })
// }

// getLaFourchette();

lafourchette.storeUrl();

app.listen('8081')

console.log('Server running on port 8081');

exports = module.exports = app;