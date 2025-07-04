const jwt = require("jsonwebtoken");
const user = require("../models/user"); // Adjust path as needed

const userAuth = async (req, res, next) => {
  try {
    // Read the token from cookies
    const cookie = req.cookies;
    if (!cookie || !cookie.token) {
      return res.status(401).json({ error: "Authentication token missing." });
    }

    // Verify the token (throws error if invalid/expired)
    const decodedToken = jwt.verify(cookie.token, "Naresh@DevTinder");
    const { _id } = decodedToken;

    // Find the user by ID
    const loggedUser = await user.findById(_id);
    if (!loggedUser) {
      return res.status(404).json({ error: "User not found." });
    }
    console.log(loggedUser)
    // Attach user to request object
    req.user = loggedUser;

    // Proceed to the next middleware
    next();
  } catch (err) {
    console.error("JWT Auth Error:", err.message);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};


module.exports = {
  userAuth,
};
