const jwt = require("jsonwebtoken");
const users = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    //getting the cookies from request read the cookies
    //valadating the jwt token
    //find the user through the decodedToken id 
    const cookie = req.cookies;
    if (!cookie || !cookie.token) {
      throw new Error("we are not getting the Cookie");
    }
    console.log(cookie);
    const decodedToken = await jwt.verify(cookie.token, "Naresh@DevTinder");
    console.log(decodedToken);
    
    if (!decodedToken) {
      throw new Error("Token Validation Failed !");
    }
    const _id = decodedToken._id;
    const user = await users.findById(_id);
    if (!user) {
      throw new Error("User not found !");
    }
    req.user = user;
    //   console.log(user);
    next();
  } catch (err) {
    console.error("Error in Jwt" + err.message+err.expiredAt);
    res.status(500).send("Token  expires or Or invalid Token " + err.message+err.expiredAt);
  }
};

module.exports = {
  userAuth,
};
