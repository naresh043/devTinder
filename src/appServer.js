const express = require("express");
const app = express();
const dbConnection = require("./config/database");
const user = require("./models/user");

const {authMiddleware} = require("./middlewares/authMiddleware");
app.use("/" , (req, res) => {
  res.send("welcome to the home page");
});

app.get("/admin",authMiddleware, (req, res) => {
  console.log("admin page accessed");
  res.send("accessing admin page");
});

app.get("/user/login", authMiddleware,(req, res) => {
  console.log("login successful");
  res.send("login successful");
});

app.get("/user", authMiddleware,(req, res) => {
  console.log("user page accessed");
  res.send("accessing user page");
});

app.use((err, req, res, next) => {
  if (err) {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
});
app.post("/user", async (req, res) => {
  try {
    const User = user({
      firstName: "Naresh Sanjeeev",
      lastName: "Kumar",
      email: "NareshSanjeev07gmail.com",
      age: 25,
    });
   await User.save();
    res.send("User created successfully");
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Error creating user");
  }
});
dbConnection()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => console.log("server is running on port 3000"));
  })
  .catch((err) => console.log("Database connection failed:", err));
