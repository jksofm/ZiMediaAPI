import nodemailer from 'nodemailer';
import dotenv from "dotenv";
// import {connect} from "html-to-text";
import path from "path";
import Welcome from '../views/emails/Welcome.js';
import ResetPassword from '../views/emails/ResetPassword.js';

class Email {
    constructor(user,url){
        this.to = user.email;
        this.firstname = user.firstname;
        this.url = url;
        this.from = `Huy Le<lequochuypy1998@gmail.com>`;
        

    }
    newTransport(){
        // if(process.env.NODE_ENV !== 'production'){

            return nodemailer.createTransport({
                host : process.env.EMAIL_HOST,
                port : process.env.EMAIL_PORT,
                auth : {
                    user : process.env.EMAIL_USERNAME,
                    pass : process.env.EMAIL_PASSWORD,
                }
            })
        // }
        
        // else {
        //     return nodemailer.createTransport({
        //         service : "SendGrid",
        //         auth : {
        //           user: process.env.SENDGRID_USERNAME,
        //           pass: process.env.SENDGRID_PASSWORD
        //         }
        //       })
        // }
    }
    async send(htmlContent,subject){
    
        const mailOptions = {
            from : this.from,
            to: this.to,
            subject : subject,
            html  : htmlContent,
         
            // html : 
          }
      await this.newTransport().sendMail(mailOptions)

    }
    async sendWelcome(){
        const htmlContent = Welcome(this.firstname);

        await this.send(htmlContent,"Welcome")
    }
    async sendResetPassword(){
        const htmlContent = ResetPassword(this.url,this.firstname)
        await this.send(htmlContent,"Reset Password")

    }
}

export default Email