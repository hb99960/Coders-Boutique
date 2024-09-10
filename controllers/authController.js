import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { generateVerificationCode } from '../utils/generateVerificationCode.js';
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { getMaxListeners } from 'events';

export const signup = async (req, res) => {
    console.log(req.body);
    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        })

        await user.save();
        console.log("User is saved")
        // generate Token and set Cookie
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        console.log("jwtToken = ", jwtToken);
        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            message: "User created successfully!!",
            user: {
                ...user._doc,
                password: undefined,
            },
        });


    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    };



    // res.send("Signup route");
}

export const login = async (req, res) => {
    console.log("login route");

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        console.log("jwtToken = ", jwtToken);
        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        user.lastLogin = Date.now();
        await user.save();

        res.status(200).json({
            success: true,
            message: "User LoggedIn successfully!!",
            user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        console.log("Error in login ", error);
        res.status(400).json({ success: false, message: error.message });
    }

}

export const logout = async (req, res) => {
    // res.send("logout route");
    res.clearCookie("token");
    res.clearCookie("jwtoken");
    // console.log("jwtToken = ", jwtToken);
    res.status(200).json({ success: true, message: "Logged out Successfully!!!" });
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log("email = ", email);

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        console.log("resetToken = ", resetToken)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // create the reset URL
        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`

        // send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: user.email,
            from: {
                name: 'Harshit Batra',
                address: 'hbatra.projects@gmail.com'
            },
            subject: 'Password Reset',
            text: `You requested a password reset. Please click the following link to reset your password: \n\n ${resetUrl}`,
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #333;
        }
        .content {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
        }
        .reset-button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            color: #ffffff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #aaa;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <a href="${resetUrl}" class="reset-button">Reset Password</a>
            <p>If you did not request this change, please ignore this email.</p>
            <p>Thank you!</p>
        </div>
        <div class="footer">
            <p>&copy;  ${new Date().getFullYear()} Coders Boutique. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`,
        }

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Password reset email sent' });

    } catch (error) {
        console.error('Error : ', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export const resetForm = (req, res) => {
    // res.send("resetForm route");
    const { token } = req.params;
    console.log("token ", token);
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
        </head>
        <body>
            <h1>Reset Your Password</h1>
            <form action="http://localhost:3000/api/auth/reset/${token}" method="POST">
                <label for="newPassword">New Password:</label>
                <input type="password" id="newPassword" name="newPassword" required>
                <button type="submit">Reset Password</button>
            </form>
        </body>
        </html>
    `);
}



export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        console.log("token ", token);
        console.log("new Password ", newPassword);
        console.log("Request Body ", req.body);
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() } // Token must be valid
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Token is invalid or expired' });
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedPassword; // Hash the password before saving
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Password has been updated' });

    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}







