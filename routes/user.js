const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", async (req,res)=>{
    const {fullName,password,email} = req.body;
const USER = await User.create({
    fullName,
email,
password
})
res.redirect("signin")
})

 router.post("/signin" , async (req,res)=>{
    const {email,password}  = req.body;
   try {
    
    const token = await User.matchPasswordAndGenerateToken(email,password);
    
  return  res.cookie("token",token).redirect("/")
   } catch (error) {
    return res.render("signin",{
        error :"Invalid eamil or password"
    })
   }
 })
 router.get("/admin",(req ,res)=>{
  return res.redirect("signin")
 })

 router.get("/logout", (req,res)=>{
    res.clearCookie("token").redirect("/")
 })

router.get("/signup", (req, res) => {
    res.render("signup");
  });
  
  router.get("/signin", (req, res) => {
    res.render("signin");
  });
  

module.exports = router;