import {User} from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { generateVerificationCode } from '../utils/generateVerificationCode.js';
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    console.log(req.body);
    const {email, password, name} = req.body;

    try{
        if(!email || !password || !name){
            throw new Error("All fields are required");
        }
        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({success:false, message:"User already exists"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password:hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24*60*60*1000
        })

        await user.save();
        console.log("User is saved")
        // generate Token and set Cookie
        const jwtToken = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
            expiresIn:"7d",
        });

        console.log("jwtToken = ", jwtToken);
        res.cookie("token", jwtToken, {
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7*24*60*60*1000,
        });

        res.status(201).json({
            success: true,
            message: "User created successfully!!",
            user:{
                ...user._doc,
                password: undefined,
            },
        });

        
    } catch(error){
        res.status(400).json({success:false, message:error.message});
    };

    

    // res.send("Signup route");
}

export const login = async (req, res) => {
    console.log("login route");

    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({success:false, message: "Invalid Credentials"});
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({success:false, message:"Invalid Credentials"});
        }

        const jwtToken = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
            expiresIn:"7d",
        });

        console.log("jwtToken = ", jwtToken);
        res.cookie("token", jwtToken, {
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7*24*60*60*1000,
        });

        res.status(201).json({
            success: true,
            message: "User created successfully!!",
            user:{
                ...user._doc,
                password: undefined,
            },
        });



    } catch(error){

    }

}

export const logout = async (req, res) => {
    // res.send("logout route");
    res.clearCookie("token");
    res.clearCookie("jwtoken");
    // console.log("jwtToken = ", jwtToken);
    res.status(200).json({success:true, message: "Logged out Successfully!!!"});
}

export const reset = async (req, res) => {
    res.send("reset route");
}
