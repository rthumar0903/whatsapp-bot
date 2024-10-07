const Shop = require("../models/shop.model");
const { updateShop } = require("../models/shop.model");
const { getRecords, updateRecord } = require("../models/utils/sqlFunction");
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

exports.updateShop = async (req, res) => {
  try {
    const {
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
    } = req?.body;
    const id = req?.params?.shopId;

    const shop = {};

    if (shopName) shop["shop_name"] = shopName;

    if (shopAddress) shop["shop_address"] = shopAddress;

    if (phoneNumber) shop["phone_number"] = phoneNumber;

    if (pinCode) shop["pincode"] = pinCode;

    // if (latitude) shop["latitude"] = latitude;

    // if (longitude) shop["longitude"] = longitude;

    if (serviceTime) shop["service_time"] = serviceTime;

    if (isFullTime !== undefined) shop["is_full_time"] = isFullTime;

    if (openTime) shop["open_time"] = openTime;

    if (closeTime) shop["close_time"] = closeTime;

    if (shopAddress) {
      const latlong = await getLatLong(shopAddress);
      if (latlong?.data?.length > 0) {
        shop["latitude"] = latlong?.data?.[0].lat;
        shop["longitude"] = latlong?.data?.[0].lon;
      }
    }
    const result = await updateRecord("shops", shop, "id", id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
  }
};
