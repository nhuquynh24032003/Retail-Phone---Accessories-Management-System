const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const userVerification = require('../models/UserVerification');
const {mongooseToObject} = require('../utils/convertMongoose')

class UserVerificationService {
    async getUserVerificationByUserId(userId) {
        return await userVerification.findOne({ userId })
            .then((result) => {
                return { status: true, data: mongooseToObject(result) };
            })
            .catch((error) => {
                return { status: false, message: "There was an error while finding user. " + error.message};
            })
    }
    async delUserVerification(userID) {
        try {
            await userVerification.deleteOne({ userId: userID });
            return { status: true, message: "Deleted UserVerification successful." };
        } catch (error) {
            return { status: false, message: "There was an error while deleting the UserVerification." + error.message};
        }
    }

    // sending mail register using nodemailer

    sendVerificationEmail = async ({ _id, userEmail }) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        const currentUrl = `http://localhost:${process.env.PORT}/user`;
        const uniqueString = uuidv4() + _id;

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: userEmail,
            subject: "Verify Your Email",
            html: `<p>Verify your email address to complete the signup and login into your account.</p>
                  <p>Press <a href=${currentUrl + "/verify/" + _id + "/" + uniqueString}> here </a> to proceed. This link will expire after 1 minute.</p>`,
        };

        try {
            const hasedUniqueString = await bcrypt.hash(uniqueString, 10);

            const newUserVerification = new userVerification({
                userId: _id,
                uniqueString: hasedUniqueString,
                createdAt: Date.now(),
                expiredAt: Date.now() + 60000, // 1 phút hết hạn
            });

            await newUserVerification.save();

            const info = await transporter.sendMail(mailOptions);
            console.log(`Verification mail has been sent to ${mailOptions.to}`);
            return { status: true };
        } catch (err) {
            console.error("An error occurred while sending email:", err.message);
            return {
                status: false,
                message: err.message,
            };
        }
    };


    // sending mail resetpassword using nodemailer
    // sendCodeResetPassword = async ({ _id, email }) => {
    //     const transporter = nodemailer.createTransport({
    //         service: "gmail",
    //         auth: {
    //             user: process.env.AUTH_EMAIL,
    //             pass: process.env.PASSWORD
    //         }
    //     });
    //     const currentUrl = `http://localhost:${process.env.PORT}`;
    //     const uniqueString = uuidv4() + _id;

    //     const mailOptions = {
    //         from: process.env.AUTH_EMAIL,
    //         to: email,
    //         subject: "[Tanka Travel] Reset Your Password",
    //         html: `<p>We've processed your password change request. If it is you who sent this request, click on the link below to change your password.</p>
    //         <p>Press <a href=${currentUrl + "/changepassword/" + _id + "/" + uniqueString}> here </a> to proceed. </p>`
    //     };

    //     const userVerificationData = await this.findByUserId(_id);

    //     if (!userVerificationData) {
    //         try {
    //             const hashedUniqueString = await bcrypt.hash(uniqueString, 10);
    //             const newUserVerification = new userVerification({
    //                 userID: _id,
    //                 uniqueString: hashedUniqueString,
    //                 createdAt: Date.now(),
    //                 expiredAt: Date.now() + 21600000
    //             });

    //             await newUserVerification.save();
    //             await transporter.sendMail(mailOptions);
    //             console.log(`Password request mail has been sent to ${mailOptions.to}`);

    //             return { status: 200, message: `Password reset mail has been sent to ${mailOptions.to}.` };
    //         } catch (error) {
    //             console.error(error);
    //             return { status: 500, message: "An error occurred while processing the request." };
    //         }
    //     } else {
    //         return { status: 400, message: "You have sent a request before. Please check your email address." };
    //     }
    // }

}


module.exports = new UserVerificationService;


