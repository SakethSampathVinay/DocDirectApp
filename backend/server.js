import express from "express";
import cors from "cors";
import "dotenv/config";
import connectToDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
// app config

const app = express();
const port = process.env.PORT || 4000;
connectToDB();
connectCloudinary();

// middleawares

app.use(cors());
app.use(express.json());

// api endpoint
app.use("/api/admin", adminRouter);


app.get("/", (request, response) => {
  response.send("API Working");
});

app.listen(port, () => console.log("Server Connected Successfully"));
