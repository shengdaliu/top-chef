var rp = require('request-promise');
var cheerio = require('cheerio');
var jsonfile = require('jsonfile');

function getDescription(uri) {
    var options = {
        uri: uri,
        timeout: 600000, // 10 min.
        resolveWithFullResponse: true,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    return new Promise((resolve, reject) => {
        var obj = {}
        rp(options)
            .then(function ($) {
                var name = $('h1').first().text(); // $('.poi_intro-display-title').text().substring(7, $('.poi_intro-display-title').text().length - 4),
                var thoroughfare = $('.thoroughfare').first().text();
                var postalCode = $('.postal-code').first().text();;
                var city = $('.locality').first().text();
                var chef = $('.field--name-field-chef').children('.field__items').text();
                var star = 1;
                if ($('span').hasClass('icon-cotation2etoiles')) {
                    star = 2;
                }
                if ($('span').hasClass('icon-cotation3etoiles')) {
                    star = 3;
                }

                obj = {
                    name: name,
                    thoroughfare: thoroughfare,
                    postalCode: postalCode,
                    city: city,
                    uri: uri,
                    chef: chef,
                    star: star
                };
                return resolve(obj);
            }).catch(error => resolve(error));
    });
}

function getMichelinRestaurant() {
    var url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
    var file = 'restaurants.json'
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

    for (i = 0; i <= 35; i++) {
        page = '/page-' + i;
        options.uri += page;
        rp(options)
            .then(function ($) {
                $('div[attr-gtm-type="poi"]').each((index, element) => {
                    uris.push('https://restaurant.michelin.fr' + $(element).find('.poi-card-link').attr('href'));
                });
            })
    }

    rp(options).then(function () {
        console.log('All URIs reached');
        console.log(uris.length);
        var promises = uris.map(uri => getDescription(uri));
        Promise.all(promises).then(result => {
            data = result;
            console.log('All promises reached');
        }).then(function () {
            jsonfile.writeFile(file, data, {
                spaces: 2
            }, function (err) {
                if (err)
                    console.error(err)
                else
                    console.log("The file was saved!");
            });
        })
    })
}

exports.get = getMichelinRestaurant;