import express from "express";
const router = express.Router();

import { signup, login, logout, reset } from "../controllers/authController.js";

router.post("/signup", signup )

router.post("/login", login )

router.post("/logout", logout )

router.get("/reset", reset)

export default router;
