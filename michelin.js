var rp = require('request-promise');
var cheerio = require('cheerio');
var jsonfile = require('jsonfile');

exports.get = function getMichelinRestaurant() {
    var url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
    var file = 'restaurants.json'
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
            if(err)
                console.error(err)
            else
                console.log("The file was saved!");
        });
    })
}
