import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";

// API for loginAdmin
const loginAdmin = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      console.log(token);
      return response.json({
        success: true,
        message: "Logged Successfully",
        token,
      });
    } else {
      return response.json({
        success: false,
        message: "Invalid Email or Password",
      });
    }
  } catch (error) {
    console.log(error);
    return response.json({ success: false, message: "Error Occured" });
  }
};

const addDoctor = async (request, response) => {
  const {
    name,
    email,
    password,
    image,
    speciality,
    degree,
    experience,
    about,
    available,
    fees,
    address,
  } = request.body;

  // Check if file is uploaded
  if (!request.file) {
    return response
      .status(400)
      .json({ success: false, message: "No file uploaded." });
  }
  const imageFile = request.file.path;

  if (
    !name ||
    !email ||
    !password ||
    !speciality ||
    !degree ||
    !experience ||
    !about ||
    !fees ||
    !address
  ) {
    return response.json({ success: false, message: "Missing Details" });
  }

  if (!validator.isEmail(email)) {
    return response.json({
      success: false,
      message: "Please enter a valid Email Address",
    });
  }

  if (password.length < 8) {
    return response.json({
      success: false,
      message: "Please enter a Strong Password",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // uploading image to cloudinary

  const imageUpload = await cloudinary.uploader.upload(imageFile, {
    resource_type: "image",
  });
  const imageUrl = imageUpload.secure_url;

  const doctorData = {
    name,
    email,
    password: hashedPassword,
    image: imageUrl,
    speciality,
    degree,
    experience,
    about,
    available,
    fees,
    address: JSON.parse(address),
    date: Date.now(),
  };

  const newDoctor = new doctorModel(doctorData);
  await newDoctor.save();

  return response.json({
    success: true,
    message: "Doctor Added Successfully",
  });
};

export { addDoctor, loginAdmin };
