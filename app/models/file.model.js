const { v4: uuidv4 } = require("uuid"); // Import the UUID library
const sql = require("./db.js");

exports.insertFile = (file, result) => {
  sql.query("INSERT INTO files SET ?", file, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...file });
  });
};
