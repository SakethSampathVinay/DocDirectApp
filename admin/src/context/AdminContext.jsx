import React, { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken")
      ? localStorage.getItem("aToken")
      : localStorage.getItem("")
  );
  const [doctors, setDoctors] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/all-doctors", {
        headers: {
          Authorization: `Bearer ${aToken}`, // Ensure `aToken` is valid
        },
      });
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while fetching doctors.";
      toast.error(errorMessage);
    }
  };


  const changeAvailablity = async(docId) => {
    try {
      const {data} = await axios.post(backendUrl + "/api/admin/change-availability", {docId}, {
        headers : {
          Authorization: `Bearer ${aToken}`,
        }
      })
      if(data.success) {
        toast.success(data.message)
        getAllDoctors();
      }
    } catch(error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const value = { aToken, setAToken, backendUrl, getAllDoctors, doctors, changeAvailablity };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
