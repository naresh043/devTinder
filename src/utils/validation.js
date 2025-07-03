const validator = require("validator");
function validateSignUpData(data) {
  const { firstName, lastName, email, password } = data;
  if (!firstName || !lastName) {
    throw new Error("Name is Not Valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not Valid")
  }else if(!validator.isStrongPassword(password)){
    throw new Error("Enter the Strong Password !")
  }
}

module.exports={
    validateSignUpData
}
