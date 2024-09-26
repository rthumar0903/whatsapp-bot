// SELECT
// c.id,
// s.agent_id
// FROM
//   users u
// LEFT JOIN
//   customers c ON c.user_id = u.id
// LEFT JOIN
//   shops s ON s.id = c.shop_id
// WHERE
//   u.phone_number = "919277250716";

const sql = require("./db.js");

exports.findCustomerAgent = (phoneNumber, result) => {
  const query = `SELECT c.id, s.agent_id FROM users u LEFT JOIN customers c ON c.user_id = u.id LEFT JOIN shops s ON s.id = c.shop_id WHERE u.phone_number = ?`;
  sql.query(query, [phoneNumber], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

exports.insertOrder = (order, result) => {
  sql.query("INSERT INTO orders SET ?", order, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created order : ", { id: res.insertId, ...order });
    result(null, { id: res.insertId, ...order });
  });
};
