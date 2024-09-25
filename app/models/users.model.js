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

User.updateByPhone = (phone, user, result) => {
  sql.query(
    "UPDATE users SET name = ?,latitude = ?, longitude = ?, WHERE phone_number = ?",
    [user.name, user.latitude, user.longitude, phone],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated User: ", { id: id, ...user });
      result(null, { id: id, ...user });
    }
  );
};

module.exports = User;
