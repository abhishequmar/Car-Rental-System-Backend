import express from "express";
import { getMyProfile, getRides, login, logout, register } from "../controllers/user_controller.js";
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


//get list of available cars
router.route('/car/getrides').get(getRides);

//rent a car
router.route('/car/rent').post(rent);

export default router;