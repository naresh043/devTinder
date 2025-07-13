const bcrypt = require("bcrypt");
const user = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const express = require("express");
const authRouter = express.Router();

// POST (create) new user
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req.body);
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      photoURL,
      skills,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);

    const newUser = new user({
      firstName,
      lastName,
      email,
      age,
      gender,
      photoURL,
      skills,
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
    return res.status(500).json({
      success: false,
      message: "Invalid credentials !",
    });
  }
  const isPasswordValid = await validUser.validatePassword(password);
  if (isPasswordValid) {
    //jwt token logic
    //create the jwt token
    //add token into cookie send the response back to user
    const token = await validUser.getJWT();
    res.cookie("token", token);
    res.status(200).json({
      success: true,
      message: "Login successful!",
      data: {
        user: validUser,
      },
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "Invalid credentials !",
    });
  }
});
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.status(200).send("Logout Successful !");
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

module.exports = {
  authRouter,
};
