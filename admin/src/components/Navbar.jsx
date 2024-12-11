import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";
const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    aToken && setAToken("");
    dToken && setDToken("");
    aToken && localStorage.removeItem("aToken");
    dToken && localStorage.removeItem("dToken");
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border bg-white ">
      <div className="flex items-center gap-2 text-xs">
        <h1
          onClick={() => navigate("/")}
          className="text-primary font-sans font-black text-4xl cursor-pointer"
        >
          DocDirect
        </h1>
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-500">
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>
      <button
        onClick={() => logout()}
        className="bg-primary text-white text-sm px-10 py-2 rounded-full"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
