const express = require('express');
const {default:mongoose}= require('mongoose');
const app = express();
const USER = require('./model/userSchema')
const NoteSchema = require('./model/noteSchema');
const NOTE = mongoose.model("NOTEMODEL");
const connection = require('./connection/connection');
connection();
const port = 8081 
const auth = require('./Auth')
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
app.use(cors());

mongoose.connection.on("connected", ()=>{
    console.log("connected to mongoDB");
});
mongoose.connection.on("error",()=>{
    console.log("failed to connect to mongoDB");
})

require('./model/userSchema');
require('./model/noteSchema');
app.use(express.json());

app.use(require('./routes/routes'))

//creating the post
app.post("/createPost",auth,(req,res)=>{
    const {title,description} = req.body
    if(!title || ! description){
        return res.status(402).json({
            error:"please fill all the fields"
        })
    }
    res.json("Ok");

    const Note =  new NOTE({
        user: req.user,
        title,
        description
    }) 
    Note.save().then((result)=>{
        return res.json({Note:result})
    }).catch(err=>console.log(err))
    
})

app.get("/all", (req,res)=>{
    NOTE.find().sort({createdAt:-1}).then(note=>res.json(note)).catch(err=>console.log(err))
})

app.get("/search", async(req,res)=>{
    const searchTerm = req.query.searchTerm;
    const data = await NOTE.find({
        title:{$regex: searchTerm, $option:'i'}
    }).exec();
    res.send(data);
})

app.post("/verifying", (req,res,next)=>{
    auth
})


app.listen(port,()=>{
    console.log(`Server is up at port: ${port}`);
})





