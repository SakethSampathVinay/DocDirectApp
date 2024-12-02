import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets, doctors } from "../assets/assets";

const MyAppointments = () => {
  const { doctors } = useContext(AppContext);
  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">
        My Appointments
      </p>
      <div>
        {doctors.slice(0, 2).map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
          >
            <div>
              <img
                className="w-36 bg-[#EAEFFF]"
                src={assets.appointment_img}
                alt="appointment page"
              />
            </div>
            <div className="flex-1 text-sm text-[#5E5E5E]">
              <p className="text-[#262626] text-base font-semibold">
                {item.name}
              </p>
              <p>{item.speciality}</p>
              <p className="text-[#464646] font-semibold pt-5">Address:</p>
              <p>{item.address.line1}</p>
              <p>{item.address.line2}</p>
              <p className="mt-1">
                Date & Time:{" "}
                <span className="text-sm text-[#3C3C3C]">
                  25, July, 2024 | 8:30 PM
                </span>
              </p>
            </div>
            <div className="flex flex-col p-3">
              <button className="text-sm bg-primary text-white text-center sm:min-w-48 py-2 border rounded m-1">Pay here</button>
              <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded m-1 hover:bg-red-600 hover:text-white">Cancel Appointment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
