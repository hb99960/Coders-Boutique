import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const mongo_url = process.env.MONGO_URI;

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(mongo_url);
        console.log(`MongoDB Connected : ${conn.connection.host}`);
    } catch(error){
        console.log("Error connecting to MongoDB: ", error.message);
        process.exit(1);
    }
};

