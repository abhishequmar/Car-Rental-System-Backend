import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import Car from "../models/car_model.js";
import { User } from "../models/user_model.js";
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
  res.status(200)
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

    res
      .status(200)
      .json({
        success: true,
        user,
      });


});


export const getRides = catchAsyncError(async(req, res, next) => {
    console.log("getRides called");
    const { origin, destination, category, required_hours } = req.query;

        // Find cars based on the provided category
        const cars = await Car.find({ category: category });

        // Filter cars based on current_city and create a response array
        const response = cars
            .filter(car => car.current_city.toLowerCase() === origin.toLowerCase())
            .map(car => {
                return {
                    car_id: car._id,
                    category: car.category,
                    model: car.model,
                    number_plate: car.number_plate,
                    current_city: car.current_city,
                    rent_per_hr: car.rent_per_hr,
                    rent_history: car.rent_history.map(history => ({
                        origin: history.origin,
                        destination: history.destination,
                        amount: history.rent_amount
                    })),
                    total_payable_amt: car.rent_per_hr * required_hours
                };
            });

        // Send the response
        res.status(200).json(response);
});

export const rent = catchAsyncError(async (req, res, next) => {
  const { car_id, origin, destination, hours_requirement } = req.body;

  // Find the car by ID
  const car = await Car.findById(car_id);
  if (!car) {
    return res.status(404).json({
      status: "Car not found",
      status_code: 404,
    });
  }
  if (car.current_city.toLowerCase() !== origin.toLowerCase()) {
    return res.status(400).json({
      status: "No car is available at the moment",
      status_code: 400,
    });
  }
  // Calculate the total payable amount
  const total_payable_amt = car.rent_per_hr * hours_requirement;
  // Send a success response
  res.status(200).json({
    status: "Car rented successfully",
    status_code: 200,
    rent_id: rent_id,
    total_payable_amt: total_payable_amt,
  });
});