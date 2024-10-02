const sql = require("./db.js");

exports.findAgentsDetails = (result) => {
  const query = `SELECT u.name,u.phone_number,a.user_id FROM users u JOIN agent a ON a.user_id = u.id`;
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};
