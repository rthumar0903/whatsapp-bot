const { v4: uuidv4 } = require("uuid"); // Import the UUID library
const sql = require("./db.js");

exports.insertOtp = (otp, phoneNumber, result) => {
  sql.query(
    "INSERT INTO otp (phone_number,otp) values(?,?)",
    [phoneNumber, otp],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log("res", res);
      result(null, { id: res.insertId, ...otp });
    }
  );
};
