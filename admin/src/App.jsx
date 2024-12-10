import React, { useContext } from "react";
import Login from "./pages/Login.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import DoctorsList from "./pages/Admin/DoctorsList.jsx";
import AddDoctor from "./pages/Admin/AddDoctor.jsx";
import AllAppointments from "./pages/Admin/AllAppointments.jsx";
import { Routes, Route } from "react-router-dom";
import { DoctorContext } from "./context/DoctorContext.jsx";
import DoctorDashBoard from "./pages/Doctors/DoctorDashBoard.jsx";
import DoctorAppointments from "./pages/Doctors/DoctorAppointments.jsx";
import DoctorProfile from "./pages/Doctors/DoctorProfile.jsx";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return aToken || dToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex flex-start">
        <Sidebar />
        <Routes>
          {/*Admin Route */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/admin-appointments" element={<AllAppointments />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorsList />} />
          {/*Doctor Route */}
          <Route path="/doctor-dashboard" element={<DoctorDashBoard />} />
          <Route path="/doctor-appointments" element={<DoctorAppointments />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
