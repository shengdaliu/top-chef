var request = require('request');
var fs = require('fs');
var rp = require('request-promise');
var cheerio = require('cheerio');
var jsonfile = require('jsonfile');
var stringSimilarity = require('string-similarity');
var michelin = require('./michelin');

var michelin_data = './data/restaurants.json';
var lafourchette_data = './data/lafourchette.json';
var results_data = './data/results.json';

function getUrl(name, postalCode, callback) {
    var options = {
        uri: "https://m.lafourchette.com/api/restaurant-prediction?name=" + encodeURIComponent(name),
        timeout: 600000, // 10 min.
        resolveWithFullResponse: true,
        transform: function (body) {
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
    var json = require(michelin_data);
    var urls = [];
    json.forEach(restaurant => {
        getUrl(restaurant.name, restaurant.postalCode, function (url) {
            urls.push({
                "name": restaurant.name,
                "adress": restaurant.thoroughfare + ' ' + restaurant.postalCode + ' ' + restaurant.city,
                "chef": restaurant.chef,
                "star": restaurant.star,
                "url": url,
            });
            fs.writeFile(lafourchette_data, JSON.stringify(urls), 'utf8', function (err) {
                if (!err) {
                    // console.log('URL has been added.');
                } else {
                    return console.log(err);
                }
            });
        });
    });
}

function getSale(url, callback) {
    var specialOffers = [];
    var options = {
        uri: url + '/sale-type',
        timeout: 600000, // 10 min.
        resolveWithFullResponse: true,
        transform: function (body) {
            return body;
        }
    };
    rp(options)
        .then(function (data) {
            JSON.parse(data).forEach(result => {
                if (result.is_special_offer === true) {
                    specialOffers.push(result.title);
                }
            })
        })
        .then(function () {
            callback(specialOffers)
        });
}

function getAllSales() {
    var json = require(lafourchette_data);
    var data = [];
    json.forEach(restaurant => {
        getSale(restaurant.url, function (specialOffers) {
            if (specialOffers[0] !== undefined) {
                data.push({
                    "name": restaurant.name,
                    "adress": restaurant.address,
                    "chef": restaurant.chef,
                    "star": restaurant.star,
                    "url": restaurant.url,
                    "specialOffers": specialOffers
                });
            }

            fs.writeFile(results_data, JSON.stringify(data), 'utf8', function (err) {
                if (!err) {
                    // console.log('URL has been added.');
                } else {
                    return console.log(err);
                }
            });
        });
    });
}

exports.getUrl = getUrl;
exports.storeUrl = storeUrl;
exports.getAllSales = getAllSales;