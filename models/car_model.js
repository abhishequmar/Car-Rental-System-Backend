import mongoose from "mongoose";

const schema = mongoose.Schema({
  category: {
    type: String,
    require: [true, "please enter car category"],
  },
  model: {
    type: String,
    require: [true, "please enter car model"],
  },
  number_plate: {
    type: String,
    require: [true, "please enter car no."],
  },
  current_city: {
    type: String,
    require: [true, "please enter current_city"],
  },
  rent_per_hr: {
    type: Number,
    require: [true, "please enter rent_per_hr"],
  },
  rent_history: {
    type: Array,
    default: [],
  },
  car_id: {
    type: Number,
    require: [true, "please enter car_id"],
  },
  rented: {
    type: Boolean,
    defalt: false,
  }
});

export const Car = mongoose.model("Car", schema);
