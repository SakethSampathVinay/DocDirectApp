import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const [dToken, setDToken] = useState(
    localStorage.getItem("DToken")
      ? localStorage.getItem("DToken")
      : localStorage.getItem("")
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  const backendurl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (dToken) {
      localStorage.setItem("DToken", dToken);
    } else {
      localStorage.removeItem("DToken");
    }
  }, [dToken]);

  // Getting the Doctor Appointment Data from the Database using API
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendurl + "/api/doctor/appointments",
        {
          headers: { Authorization: `Bearer ${dToken}` },
        }
      );
      if (data?.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Getting Doctor Profile data from Database using API
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/doctor/profile", {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data?.success) {
        setProfileData(data.profileData);
        console.log(data.profileData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // API to cancel the appointment from Database using API
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/doctor/cancel-appointment",
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${dToken}` },
        }
      );
      if (data?.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // API to Mark Appointment Cancelled for API
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/doctor/complete-appointment",
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${dToken}` },
        }
      );
      if (data?.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Getting Doctor dashboard data using API
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/doctor/dashboard", {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data?.success) {
        setDashData(data.dashData);
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    setDToken,
    dToken,
    backendurl,
    setAppointments,
    appointments,
    getAppointments,
    setProfileData,
    profileData,
    getProfileData,
    cancelAppointment,
    completeAppointment,
    getDashData,
    dashData,
    setDashData,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
