var rp = require('request-promise');
var cheerio = require('cheerio');
var jsonfile = require('jsonfile');
var Promise = require('bluebird');

var michelin_data = './data/restaurants.json';

function getDescription(uri) {
    return new Promise((resolve, reject) => {
        var obj = {}
        rp({
                uri: uri,
                timeout: 600000, // 10 min.
                resolveWithFullResponse: true,
                transform: function (body) {
                    return cheerio.load(body);
                }
            })
            .then(function ($) {
                var star = 1;
                if ($('span').hasClass('icon-cotation2etoiles')) {
                    star = 2;
                }
                if ($('span').hasClass('icon-cotation3etoiles')) {
                    star = 3;
                }

                obj = {
                    name: $('h1').first().text(),
                    thoroughfare: $('.thoroughfare').first().text(),
                    postalCode: $('.postal-code').first().text(),
                    city: $('.locality').first().text(),
                    uri: uri,
                    chef: $('.field--name-field-chef').children('.field__items').text(),
                    star: star
                };
                return resolve(obj);
            }).catch(error => resolve(error));
    });
}

function getMichelinRestaurant() {
    var url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
    var uris = [];
    var data = [];

    var options = {
        uri: url,
        timeout: 600000, // 10 min.
        resolveWithFullResponse: true,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    var uris_promises = [];
    for(i = 0; i <= 35; i++) {
        page = '/page-' + i;
        options.uri += page;

        var promise = rp(options)
                        .then(function ($) {
                            $('div[attr-gtm-type="poi"]').each((index, element) => {
                                uris.push('https://restaurant.michelin.fr' + $(element).find('.poi-card-link').attr('href'));
                            });
                        })
        uris_promises.push(promise);
    }

    Promise.all(uris_promises).then(() => {
        console.log(uris.length + ' URIs reached');
        Promise.map(uris, function(uri) {
            return getDescription(uri).delay(0);
        }).then(function(results) {
            console.log('All ' + results.length + ' promises reached');
            jsonfile.writeFile(michelin_data, results, function (err) {
                if (err)
                    console.error(err)
                else
                    console.log("The file was saved!");
            });
        })
    })
}

exports.get = getMichelinRestaurant;