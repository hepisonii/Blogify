const {Router} = require("express");
const User = require("../models/user");
const cookie = require("cookie");
const userRoute = Router();
const fs = require("fs/promises")
const PATH = require("path");


userRoute.get("/signup", (req,res) => {
    return res.render("signup");
})
userRoute.get("/login", (req,res) => {
    return res.render("login");
})

userRoute.post("/signup",async (req,res) => {    
    try{
        console.log("1. Request Received!");
        const { fullName, email, password} = req.body;
        console.log("2. Before user created");
        const checkEmail = await User.findOne({email});
        if(checkEmail){
            return res.render("signup", {
                error: "Email already exists"
            })
        }
        const user = await User.create({
            fullName,
            email,
            password
        })
        const folderPath = PATH.resolve(__dirname, `../public/uploads/${user._id}`);
        await fs.mkdir(folderPath, { recursive: true}, (err) => {
            if(err) console.log("err: ",err);
            else
                console.log("Folder Created");
        });
        console.log("3. After User created");
        return res.redirect("/user/login");
    }catch(err){
        console.log("Error: ",err);
        return res.send("Error happened");
    }
})


userRoute.post("/login", async (req,res) => {
    const { email, password } = req.body;
    const token = await User.matchPassword(email,password); // userSchema vala function jo mongoose ke inbuilt functions h
    if(!token){
        return res.render("login", {
        error: "Invalid Email or Password"
        })
    }
    else{
    res.cookie("uid", token, {
        httpOnly: true,
        secure: true,
        sameSite: true,
    });
    return res.redirect("/");
    }
})

userRoute.get("/logout", async (req,res) => {
    res.clearCookie("uid", {
        httpOnly: true,
        secure: true,
        sameSite: true,
    });
    return res.render("home");
})


module.exports = userRoute;