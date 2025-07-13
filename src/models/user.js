const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
    password: {
      type: String,
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
    about: {
      type: String,
      default:"Empty about section !"
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
userSchema.methods.getJWT = async function () {
  try {
    const token = await jwt.sign({ _id: this._id }, "Naresh@DevTinder");
    // console.log(token);
    if (!token) {
      throw new Error("error in generating the jwt Token !");
    }
    return token;
  } catch (err) {
    console.error("Error in the schema methods !" + err.message);
    // res.status(500).send("Error in th schema methods "+err.message)
  }
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const User = this;
  const hashPassword = User.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    hashPassword
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
