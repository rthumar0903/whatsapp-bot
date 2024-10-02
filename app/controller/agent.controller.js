const { findAgentsDetails, addAgent } = require("../models/agent.model");
const {
  insertRecord,
  checkRecordExists,
} = require("../models/utils/sqlFunction");

exports.getAgents = async (req, res) => {
  try {
    // const customerDetails = await checkRecordExists("users", "id", id);
    // const shops = await getRecords("shops");
    await findAgentsDetails(async (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial.",
        });
      if (data.length === 0) {
        return res.status(404).json("Data not found");
      } else res.status(200).json(data);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addAgent = async (req, res) => {
  try {
    // const customerDetails = await checkRecordExists("users", "id", id);
    // const shops = await getRecords("shops");
    const { name, phoneNumber } = req.body;
    const user = {
      name,
      phone_number: phoneNumber,
      role: "Agnet",
    };
    const isUserExist = await checkRecordExists(
      "users",
      "phone_number",
      phoneNumber
    );
    if (!isUserExist === null) {
      return res.status(400).send({
        message: "phoneNumber already exist",
      });
    }
    const userAdded = await insertRecord("users", user);
    const userResult = await checkRecordExists(
      "users",
      "phone_number",
      phoneNumber
    );
    const agent = {
      user_id: userResult?.id,
    };
    // console.log("user added", userAdded);
    await addAgent(agent, async (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial.",
        });
      else res.status(201).send(data);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
