import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import razorpay from "razorpay";
import { GoogleGenerativeAI } from "@google/generative-ai";

// API for Register User
const registerUser = async (request, response) => {
  try {
    const { name, email, password } = request.body;

    if ((!name, !email, !password)) {
      return response.json({
        success: false,
        message: "Please fill the details",
      });
    }

    if (!validator.isEmail(email)) {
      return response.json({
        success: false,
        message: "Please Enter a Valid Email",
      });
    }

    if (password.length < 8) {
      return response.json({
        success: false,
        message: "Please Enter a Valid Password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    response.json({
      success: true,
      message: "User Registered Successfully",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return response.json({ success: false, message: error.message });
  }
};

// API for Login User
const loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return response.json({ success: false, message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return response.json({ success: true, token });
    } else {
      return response.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    return response.json({ success: false, message: error.message });
  }
};

// API for get user details
const getProfile = async (request, response) => {
  try {
    const { userId } = request.body;
    const user = await userModel.findById(userId).select("-password");

    response.json({ success: true, message: "User Profile", user });
  } catch (error) {
    console.log(error);
    return response.json({ success: false, message: error.message });
  }
};

// API for update user details
const updateProfile = async (request, response) => {
  try {
    const { userId, name, phone, address, dob, gender } = request.body;
    const imageFile = request.file;

    if ((!name, !phone, !address, !dob, !gender)) {
      return response.json({
        success: false,
        message: "Please fill all the details",
      });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    response.json({
      success: true,
      message: "Updates User Details Successfully",
    });
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};

//API for book appointment
const bookAppointment = async (request, response) => {
  try {
    const { userId, docId, slotDate, slotTime } = request.body;

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return response.json({ success: false, message: "Doctor Not Available" });
    }

    let slots_booked = docData.slots_booked;

    // checking for slot availability

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return response.json({ success: false, message: "Slot Not Available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");
    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    response.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};

// API for list of Appointment
const listAppointment = async (request, response) => {
  try {
    const { userId } = request.body;
    const appointments = await appointmentModel.find({ userId });
    response.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};

// API for Cancel Appointment
const cancelAppointment = async (request, response) => {
  try {
    const { userId, appointmentId } = request.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData.userId !== userId) {
      return response.json({ success: false, message: "Unauthorized User" });
    }

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

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API to make payment of appointment using razorpay
const paymentRazorpay = async (request, response) => {
  try {
    const { appointmentId } = request.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return response.json({ success: false, message: "Invalid Appointment" });
    }

    // creating options for razorpay payment
    const options = {
      amount: appointmentData.amount * 100,
      currency: "INR",
      receipt: appointmentId,
    };

    // CREATION OF AN ORDER
    const order = await razorpayInstance.orders.create(options);

    response.json({ success: true, order });
  } catch (error) {
    console.log(error);
    return response.json({ success: false, message: error.message });
  }
};

// API to verify payment of razorpay
const verifyPayment = async (request, response) => {
  try {
    const { razorpay_order_id } = request.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });
      response.json({ success: true, message: "Payment Done" });
    } else {
      response.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    return response.json({ success: false, message: error.message });
  }
};

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const allowedTopics = [
  "doctor",
  "medical",
  "appointment",
  "health",
  "symptoms",
  "prescription",
];

const removeMarkdown = (text) => {
  return text
    .replace(/\*\*/g, "")
    .replace(/[*#_-]/g, "")
    .trim();
};

const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!allowedTopics.some((topic) => message.toLowerCase().includes(topic))) {
      return res.json({
        success: false,
        reply:
          "I'm only here to help with medical and appointment-related questions.",
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = await model.generateContent(message);
    let botReply = chat.response.candidates[0].content.parts[0].text;

    // Remove markdown formatting
    botReply = removeMarkdown(botReply);

    res.json({ success: true, reply: botReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyPayment,
  chatWithBot,
};
