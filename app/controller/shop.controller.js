const { getRecords } = require("../models/utils/sqlFunction");

exports.getShops = async (req, res) => {
  try {
    // const customerDetails = await checkRecordExists("users", "id", id);
    const shops = await getRecords("shops");
    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
