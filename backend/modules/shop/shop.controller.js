// modules/shop/shop.controller.js
const Shop = require('../shop/shop.model.js'); // ✅ This points to the 'shop' module
const updateShopLocation = async (req, res) => {
  const { lat, lng } = req.body;
  
  // Get shopId from the authenticated owner (assumes req.user.shop is set on login/approval)
  const shopId = req.user.shop; 
  
  if (!lat || !lng) {
    return res.status(400).json({ msg: 'Missing lat or lng' });
  }

  try {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ msg: 'Shop not found' });
    }

    shop.location = {
      type: 'Point',
      coordinates: [lng, lat], // [longitude, latitude]
    };

    await shop.save();
    res.json({ msg: 'Shop location updated!', shop });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getNearbyShops = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ msg: 'Latitude and longitude are required' });
  }

  try {
    const shops = await Shop.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)], // [lng, lat]
          },
          $maxDistance: 10000, // 10km radius
        },
      },
    });
    res.json(shops);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  updateShopLocation,
  getNearbyShops,
};