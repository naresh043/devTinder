// const express = require("express");
// const app = express();
// const dbConnection = require("./config/database");
// const user = require("./models/user");
// app.use(express.json());

// app.get("/user", async (req, res) => {
//   try {
//     const eMailId = req.body.email;
//     const Users = await user.findOne({ email: eMailId });
//     if (Users.length === 0) {
//       res.status(404).send("User not found");
//     } else {
//       res.send(Users);
//     }
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     res.status(500).send("Error fetching users");
//   }
// });

// app.post("/user", async (req, res) => {
//   try {
//     const User = user(req.body);
//     const UserSaved=await User.save();
//     if(!UserSaved){
//     throw new Error("first name is required !")
//     }
//     res.send("User created successfully");
//   } catch (err) {
//     console.error("Error creating user:"+ err.message);
//     res.status(500).send("Error creating user "+ err.message);
//   }
// });

// app.delete("/user", async (req, res) => {
//   try {
//     const userId = req.body.id;
//     await user.findByIdAndDelete({ _id: userId });
//     res.send("User deleted successfully");
//   } catch (err) {
//     console.error("Error deleting user:", err);
//     res.status(500).send("Error deleting user");
//   }
// });

// app.patch("/user/:userId", async (req, res) => {
//   try {
//     // console.log(req)
//     // const userId = req.body._id;
//     const userId = req.params?.userId
//     const updateData = req.body;

//     const ALLOWED_UPDATES=['firstName','lastName','age','photoURL',"skills"]
//     const isUpdateAllowed=Object.keys(updateData).every((k)=>ALLOWED_UPDATES.includes(k))
//     // console.log(isUpdateAllowed)
//     if(!isUpdateAllowed){
//       throw new Error("Update Not Allowed !")
//       res.status(400).sent("Updates not allowed !")
//     }
//     if(req.body?.skills.length>10){
//       throw new Error("array contains minimum 10 items")
//     }
//     // const updateUser = await user.findByIdAndUpdate(
//     //   { _id: userId },
//     //   updateData
//     // );
//     // console.log(userId)
//     const updatedUser = await user.findByIdAndUpdate(userId, updateData, {
//       returnDocument: "after",
//       runValidators:true
//     });
//     console.log("User updated:", updatedUser);
//     console.log("User updated successfully:", updatedUser);
//     if (!updatedUser) {
//       return res.status(404).send("User not found");
//     }
//     res.send("User updated successfully");

//   } catch (err) {
//     console.error("Error updating user:"+err.message);

//     res.status(500).send("Error updating user:"+err.message);
//   }
// });

// // app.patch("/user", async (req, res) => {
// //   try {
// //     const userId = req.body.id;
// //     const updateData = req.body;

// //     console.log("Incoming PATCH request to /user");

// //     const updatedUser = await user.findByIdAndUpdate(
// //       userId,
// //       updateData,
// //       { returnDocument: "before" }
// //     );

// //     if (!updatedUser) {
// //       console.log("User not found.");
// //       return res.status(404).send("User not found");
// //     }

// //     console.log("User updated:", updatedUser);
// //     res.send("User updated successfully");
// //   } catch (err) {
// //     console.error("Error updating user:", err);
// //     res.status(500).send("Error updating user");
// //   }
// // console.log('out of block');

// // });

// dbConnection()
//   .then(() => {
//     console.log("Database connected successfully");
//     app.listen(3000, () => console.log("server is running on port 3000"));
//   })
//   .catch((err) => console.log("Database connection failed:", err));

const express = require("express");
const app = express();
const dbConnection = require("./config/database");
const user = require("./models/user"); // model
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { validateSignUpData } = require("./utils/validation");
const {userAuth}=require("./middlewares/authMiddleware")
app.use(express.json());
app.use(cookieParser());
// console.log(validateSignUpData,"1234")
// GET user by email — using query params instead of body (GET should not have a body)
app.get("/user", async (req, res) => {
  try {
    // const eMailId = req.query.email;
    // if (!eMailId) {
    //   return res.status(400).send("Email is required");
    // }
    const Users = await user.findOne({});

    // Check if user exists
    if (!Users) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(Users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Error fetching users");
  }
});

// POST (create) new user
app.post("/user", async (req, res) => {
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const validUser = await user.findOne({ email });
  if (!validUser) {
    throw new Error("Invalid credentials !");
  }
  const isPasswordValid = await bcrypt.compare(password, validUser.password);
  console.log(isPasswordValid)
  if (isPasswordValid) {
    //jwt token logic
    //create the jwt token
    //add token into cookie send the response back to user
    const token = jwt.sign({ _id: validUser._id }, "Naresh@DevTinder");
    // console.log(token);
    res.cookie("token", token,{expires: new Date(Date.now() + 60 * 1000)});

    res.status(200).send("login Successful !");
  } else {
    throw new Error("Invalid credentials !");
  }
});

//get/profile ;
app.get("/profile",userAuth, async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "This is the Profile Page!", user: req.user });
  } catch (error) {
    console.error("Error in /profile route:", error.message);
    res.status(403).json({ error: "Invalid or expired token." });
  }
});
// DELETE user by ID from body
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.id;
    if (!userId) {
      return res.status(400).send("User ID is required");
    }

    const deletedUser = await user.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    res.send("User deleted successfully");
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Error deleting user");
  }
});

// PATCH (update) user by ID in params
app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateData = req.body;

    // Allowed fields for update
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "age",
      "photoURL",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(updateData).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      return res.status(400).send("Updates not allowed!");
    }

    // Optional: validate skill array length
    if (updateData.skills && updateData.skills.length > 10) {
      return res.status(400).send("Skills array should not exceed 10 items");
    }

    const updatedUser = await user.findByIdAndUpdate(userId, updateData, {
      new: true, // return updated document
      runValidators: true, // validate schema
    });

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    console.log("User updated:", updatedUser);
    res.send("User updated successfully");
  } catch (err) {
    console.error("Error updating user: " + err.message);
    res.status(500).send("Error updating user: " + err.message);
  }
});


// Connect to DB and start server
dbConnection()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => console.log("Server is running on port 3000"));
  })
  .catch((err) => console.log("Database connection failed:", err));
