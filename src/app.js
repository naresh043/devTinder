const express= require('express');
const app = express();
// app.get("/user",(req,res)=>{
//     res.send("Hello World");
// });
app.use("/user/abc/xyz",(req,res)=>{
    res.send("Hello from abc/xyz");
});

app.use("/user/abc",(req,res)=>{
    res.send("Hello from middleware");
});
app.use("/user",(req,res)=>{
    res.send("Hello World");
});

app.use("/",(req,res)=>{
    res.send("Hello from root");
});

app.listen(7777,()=>{
    console.log("Server is running on port 7777");
})