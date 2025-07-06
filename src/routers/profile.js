const express=require("express");
const {userAuth}=require("../middlewares/authMiddleware")
const profileRouter=express.Router()

//get/profile ;
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "This is the Profile Page!", user: req.user });
  } catch (error) {
    console.error("Error in /profile route:", error.message);
    res.status(403).json({ error: "Invalid or expired token." });
  }
});

module.exports={
    profileRouter
}