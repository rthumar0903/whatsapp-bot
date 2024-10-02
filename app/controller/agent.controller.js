const { findAgentsDetails } = require("../models/agent.model");

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
      console.log("data - - - - ", data);
      if (data.length === 0) {
        return res.status(404).json("Data not found");
      } else res.status(200).json(data);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
