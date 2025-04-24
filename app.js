require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose")
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require("./models/blog")


const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookies, restrictTo } = require("./middlewares/authentication");

mongoose.connect(process.env.MONGO_URL).then(()=>console.log("mongodb connected!"))

app.set("view engine" , "ejs");
app.set("views" , path.resolve("./views"))

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookies("token"));
app.use(express.static(path.resolve("./public")))
app.use(methodOverride('_method'));
app.use("/user", userRoute);
app.use("/blog", blogRoute);


app.get("/",async (req,res)=>{
    const allBlogs = await Blog.find({})
    res.render("home",{
        user:req.user,
        blogs:allBlogs
    })
})
app.get("/user/admin",restrictTo(["ADMIN"]),async (req,res)=>{
    const allBlogs = await Blog.find({})
    res.render("home",{
        user:req.user,
        blogs:allBlogs
    })
})

app.listen(PORT , () => console.log(`Server started at PORT:${PORT}`))