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

User.findCustomerUser = (customerId, result) => {
  const query = `SELECT u.name, u.phone_number, u.role,c.latitude,c.longitude,c.address FROM customers as c JOIN users as u ON c.user_id = u.id WHERE u.id =?`;
  sql.query(query, [customerId], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

User.findCustomers = (role, result) => {
  const query = `SELECT u.name, u.phone_number, u.role,c.pincode,c.latitude,c.longitude,c.address FROM customers as c JOIN users as u ON c.user_id = u.id WHERE u.role =?`;
  sql.query(query, [role], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

module.exports = User;
