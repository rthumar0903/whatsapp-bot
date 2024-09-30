const {
  checkRecordExists,
  insertRecord,
} = require("../models/utils/sqlFunction");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const User = require("../models/users.model");

exports.getCustomerDetails = async (req, res) => {
  try {
    const id = req?.params?.id;
    console.log("----id", req.params);
    // const customerDetails = await checkRecordExists("users", "id", id);
    User.findCustomerUser(id, async (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial.",
        });
      console.log("data - - - - ", data[0]);
      if (data.length === 0) {
        return res.status(404).json("Data not found");
      } else res.status(200).json(data[0]);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    User.findCustomers("Customer", async (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial.",
        });
      console.log("data - - - - ", data);
      if (data.length === 0) {
        return res.status(404).json("Data not found");
      } else res.status(200).json(data);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
