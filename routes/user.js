const express=require("express");
const router= express.Router();
const {auth, isStudent,isAdmin}= require("../middlewares/auth");

const { login ,signup}=require("../controller/auth");

router.post("/login",login); 
router.post("/signup",signup);

router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:"welcome to the protected route for tests."
    });
});

router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:"welcome to the protected route for students."
    })
});

router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:"welcome to the protected route for admins."
    })
});

module.exports=router;