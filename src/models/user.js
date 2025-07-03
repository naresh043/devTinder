const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 5,
      maxLength: 20,
      required: true,
      lowercase: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email id !");
        }
      },
    },
    password:{
      type:String
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid ");
        }
      },
    },
    photoURL: {
      type: String,
      default:
        "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL !");
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
