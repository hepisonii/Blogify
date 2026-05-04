const express = require("express");
const Blog = require("../models/blog");
const Comment =require("../models/comment");
const blogRoute = express.Router();
const multer = require("multer");
const PATH = require("path");

const exist = null;


/*const storage = multer.diskStorage({
    destination: function (req,file,cb){
        return cb(null, PATH.resolve(__dirname, "../public/uploads", req.user._id));
    },
    filename: function (req,file,cb){
        return cb(null, `${file.originalname}`)
    }
})*/

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "blogify",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});

const uploads = multer({storage});

blogRoute.get("/add-blog", (req,res) => {
    return res.render("blog", {
        user: req.user
    });
})

blogRoute.post("/add-blog", uploads.single("coverImageURL"), async (req,res) => {
    console.log("Body: ",req.body)
    const {title,body, coverImageURL} = req.body;
    const blog = await Blog.create({
        title,
        body,
        coverImageURL: `/uploads/${req.user._id}/${req.file.filename}`,
        createdBy: req.user._id,
    })
    return res.redirect(`/blog/user/${blog.createdBy}`);
});

blogRoute.get("/user/:id", async (req,res) => {
    const userBlog = await Blog.find({createdBy: req.params.id}).populate("createdBy", "fullName profileImageURL");
    console.log("Blog: ", userBlog)
    return res.render("userBlog", {
        userBlog,
        user: req.user
    })
})


blogRoute.get("/:id", async (req,res) => {
    const currentBlog = await Blog.findById(req.params.id).populate("createdBy", "fullName profileImageURL");
    const comments = await Comment.find({blogId: req.params.id}).populate("createdBy", "fullName profileImageURL");

    return res.render("currentBlog", {
        currentBlog,
        user: req.user,
        comments
    })
});

blogRoute.post("/comment/:blogId", async (req,res) => {
    const content = req.body.content;
    const comment = await Comment.create({
        content,
        createdBy: req.user._id,
        blogId: req.params.blogId
    });
    return res.redirect(`/blog/${req.params.blogId}`);
})

module.exports = blogRoute;