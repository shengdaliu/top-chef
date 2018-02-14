var rp = require('request-promise');
var cheerio = require('cheerio');
var jsonfile = require('jsonfile');

// function getLaFourchette(){
//     var urlLaFourchette = 'https://www.lafourchette.com/search-refine/'
//     const data = require('./restaurants.json');

//     var options = {
//         uri: encodeURI(urlLaFourchette),
//         transform: function (body) {
//             return cheerio.load(body);
//         }
//     };

//     data.forEach(element => {
//         options.url = encodeURI(urlLaFourchette + element.name);
        
//         rp(options)
//             .then(function ($) {
//                 $('#results').find('.resultItem-saleType').each((index, element) => {
//                     console.log($(element).children().first().text());
//                 });
//             })
//     });    
// }

exports.getDeal = function getDeal(restaurants) {
    var urlLaFourchette = 'https://www.lafourchette.com/search-refine/'

    var options = {
        uri: encodeURI(urlLaFourchette),
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    restaurants.forEach(element => {
        options.url = encodeURI(urlLaFourchette + element.name);
        
        rp(options)
            .then(function ($) {
                $('#results').find('.resultItem-saleType').each((index, element) => {
                    console.log($(element).children().first().text());
                });
            })
    });
}