import express from "express";
import { config } from "dotenv";
import user from "./routes/user_routes.js";
import ErrorMiddleware from "./middlewares/error.js";
import admin from "./routes/admin_routes.js";

config({
  path: "./config/config.env",
});

const app = express();

//importing and using routes
app.use(express.json());

app.use("/api/user", user);
app.use("/api/admin", admin);
app.get("/api", (req, res) => {
  res.send("hellu");
});

export default app;

app.use(ErrorMiddleware);
