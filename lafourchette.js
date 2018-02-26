var request = require('request');
var fs = require('fs');
var rp = require('request-promise');
var cheerio = require('cheerio');
var jsonfile = require('jsonfile');
var stringSimilarity = require('string-similarity');
var michelin = require('./michelin');

function getUrl(name, postalCode, callback) {
    // var options = {
    //     uri: 'https://www.lafourchette.com/search-refine/' + encodeURIComponent(name),
    //     headers: {
    //         'cookie': 'datadome=AHrlqAAAAAMAA8XUpNbGsMYALtotww=='
    //     },
    //     timeout: 300000, // 5 min.
    //     resolveWithFullResponse: true,
    //     transform: function (body) {
    //         return cheerio.load(body);
    //     }
    // };
    // var similarity = 0.60;
    // var restaurantUrl = '';
    // rp(options)
    //     .then(function ($) {
    //         if ($('.resultContainer').children().children() !== undefined) {
    //             $('.resultContainer').children().children().each(function (i, elem) {
    //                 var resultAddr = $(elem).find('.resultItem-address').text().trim();
    //                 console.log(resultAddr);
    //                 var currentRestaurantURL = $(elem).find('.resultItem-name').children().attr('href');
    //                 if (stringSimilarity.compareTwoStrings(resultAddr, address) > similarity) {
    //                     similarity = stringSimilarity.compareTwoStrings(resultAddr, address);
    //                     restaurantUrl = 'https://www.lafourchette.com' + currentRestaurantURL;
    //                 }
    //             }).then(() => {
    //                 callback(restaurantUrl);
    //             });
    //         }
    //     });

    var options = {
        uri: "https://m.lafourchette.com/api/restaurant-prediction?name=" + encodeURIComponent(name),
        timeout: 600000, // 10 min.
        resolveWithFullResponse: true,
        transform: function (body) {
            // return cheerio.load(body);
            return body;
        }
    };
    // var similarity = 0.60;
    var restaurantUrl = 'https://m.lafourchette.com/api/restaurant/';
    rp(options)
        .then(function (data) {
            if (JSON.parse(data)[0] !== undefined) {
                JSON.parse(data).forEach(result => {
                    if (result.address.postal_code == postalCode) {
                        callback(restaurantUrl + result.id);
                    }
                })
            }
        });
}

function storeUrl() {
    // var json = michelin.get();
    var json = require('./restaurants1.json');
    var urls = [];
    console.log(json.length);
    json.forEach(restaurant => {
        getUrl(restaurant.name, restaurant.postalCode, function (url) {
            urls.push({
                "name": restaurant.name,
                "adress": restaurant.thoroughfare + ' ' + restaurant.postalCode + ' ' + restaurant.city,
                "chef": restaurant.chef,
                "star": restaurant.star,
                'url': url,
            });
            fs.writeFile('lafourchette.json', JSON.stringify(urls), 'utf8', function (err) {
                if (!err) {
                    // console.log('URL has been added.');
                } else {
                    return console.log(err);
                }
            });
        });
    });
}

// function getDeal(restaurants) {
//     var urlLaFourchette = 'https://www.lafourchette.com/search-refine/'

//     var options = {
//         uri: encodeURI(urlLaFourchette),
//         transform: function (body) {
//             return cheerio.load(body);
//         }
//     };

//     restaurants.forEach(element => {
//         options.url = encodeURI(urlLaFourchette + element.name);

//         rp(options)
//             .then(function ($) {
//                 $('#results').find('.resultItem-saleType').each((index, element) => {
//                     console.log($(element).children().first().text());
//                 });
//             })
//     });
// }

exports.getUrl = getUrl;
exports.storeUrl = storeUrl;
// exports.getDeal = getDeal;