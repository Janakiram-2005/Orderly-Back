// This file might be a duplicate of shop.model.js
// For now, you can keep it simple or point to the shop model.

// For simplicity, let's just re-export the Shop model
// if 'Restaurant' and 'Shop' are the same thing.
// If they are different, define a new schema here.
const Shop = require('../shop/shop.model.js');
module.exports = Shop;