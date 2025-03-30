const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("Login attempt:", email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }
    let hashedPswd;
    try {
       hashedPswd = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "error in hashing",
      });
    }

    const user = await User.create({
      name,
      email,
      password: hashedPswd,
      role,
    });
    return res.status(200).json({
      success: true,
      message: "user created!!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "user cannot be registered.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details carefully.",
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user not registered.",
      });
    }
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };
    if (await bcrypt.compare(password, user.password)) {
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user=user.toObject();
      user.token=token;
      user.password=undefined;
      const options={
        expires : new Date(Date.now()+3 * 24 * 60 * 60 * 1000),
        httpOnly:true,

      }
      res.cookie("token",token,options).status(200).json({
        success:true,
        token,
        user,
        message:"user logged in successfully."
      })
    } else {
      return res.status(403).json({
        success: false,
        message: "password incorrect.",
      });
    }
  } catch (error) {

    return res.status(500).json({
        success: false,
        message: "login failure",
      });
  }
};
