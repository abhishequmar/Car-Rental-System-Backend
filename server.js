

import app from "./app.js";
import {config} from "dotenv";
import { connectDB } from "./config/db.js";

connectDB();

config({
  path: "./config/config.env"
})

app.listen(process.env.PORT, () => {
  console.log("server is working on port:", process.env.PORT);
});



