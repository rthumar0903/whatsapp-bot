const { PHONE_ID } = require("../config/whatsapp.config.js");
const axios = require("axios");
const otpGenerator = require("otp-generator");
const { sendOtp } = require("../services/meta.services.js");
const { insertOtp } = require("../models/auth.model.js");
const {
  checkRecordExists,
  updateRecord,
} = require("../models/utils/sqlFunction.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
exports.sendteOtpService = async (phoneNumber) => {
  try {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
      lowerCaseAlphabets: false,
    });
    console.log("otp", phoneNumber);
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

exports.authorize = (roles = []) => {
  // roles param can be a single role string (e.g. Role.Admin)
  // or an array of roles (e.g. [Role.Admin, Role.User])
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    jwt.verify(token, "your_jwt_secret", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Check if the role is allowed
      console.log("roles", roles, decoded.role);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = decoded; // Save user data for next middleware
      next();
    });
  };
};
