const Shop = require("../models/shop.model");
const { getRecords } = require("../models/utils/sqlFunction");
const { getLatLong } = require("../services/address.service");

exports.getShops = async (req, res) => {
  try {
    // const customerDetails = await checkRecordExists("users", "id", id);
    const shops = await getRecords("shops");
    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addShops = async (req, res) => {
  try {
    const {
      shopCode,
      shopName,
      shopAddress,
      phoneNumber,
      pinCode,
      latitude,
      longitude,
      serviceTime,
      isFullTime,
      openTime,
      closeTime,
      agentId,
    } = req.body;

    const shop = new Shop({
      shop_code: shopCode,
      shop_name: shopName,
      shop_address: shopAddress,
      phone_number: phoneNumber,
      pincode: pinCode,
      latitude,
      longitude,
      service_time: serviceTime,
      is_full_time: isFullTime,
      open_time: openTime,
      close_time: closeTime,
      agent_id: agentId,
    });
    if (shopAddress) {
      const latlong = await getLatLong(shopAddress);
      if (latlong?.data?.length > 0) {
        shop.latitude = latlong?.data?.[0].lat;
        shop.longitude = latlong?.data?.[0].lon;
      }
    }
    await Shop.insertShop(shop, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial.",
        });
      else res.send(data);
    });
  } catch (error) {
    console.error(error);
  }
};
