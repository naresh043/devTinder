const express = require("express");
const { userAuth } = require("../middlewares/authMiddleware");
const { validateProfileEditData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

//get/profile ;
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "user fetched successful !",
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error("Error in /profile route:", error.message);
    res.status(403).json({ error: "Invalid or expired token." });
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // Validate the incoming data
    if (!validateProfileEditData(req)) {
      return res.status(400).json({
        success: false,
        message: "Edit not allowed!",
      });
    }

    // Get the logged-in user (make sure middleware sets req.user)
    const loggedInUser = req.user;
    // console.log(loggedInUser);
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user!",
      });
    }

    // Update only the fields provided in the request body
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    // Save the updated user data to database
    await loggedInUser.save();

    res.status(200).json({
      success: true,
      message: "user details edited successful !",
      data: {
        user: loggedInUser,
      },
    });
  } catch (err) {
    console.error("Error while editing profile:", err);

    res.status(500).json({
      success: false,
      message: "Error in editing profile!",
      error: err.message,
    });
  }
});
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const logged = req.user;
    if (!logged) {
      throw new Error("User is Unauthorized");
    }
    const isEditAllowed = Object.keys(req.body).forEach(
      (key) => key === "password"
    );
    // console.log(isEditAllowed);
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    logged.password = passwordHash;
    const userSaved = await logged.save();
    if (!userSaved) {
      throw new Error("failed to reset the password !");
    }

    res.status(200).send("Reset the password successful");
  } catch (err) {
    console.error("Error" + err.message);
    res.status(500).send("Error in password Update !" + err.message);
  }
});

module.exports = {
  profileRouter,
};
