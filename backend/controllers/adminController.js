import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

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

// API for addDoctor
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

// API for DoctorList
const allDoctors = async (request, response) => {
  try {
    const doctors = await doctorModel.find({}).select("-password"); // removes the password property from the doctors response
    response.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};

// API for get all appointments list
const appointmentsAdmin = async (request, response) => {
  try {
    const appointments = await appointmentModel.find({});
    console.log(appointments);
    response.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};

// API for cancel appointment
const appointmentCancel = async (request, response) => {
  try {
    const { appointmentId } = request.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing doctor slot
    const { docId, slotTime, slotDate } = appointmentData;

    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    response.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (request, response) => {
  try {
    const doctors = await doctorModel.find({});
    const user = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: user.length,
      latestAppointments: appointments.reverse(),
    };

    response.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
};
