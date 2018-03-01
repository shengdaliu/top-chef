var michelin = require('./michelin');
var lafourchette = require('./lafourchette');

// async function getLaFouchette() {
//     await michelin.get();
//     lafourchette.storeUrl();
//     return new Promise(resolve => {
//         resolve();
//     })
// }
// // async function build() {
// //     await getLaFouchette();
// //     lafourchette.getAllSales();
// // }
// build();

michelin.get();
setTimeout(() => lafourchette.storeUrl(), 120000);
setTimeout(() => lafourchette.getAllSales(), 140000);
