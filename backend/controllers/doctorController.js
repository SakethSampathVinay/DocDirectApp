import doctorModel from "../models/doctorModel.js";

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

export { changeAvailablity, doctorList };
