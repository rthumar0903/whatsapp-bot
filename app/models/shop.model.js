const sql = require("./db.js");

const Shop = function (shop) {
  this.id = shop.id;
  this.shop_code = shop.shop_code;
  this.shop_name = shop.shop_name;
  this.shop_address = shop.shop_address;
  this.phone_number = shop.phone_number;
  this.pincode = shop.pincode;
  this.latitude = shop.latitude;
  this.longitude = shop.longitude;
  this.service_time = shop.service_time;
  this.agent_id = shop.agent_id;
};

Shop.findAllShop = (result) => {
  sql.query(`SELECT * FROM shops`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    // not found Tutorial with the id
    result(null, res);
  });
};

module.exports = Shop;
