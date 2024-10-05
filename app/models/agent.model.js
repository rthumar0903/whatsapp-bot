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

exports.addAgent = (agent, result) => {
  const query = `insert into agent SET ?`;
  sql.query(query, agent, (err, res) => {
    if (err) {
      console.error(err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

exports.updateAgent = (agent, result) => {
  const query = `Update agent SET ?`;
  sql.query(query, agent, (err, res) => {
    if (err) {
      console.error(err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};
