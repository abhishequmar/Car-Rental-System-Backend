import mongoose from "mongoose";
// import { validator } from "validator";
import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcrypt";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    // validate: validator.isEmail,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    unique: true,
    minLeangth: [6, "Password must be at least 6 character"],
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    required: [true, "Please enter your email"],
    default: "user",
  },
//   subscription: {
//     id: String,
//     // status: [true, "Please enter your email"],
//     unique: true,
//     // validate: validator.isEmail,
//   },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
  },
  playlist: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      poster: "String",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  ResetPasswordToken: String,
  ResetPasswordExpire: String,
});

schema.pre("save", async function (next){

  if(!this.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();

})

schema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });
};

schema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};



export const User = mongoose.model("User", schema);
