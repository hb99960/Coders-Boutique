import express from "express";
const router = express.Router();

import { signup, login, logout, forgotPassword, resetForm, resetPassword } from "../controllers/authController.js";

router.post("/signup", signup )

router.post("/login", login )

router.post("/logout", logout )

router.post("/forgot-password", forgotPassword )

// for redirection
router.get("/reset-password/:token", resetForm);

// actual password change
router.post("/reset/:token", resetPassword);

export default router;
