const { getOrders } = require("../models/order.model");
const { checkRecordExists } = require("../models/utils/sqlFunction");

exports.getAgentDetails = async (req, res) => {
  try {
    const userId = req?.params?.userId;
    // const customerDetails = await checkRecordExists("users", "id", id);
    const agent = await checkRecordExists("agent", "user_id", userId);
    console.log("agent", agent);
    if (agent === null) return res.status(404).json("Data not found");
    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getOrderDetails = async (req, res) => {
  try {
    const agentId = req?.params?.agentId;
    // console.log(agentId);
    // const customerDetails = await checkRecordExists("users", "id", id);
    await getOrders(agentId, async (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial.",
        });
      console.log("data - - - - ", data[0]);
      if (data.length === 0) {
        return res.status(404).json("Data not found");
      } else res.status(200).json(data);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
