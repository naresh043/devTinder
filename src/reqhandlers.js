const express = require("express");
const app = express();

app.use(
  "/user",
  (req, res, next) => {
  
    res.send("request handler 1");
    next();
  },
  (req, res, next) => {
    res.send("request handler 2");
    // next();
  },
  (req,res,next)=>{
    // res.send("request handler 3");
    // next();
},(req,res,next)=>{
    // res.send("request handler 4");
    // next();
}
);


app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})