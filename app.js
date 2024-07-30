import express from "express";
import { config } from "dotenv";
import user from "./routes/user_routes.js";
import ErrorMiddleware from "./middlewares/error.js";


config({
    path: "./config/config.env",
});

const app = express();

//importing and using routes
app.use(express.json());

app.use("/api/v1", user);
app.get("/api/v1", (req, res)=>{
    res.send("hellu");

});

export default app;


app.use(ErrorMiddleware);
