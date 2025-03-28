const bcrypt= require("bcrypt");
const User=require("../models/user");

exports.signup= async(req,res)=>{
    try{
        const{
            name, email,password,role
        }= req.body;
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'user already exists',
            });
        }
        let hashedPswd;
        try{
           hashedPswd= await bcrypt.hash(password,10); 
        }catch(error){
            return res.status(500).json({
                success:false,
                message:'error in hashing',
            });

        }

        const user=await User.create({
            name,email,password,role
        })
        return res.status(200).json({
            success:true,
            message:'user created!!',
        });
        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'user cannot be registered.',
        });
    }
}

