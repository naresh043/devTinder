const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/authMiddleware");

//sendConnectonRequest Api
requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    if (!user) {
      throw new Error("user Not Fround");
    }
    res.status(200).send("send request successful !!!");
  } catch (err) {
    console.error("Error in send connection Request !" + err.message);
    res.status(500).send("Error in sending connection request !");
  }
});

module.exports = {
  requestRouter,
};
