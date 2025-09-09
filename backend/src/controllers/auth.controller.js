import crypto from "crypto";
import {sendMail} from "../utils/mailer.js"
import userModel from "../models/auth.model.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const otpStore = {};

function generateToken(user) {
    return jwt.sign(
        {  id: user._id },
        process.env.JWT_SECRET
    );
}

export async function getMe(req, res) {
  try {
    const token = req.cookies.token; // 👈 comes from cookieParser

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("getMe error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}

export async function OtpController(req,res){
    const {name, dob,email} = req.body;
    

    if(!email){
        return res.status(401).json({
            message: "Email is Required"
        });
    }

    const exsistEmail = await userModel.findOne({
        email
    });

    if(exsistEmail){
        
        return res.status(401).json({
            message:"Duplicate Email"
        });
    }

    const otp = crypto.randomInt(100000, 900000).toString();
    otpStore[email]= {otp, Expire:Date.now() + Number(process.env.OTP_EXPIRE), userData: { name, dob, email }};

    try{
        await sendMail(
            email,
            'Your OTP',
            `Your OTP is ${otp}. It's Expire in ${process.env.OTP_EXPIRE/ 60000} Minutes`
        );
        res.status(201).json({Success:true,message:'OTP is Send'});
    }catch(err){
        console.log('Error E-mail', err);
        res.status(401).json({message:"Failed to Send OTP"})
    };
}

export async function verifyController(req,res){
    const {email,otp} = req.body;
    const record = otpStore[email]

    if(!record){
        return res.status(401).json({message:"OTP Not Found"});
    }

    if(Date.now() > record.Expire){
        return res.status(401).json({message:"OTP Expire"});
    }

    if(record.otp !== otp){
        return res.status(401).json({message:"Invalid OTP"});
    }

    try{
        
    const {name,dob} = record.userData;

    const user = await userModel.create({
    name, dob, email
    }); 

    delete otpStore[email];

    const token = generateToken(user);

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // only https in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });


    res.status(201).json({message:"Register Success"});
    }catch(err){
        console.log("Error create User", err);
        res.status(401).json({  message:"Server Error" })
    }

}

// Step 1: Send OTP for login
export async function loginOtpController(req, res) {
    const { email } = req.body;
    
    // console.log("Generated OTP:", otp, typeof otp);


    if (!email) {
        return res.status(401).json({ message: "Email is required" });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    const token = generateToken(user);
    
    // Set cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });
    
    // Generate OTP
    const otp = crypto.randomInt(100000, 900000).toString();
    otpStore[email] = {
        otp,
        expire: Date.now() + Number(process.env.OTP_EXPIRE),
    };

   

    try {
        await sendMail(
            email,
            "Your Login OTP",
            `Your OTP is ${otp}. It expires in ${process.env.OTP_EXPIRE / 60000} minutes`
        );
        res.status(201).json({ success: true, message: "OTP sent" });
    } catch (err) {
        console.error("Error sending email", err);
        res.status(500).json({ message: "Failed to send OTP" });
    }
}

// Step 2: Verify OTP for login
export async function loginVerifyController(req, res) {
    const { email, otp } = req.body;
    
    
    const user = await userModel.findOne({ email });
    
    if (!user) {
        return res.status(401).json({ message: "User not found" });
        
    }

    const record = otpStore[email];

    if (!record) {
        return res.status(401).json({ message: "OTP Not Found" });
    }

  


    if (Date.now() > record.expire) {
        delete otpStore[email];
        return res.status(401).json({ message: "OTP Expired" });
    }

    if (String(record.otp).trim() !== String(otp).trim()) {
    return res.status(401).json({ message: "Invalid OTP" });
}



    delete otpStore[email];

    const token = generateToken(user);
    
    // Set cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });
    

    // Here you can generate JWT token or session
    res.status(200).json({ success: true, message: "Login Successful" });
}

export async function logoutController(req, res) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
}
