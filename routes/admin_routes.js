import { mongo } from "mongoose";
import express from "express";
import { create, updateHistory } from "../controllers/admin_controller.js";

const router = express.Router();

//add new car to database
router.route("/car/create").post(create);

//update car rent history
router.route("/car/update-rent-history").post(updateHistory);

export default router;
