import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config({
    path:"./env"
})

console.log("User = ",process.env.USER);
console.log("Password = ",process.env.PASS);

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.USER, // sender gmail address
      pass: process.env.PASS, // sender app password
    },
})

// function to send email
const sendEmail = async({to,subject,text,html}) => {    // {to,subject,...} - object destructuring
    const info = await transporter.sendMail({
        from: process.env.USER, // sender address
        to, // recipient's email
        subject, // subject line
        text, // plain text body 
        html, // html body 
    })
    console.log("Email sent: %s",info.messageId);
}

export {sendEmail}