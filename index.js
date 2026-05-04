require("dotenv").config();
const express = require("express");
const PATH = require("path");
const app = express();
const cookie_parser = require("cookie-parser");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const connectMongoose = require("./connections/user");
const { checkAuth } = require("./middlewares/auth");
const Blog = require("./models/blog");
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookie_parser());
app.use(checkAuth("uid"));
app.use("/uploads",express.static(PATH.resolve("./public/uploads")));
app.use(express.static("public"));


app.set("view engine", "ejs");
app.set("views", PATH.resolve("./views"));

connectMongoose(process.env.MONGODB_URL);

app.get("/", async (req,res) => {
    if(!req.user) return res.render("home");
    const allBlog = await Blog.find({}).populate("createdBy", "fullName profileImageURL");

    return res.render("home", {
        user: req.user,
        allBlog
    });
})



app.use("/user", userRoute);
app.use("/blog", blogRoute);


module.exports = app;