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

function validateProfileEditData(req){
const allowedEditFields=["firstName","lastName","age","gender","photoURL","skills"];
const isEditAllowed=Object.keys(req.body).every(field=>allowedEditFields.includes(field))
return isEditAllowed;
}
module.exports={
    validateSignUpData,
    validateProfileEditData
}
