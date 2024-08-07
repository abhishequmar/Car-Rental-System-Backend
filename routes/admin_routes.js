import express from "express";
import { addCar } from "../controllers/admin_controller.js";

const router = express.Router();

//add a car for renting by admin
router.route("/car/create").post(addCar);

export default router;
