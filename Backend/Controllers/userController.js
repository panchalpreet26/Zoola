const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sec_key = process.env.SECRET_KEY;

const signup = async (req, res) => {
  try {
    const emailExists = await userModel.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(500).json({ message: "Email Already Exist Try Again.." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new userModel({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashPassword,
      address: req.body.address,
      phone: req.body.phone,
      image: req.file ? req.file.filename : null,
    });

    const result = await user.save();
    const token = jwt.sign({ email: result.email, id: result._id }, sec_key);
    res.status(201).json({
      message: "New User Added Sucessfully",
      result: result,
      token: token,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailExists = await userModel.findOne({ email });

    if (!emailExists) {
      return res.status(400).json({ message: "Email not matched" });
    }

    const passwordMatch = await bcrypt.compare(password, emailExists.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Password not matched" });
    }

    const token = jwt.sign({ email: emailExists.email, id: emailExists._id }, sec_key, { expiresIn: "1h" });

    res.status(200).json({ success: true, user: emailExists, token: token });
  } catch (e) {
    console.error("Signin error:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

const Delete = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await userModel.findByIdAndDelete(id);
    res.status(200).json({ data: product });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const fetchall = async (req, res) => {
  try {
    const product = await userModel.find();
    res.status(200).json({ data: product });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    if (req.file) {
      updates.image = req.file.filename;
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
const firebaseLogin = async (req, res) => {
  try {
    const { email, firstname, lastname, image } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = new userModel({
        firstname,
        lastname,
        email,
        password: "firebase_oauth", // dummy
        address: "N/A",
        phone: "N/A",
        image,
      });
      await user.save();
    }

    const token = jwt.sign({ email: user.email, id: user._id }, sec_key, { expiresIn: "1h" });

    res.status(200).json({ success: true, user, token });
  } catch (err) {
    console.error("Firebase login error:", err);
    res.status(500).json({ message: "Firebase login failed" });
  }
};



module.exports = { signup, signin, Delete, fetchall, getUserById, updateUser , firebaseLogin };
