import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import { Car } from '../models/car_model.js';
import router from '../routes/admin_routes.js';
import express from 'express';

export const addCar = catchAsyncError(async (req, res, next) => {
    console.log("addCar called");
    //admin verification -> send data

    const {category, model, number_plate, current_city, rent_per_hr, rent_history} = req.body;

    if( true){
        await Car.create({
            category, model, number_plate, current_city, rent_per_hr, rent_history
        });
        res.status(200).send({message: "Car added successfully", car_id : "12345"});
    }else{
        res.status(401).send("unauthorized access");
    }
})