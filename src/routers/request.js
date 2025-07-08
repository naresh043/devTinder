const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/authMiddleware");
const User = require("../models/user");
const connectionRequestModel = require("../models/connectionRequest");

//sendConnectonRequest Api
requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("user Not Fround");
    }
    res.status(200).send("send request successful !!!");
  } catch (err) {
    console.error("Error in send connection Request !" + err.message);
    res.status(500).send("Error in sending connection request !");
  }
});

requestRouter.post(
  "/request/send/:status/:fromUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.fromUserId;
      const status = req.params.status;
      console.log(fromUserId, toUserId, status);

      const isAllowedStatus = ["ignore", "interested"];

      if (!isAllowedStatus.includes(status)) {
        throw new Error("invalid status type !");
      }
      const toUser = await User.findById(toUserId);
      console.log(toUser);
      if (!toUser) {
        return res.status(404).json({
          message: "User not Found ",
        });
      }

      const existedConnectionRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      console.log(
        existedConnectionRequest,
        "loggggggggggggggggggggggggggggggggggggggg"
      );

      if (existedConnectionRequest) {
        return res
          .status(409)
          .json({ message: "Connection request already exists!" });
      }

      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.status(200).json({
        message: `${req.user.firstName} sent ${status.toUpperCase()} request to ${toUser.firstName}`,
        data: data,
      });
    } catch (err) {
      console.error("Error:" + err.message);
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = {
  requestRouter,
};
