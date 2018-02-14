var rp = require('request-promise');
var cheerio = require('cheerio');
var jsonfile = require('jsonfile');

function getDescription(uri) {
    var options = {
        uri: uri,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    return new Promise((resolve, reject) => {
        rp(options)
            .then(function ($) {
                var obj = {
                    name: $('.poi_intro-display-title').text().substring(7, a.length - 4),
                    adress: $('.thoroughfare').first().text(),
                    postalCode: $('.postal-code').first().text(),
                    city: $('.locality').first().text(),
                    uri: uri
                };
                console.log(obj);
                return resolve(obj);
            })
            .catch(error => resolve(error));
    });
}

exports.get = function getMichelinRestaurant() {
    var url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
    var file = 'restaurants.json'
    var uris = [];
    var data = [];

    var options = {
        uri: url,
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
        var promises = uris.map(uri => getDescription(uri));

        Promise.all(promises).then(result => {
            data.push(result);
            console.log('All promise reached');
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