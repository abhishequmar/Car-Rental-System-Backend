import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import mongoose from "mongoose";
import Car from "../models/car_model.js"; // Assuming the car model is in models/Car.js

export const create = catchAsyncError(async (req, res, next) => {
  const {
    category,
    model,
    number_plate,
    current_city,
    rent_per_hr,
    rent_history,
  } = req.body;

  // Create a new Car instance
  const car = new Car({
    category,
    model,
    number_plate,
    current_city,
    rent_per_hr,
    rent_history,
  });

  // Save the car to the database
  await car.save();

  // Send a success response
  res.status(200).json({
    message: "Car added successfully",
    car_id: car._id,
    status_code: 200,
  });
});

export const updateHistory = catchAsyncError(async (req, res, next) => {
  const { car_id, ride_details } = req.body;

  // Find the car by ID
  const car = await Car.findById(car_id);
  if (!car) {
    return res.status(404).json({
      status: "Car not found",
      status_code: 404,
    });
  }

  // Create a new rent history record
  const newRentHistory = {
    renter: null, // Assuming renter information comes from somewhere else, set null or appropriate value
    rent_start: new Date(), // Assuming current date and time as rent start
    rent_end: new Date(
      new Date().getTime() + ride_details.hours_requirement * 60 * 60 * 1000
    ), // rent_end based on hours requirement
    rent_amount: car.rent_per_hr * ride_details.hours_requirement,
  };

  // Add the new rent history record to the car's rent history
  car.rent_history.push(newRentHistory);

  // Save the updated car document
  await car.save();

  // Send a success response
  res.status(200).json({
    status: "Car's rent history updated successfully",
    status_code: 200,
  });
});
