const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/authMiddleware");
const User = require("../models/user");
const connectionRequestModel = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName age gender photoURL skills";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequestModel
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", USER_SAFE_DATA);
    return res
      .status(200)
      .json({ message: "data fetched successful ", data: connectionRequests });
  } catch (err) {
    console.error("Error :" + err.message);
    return res.status(400).json({ message: "Error: " + err.message });
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log(loggedInUser, "log User");
    const connectionRequests = await connectionRequestModel
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    console.log(connectionRequests);
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    return res.status(200).json({
      message: "Connections fetched successfully",
      data: data,
    });
  } catch (err) {
    console.error("Error: " + err.message);
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequestModel
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");
    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString()),
        hideUserFromFeed.add(req.toUserId.toString());
    });
    const Users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA);

    // console.log(Users);
    res.send(Users);
  } catch (err) {
    console.error("ERROR: " + err.message);
    res.status(400).json({
      message: "ERROR: " + err.message,
    });
  }
});
module.exports = {
  userRouter,
};
