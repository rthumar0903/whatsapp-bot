const sql = require("./db.js");

// constructor
const User = function (user) {
  this.name = user.name;
  this.phone_number = user.phone_number;
  this.role = user.role;
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

User.findByPhoneNumber = (phoneNumber, result) => {
  sql.query(
    `SELECT * FROM users WHERE phone_number = ${phoneNumber}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found tutorial: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Tutorial with the id
      result({ kind: "not_found" }, null);
    }
  );
};

User.updateByPhone = (phone, user, result) => {
  sql.query(
    "UPDATE users SET latitude = ?, longitude = ? WHERE phone_number = ?",
    [user.latitude, user.longitude, phone],
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
