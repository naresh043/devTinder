const bcrypt = require("bcrypt");
const user = require("../models/user");
const {validateSignUpData}=require("../utils/validation")
const express = require("express");
const authRouter = express.Router()

// POST (create) new user
authRouter.post("/user", async (req, res) => {
  try {
    validateSignUpData(req.body);
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const newUser = new user({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const UserSaved = await newUser.save();

    if (!UserSaved) {
      throw new Error("User data invalid");
    }

    res.send("User created successfully");
  } catch (err) {
    console.error("Error creating user: " + err.message);
    res.status(500).send("Error creating user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const validUser = await user.findOne({ email });
  if (!validUser) {
    throw new Error("Invalid credentials !");
  }
  const isPasswordValid = await validUser.validatePassword(password);
  if (isPasswordValid) {
    //jwt token logic
    //create the jwt token
    //add token into cookie send the response back to user
    const token = await validUser.getJWT();
    res.cookie("token", token);
    res.status(200).send("login Successful !");
  } else {
    throw new Error("Invalid credentials !");
  }
});

// GET user by email — using query params instead of body (GET should not have a body)
// app.get("/user", async (req, res) => {
//   try {
//     // const eMailId = req.query.email;
//     // if (!eMailId) {
//     //   return res.status(400).send("Email is required");
//     // }
//     const Users = await user.findOne({});

//     // Check if user exists
//     if (!Users) {
//       return res.status(404).send("User not found");
//     }

//     res.status(200).send(Users);
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     res.status(500).send("Error fetching users");
//   }
// });

module.exports={
    authRouter
}
