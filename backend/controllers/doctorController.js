import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import appointmentModel from "../models/appointmentModel.js";

// API to Change Doctor Availability for Admin and Doctor Panel
const changeAvailablity = async (request, response) => {
  try {
    const { docId } = request.body;
    const docData = await doctorModel.findById(docId);

    // Check if the doctor was found
    if (!docData) {
      return response
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    return response.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
    return response.json({ success: false, message: error.message });
  }
};

const doctorList = async (request, response) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]); // excluding password and email remaining all saved in the doctors variable
    return response.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    return response.json({ success: false, message: error.message });
  }
};

// API for doctor login
const loginDoctor = async (request, response) => {
  try {
    const { email, password } = request.body;
    const user = await doctorModel.findOne({ email });

    if (!user) {
      return response.json({ success: false, message: "Invalid Credential" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      response.json({ success: true, token });
    } else {
      response.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (request, response) => {
  try {
    const { docId } = request.body;
    const appointments = await appointmentModel.find({ docId });
    return response.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};

// API to cancel appointment for doctor panel
const appointmentCancel = async (request, response) => {
  try {
    const { docId, appointmentId } = request.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return response.json({ success: true, message: "Appointment Cancelled" });
    }
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};

// API to mark appointment completed for doctor panel
const appointmentComplete = async (request, response) => {
  try {
    const { docId, appointmentId } = request.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return response.json({ success: true, message: "Appointment Completed" });
    }
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (request, response) => {
  try {
    const { docId } = request.body;
    const profileData = await doctorModel.findById(docId).select("-password");
    return response.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (request, response) => {
  try {
    const { docId, fees, address, about, available } = request.body;
    await doctorModel.findByIdAndUpdate(docId, { fees, address, available, about });
    return response.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for doctor panel
const doctorDashboard = async (request, response) => {
  try {
    const { docId } = request.body;
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];

    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse(),
    };

    response.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    response.json({ success: false, message: error.message });
  }
};

export {
  changeAvailablity,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
};
