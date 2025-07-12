const express = require("express");
const app = express();
const dbConnection = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const { authRouter } = require("./routers/auth");
const { profileRouter } = require("./routers/profile");
const { requestRouter } = require("./routers/request");
const { userRouter } = require("./routers/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// // DELETE user by ID from body
// app.delete("/user", async (req, res) => {
//   try {
//     const userId = req.body.id;
//     if (!userId) {
//       return res.status(400).send("User ID is required");
//     }

//     const deletedUser = await user.findByIdAndDelete(userId);

//     if (!deletedUser) {
//       return res.status(404).send("User not found");
//     }

//     res.send("User deleted successfully");
//   } catch (err) {
//     console.error("Error deleting user:", err);
//     res.status(500).send("Error deleting user");
//   }
// });

// // PATCH (update) user by ID in params
// app.patch("/user/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const updateData = req.body;

//     // Allowed fields for update
//     const ALLOWED_UPDATES = [
//       "firstName",
//       "lastName",
//       "age",
//       "photoURL",
//       "skills",
//     ];
//     const isUpdateAllowed = Object.keys(updateData).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );

//     if (!isUpdateAllowed) {
//       return res.status(400).send("Updates not allowed!");
//     }

//     // Optional: validate skill array length
//     if (updateData.skills && updateData.skills.length > 10) {
//       return res.status(400).send("Skills array should not exceed 10 items");
//     }

//     const updatedUser = await user.findByIdAndUpdate(userId, updateData, {
//       new: true, // return updated document
//       runValidators: true, // validate schema
//     });

//     if (!updatedUser) {
//       return res.status(404).send("User not found");
//     }

//     console.log("User updated:", updatedUser);
//     res.send("User updated successfully");
//   } catch (err) {
//     console.error("Error updating user: " + err.message);
//     res.status(500).send("Error updating user: " + err.message);
//   }
// });

// Connect to DB and start server
dbConnection()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => console.log("Server is running on port 3000"));
  })
  .catch((err) => console.log("Database connection failed:", err));
