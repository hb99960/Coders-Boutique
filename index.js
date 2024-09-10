import express from 'express';
import dotenv from "dotenv";
import { connectDB } from "./db/connectDb.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from 'cookie-parser';


const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    connectDB();
    console.log("Server is running on port: ", port);
});

app.get("/", (req, res) => {
    res.send("ping");
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes)

