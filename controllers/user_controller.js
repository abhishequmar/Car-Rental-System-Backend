import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/user_model.js";
import { Car } from "../models/car_model.js";
import router from "../routes/user_routes.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";

// import { bodyParser } from "body-parser";

export const register = catchAsyncError(async (req, res, next) => {
  console.log("register called");

  const { name, email, password } = req.body;
  console.log(email, password, name);

  // const file = req.file;

  if (!name || !email || !password)
    return next(new ErrorHandler("Please Enter all fields", 400));

  let user = await User.findOne({ email });

  if (user) return next(new ErrorHandler("User already exists", 409));

  // upload file on cloudnary

  user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "temp_id",
      url: "tempurl",
    },
  });

  sendToken(res, user, "Registered successfully", 201);
});

export const login = catchAsyncError(async (req, res, next) => {
  // console.log("register called", req.body);

  const { email, password } = req.body;
  console.log(email, password);

  // const file = req.file;

  if (!email || !password)
    return next(new ErrorHandler("Please Enter all fields", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user) return new ErrorHandler("Incorrect user or password", 401);

  // upload file on cloudnary
  const isMatch = await user.comparePassword(password);

  if (!isMatch) return new ErrorHandler("Incorrect user or password", 401);

  sendToken(res, user, "Welcome back", 201);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "logged out successfully",
    });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Get

export const getRides = catchAsyncError(async (req, res, next) => {
  console.log("getRides called");
  const { origin, destination, category, required_hours } = req.query;
  // Validation (optional)
  if (!origin || !destination || !category || !required_hours) {
    return res
      .status(400)
      .json({ message: "All query parameters are required." });
  }

  // Build the query object
  const query = { category: category };

  // Fetch data from the database
  const rides = await Car.find(query);

  // Check if rides were found
  if (rides.length === 0) {
    return res
      .status(404)
      .json({ message: "No rides found matching the category." });
  }

  // Return the results
  res.status(200).json(rides);
});

export const rent = catchAsyncError(async (req, res, next) => {
  console.log("rent called");
  const { car_id, origin, destination, hours_requirement } = req.body;
  // Validation (optional)
  if (!car_id || !origin || !destination || !hours_requirement) {
    return res
      .status(400)
      .json({ message: "All query parameters are required." });
  }



  // Fetch data from the database
  const car = await Car.findOne({ number_plate: car_id });

  // Check if rides were found
  if (!car) {
    return res
      .status(404)
      .json({ message: "No car found with the given car_id." });
  }

  const rent_id = 0;
  const fare = hours_requirement * car.rent_per_hr;

  

  // Return the results
  res.status(200).json({message: "car rented successfully", rent_id: rent_id, total_payable_amt: fare});
});
