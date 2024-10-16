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

const { v4: uuidv4 } = require("uuid"); // Import the UUID library
const sql = require("./db.js");

exports.findCustomerAgent = (phoneNumber, result) => {
  const query = `SELECT c.id,c.address,u.name, s.agent_id FROM users u LEFT JOIN customers c ON c.user_id = u.id LEFT JOIN shops s ON s.id = c.shop_id WHERE u.phone_number = ?`;
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
  order.id = uuidv4();
  sql.query("INSERT INTO orders SET ?", order, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...order });
  });
};

exports.findAgentDetails = (shopId, result) => {
  const query = `SELECT users.id, users.name, users.phone_number FROM shops JOIN agent ON shops.agent_id = agent.id JOIN users ON agent.user_id = users.id WHERE shops.id = ?`;
  sql.query(query, [shopId], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

exports.getOrders = (agentId, result) => {
  const query = `SELECT * from orders JOIN files ON orders.id=files.order_id JOIN customers ON orders.customer_id = customers.id JOIN users ON customers.user_id= users.id WHERE orders.agent_id = ?`;
  sql.query(query, [agentId], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};
