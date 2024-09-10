import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const mongo_url = process.env.MONGO_URI;

export const connectDB = async () => {
    try{
        console.log("mongo_uri = ", process.env.MONGO_URI);
        const conn = await mongoose.connect(mongo_url);
        console.log(`MongoDB Connected : ${conn.connection.host}`);
    } catch(error){
        console.log("Error connection to MongoDB: ", error.message);
        process.exit(1);
    }
};

