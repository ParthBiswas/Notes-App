import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
    // service:"gmail",
    host: "smtp.gmail.com",
  port: 587,
  secure: false,
    auth:{
        user: process.env.AUTH_MAIL,
        pass:process.env.AUTH_PASS
    }
});

export async function sendMail(to,subject,text){
    return transporter.sendMail({
        from:`"OTP Login" <${process.env.AUTH_MAIL}>`,
        to,
        subject,
        text
    })
};

