import express from "express";
import { getMyProfile, getRides, login, logout, register, rent } from "../controllers/user_controller.js";
import { isAuthenticated } from "../middlewares/auth.js";


const router = express.Router();


// to register a new user
router.route("/register").post(register);

// Login
router.route("/login").post(login);

// Logout
router.route("/logout").get(logout);

// Logout
router.route("/me").get(isAuthenticated, getMyProfile);

// Available rides with their fare
router.get("/car/get-rides", getRides);

//rent a car
router.post("/car/rent", rent);

export default router;