const { PHONE_ID } = require("../config/whatsapp.config.js");
const axios = require("axios");
const otpGenerator = require("otp-generator");
const { sendOtp } = require("../services/meta.services.js");
const { insertOtp } = require("../models/auth.model.js");
const {
  checkRecordExists,
  updateRecord,
} = require("../models/utils/sqlFunction.js");
exports.sendteOtpService = async (phoneNumber) => {
  try {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
      lowerCaseAlphabets: false,
    });
    await sendOtp(otp, phoneNumber);
    const existOtp = await checkRecordExists(
      "otp",
      "phone_number",
      phoneNumber
    );
    if (existOtp === null)
      await insertOtp(otp, phoneNumber, async (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Tutorial.",
          });
        return;
      });
    const updateOtp = {
      otp,
    };
    await updateRecord("otp", updateOtp, "phone_number", phoneNumber);
  } catch (ex) {
    console.log(ex);
  }
};

exports.login = async (phoneNumber, otp) => {
  try {
    const isExist = await checkRecordExists("otp", "phone_number", phoneNumber);
    if (isExist != null && isExist?.otp == otp) {
      return true;
    } else {
      return false;
    }
  } catch (ex) {
    console.log(ex);
  }
};
