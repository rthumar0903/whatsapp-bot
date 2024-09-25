const sql = require("./db.js");

// constructor
const User = function (user) {
  this.name = user.name;
  this.phone_number = user.phone_number;
  this.pin_code = user.pin_code;
  this.latitude = user.latitude;
  this.longitude = user.longitude;
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user : ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

module.exports = User;
