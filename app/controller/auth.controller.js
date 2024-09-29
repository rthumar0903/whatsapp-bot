const {
  checkRecordExists,
  insertRecord,
} = require("../models/utils/sqlFunction");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { login, sendteOtpService } = require("../services/auth.service");

exports.register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ error: "Email or Password fields cannot be empty!" });
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = {
    id: uuidv4(),
    email,
    password: hashedPassword,
    role: "Admin",
  };
  try {
    const userAlreadyExists = await checkRecordExists("users", "email", email);
    if (userAlreadyExists) {
      res.status(409).json({ error: "Email already exists" });
    } else {
      await insertRecord("users", user);
      res.status(201).json({ message: "User created successfully!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.sendOtp = async (req, res) => {
  console.log("come");

  const { phoneNumber } = req.body;
  try {
    await sendteOtpService(phoneNumber);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const isAuthorize = await login(phoneNumber, otp);
    const user = await checkRecordExists("users", "phone_number", phoneNumber);
    if (isAuthorize) res.status(200).json({ data: user });
    else res.sendStatus(403);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
