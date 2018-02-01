var express = require('express');
var fs = require('fs');
var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');
var app = express();

var data = [];


url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';

// request(url, function (error, response, html) {
//     if (!error) {
//         var $ = cheerio.load(html);

//         //console.log($('div[attr-gtm-type="poi"]'));

//         $('div[attr-gtm-type="poi"]').each((index,element) => {
//             console.log($(element).find('.poi-card-link').attr('href'));
//             data.push($(element).find('.poi-card-link').attr('href'));
//         });
//         //console.log($('div[attr-gtm-type="poi"]')[0].children[1].attribs.href);
//     }
// });

// app.get('/scrape', function (req, res) {

//     url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';

//     request(url, function (error, response, html) {
//         if (!error) {
//             var $ = cheerio.load(html);

//             //console.log($('div[attr-gtm-type="poi"]'));

//             [$('div[attr-gtm-type="poi"]')].forEach(element => {
//                 console.log($(element));
//             });
//             //console.log($('div[attr-gtm-type="poi"]')[0].children[1].attribs.href);

//             res.send(response);
//         }

//         // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
//         //res.send('Check your console!')
//     });
// })

function loadRestaurant(url, callback) {
    var data = [];
    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            //console.log($('div[attr-gtm-type="poi"]'));

            $('div[attr-gtm-type="poi"]').each((index, element) => {
                //console.log($(element).find('.poi-card-link').attr('href'));
                data.push($(element).find('.poi-card-link').attr('href'));
            });
            //console.log($('div[attr-gtm-type="poi"]')[0].children[1].attribs.href);
        }
    });

    callback && callback(data);
}


app.listen('8081')

console.log('Server running on port 8081');

exports = module.exports = app;