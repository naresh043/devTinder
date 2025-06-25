const mongoose = require("mongoose");

const dbConnection = async () => {
  await mongoose.connect(
    "mongodb+srv://NamasteNaresh:Naresh%40143@namastenaresh.qddqpyv.mongodb.net/devTinder"
  );
};

module.exports = dbConnection;


