import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      "SUV",
      "Sedan",
      "Hatchback",
      "Convertible",
      "Coupe",
      "Minivan",
      "Truck",
      "Other",
    ],
  },
  model: {
    type: String,
    required: true,
  },
  number_plate: {
    type: String,
    required: true,
    unique: true,
  },
  current_city: {
    type: String,
    required: true,
  },
  rent_per_hr: {
    type: Number,
    required: true,
    min: 0,
  },
  rent_history: {
    type: Array,
    default: [],
  },
});

const Car = mongoose.model("Car", carSchema);

export default Car;
