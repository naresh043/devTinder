const express= require('express');
const app = express();
app.use("/test",(req,res)=>{
    res.send("Hello from test route");
})
app.use("/hello",(req,res)=>{
    res.send("Hello from Hello route");
})
app.use("/",(req,res)=>{
    res.send("Hello from root route");
})

app.listen(7777,()=>{
    console.log("Server is running on port 7777");
})