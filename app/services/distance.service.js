const Shop = require("../models/shop.model");
const { getDistance } = require("../models/utils/distanceFunction");

exports.findMinShopDistance = (latitude, longitude, callback) => {
  Shop.findAllShop((err, data) => {
    if (err) {
      return callback(err, null);
    }
    if (!data || data.length === 0) {
      return callback(new Error("No shops found"), null);
    }

    // Initialize minDist and minShopId with the first shop's data
    let minDist = getDistance(
      latitude,
      longitude,
      data[0]?.latitude,
      data[0]?.longitude
    );
    let minShopId = data[0]?.id;

    // Iterate over each shop to find the minimum distance and corresponding shopId
    data.forEach((element) => {
      const currentDist = getDistance(
        latitude,
        longitude,
        element?.latitude,
        element?.longitude
      );
      if (currentDist < minDist) {
        minDist = currentDist;
        minShopId = element?.id; // Store the shopId with the minimum distance
      }
    });

    // Return both minDist and minShopId
    callback(null, { minDist, shopId: minShopId });
  });
};
