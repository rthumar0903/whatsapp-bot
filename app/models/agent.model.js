const sql = require("./db.js");

exports.findAgentsDetails = (result) => {
  const query = `SELECT u.name,u.phone_number,a.user_id,a.id FROM users u JOIN agent a ON a.user_id = u.id`;
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

exports.updateAgent = (agent, userId, result) => {
  const query = `Update users SET ? where id=?`;
  sql.query(query, [agent, userId], (err, res) => {
    if (err) {
      console.error(err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

exports.findAgentDetails = (id, result) => {
  console.log(id);
  const query = `SELECT u.name,u.phone_number,a.user_id,a.id FROM users u JOIN agent a ON a.user_id = u.id where a.id=?`;
  sql.query(query, id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};
