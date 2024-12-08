import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const navigate = useNavigate();
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState(null);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = () => {
    const slots = [];
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // Setting start hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      const daySlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        const slotTime = formattedTime;

        const isSlotAvailable =
          !docInfo.slots_booked?.[slotDate]?.includes(slotTime);

        if (isSlotAvailable) {
          daySlots.push({
            datatime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      slots.push(daySlots);
    }

    setDocSlots(slots); // Set all slots at once
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    if (!docSlots || !docSlots[slotIndex] || docSlots[slotIndex].length === 0) {
      toast.error("No slots available for the selected date.");
      return;
    }

    const date = docSlots[slotIndex][0].datatime;
    if (!date || !(date instanceof Date)) {
      toast.error("Invalid date selected.");
      return;
    }

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    const slotDate = `${day}_${month}_${year}`;

    console.log("Booking appointment with:", { docId, slotDate, slotTime });

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data?.success) {
        toast.success("Appointment booked successfully");
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data?.message || "Failed to book appointment");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (doctors?.length > 0) {
      fetchDocInfo();
    }
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  return docInfo ? (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            src={docInfo.image}
            alt="docInfo Image"
            className="bg-primary w-full sm:max-w-72 rounded-lg"
          />
        </div>
        <div className="flex-1 border border-[#ADADAD] rounded-lg p-8  py-7 bg-white mx-2 sm:mx-0 mt-[-80] sm:mt-0">
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {docInfo.name} <img className="w-5" src={assets.verified_icon} />
          </p>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p className="flex items-center gap-2 mt-1 text-gray-600">
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {docInfo.experience}
            </button>
          </div>

          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-[#262626] mt-3 ">
              About <img className="w-3" src={assets.info_icon} />
            </p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">
              {docInfo.about}
            </p>
          </div>
          <p className="text-gray-600 font-medium mt-4">
            Appointment Fee:{" "}
            <span className="text-gray-800">
              {currencySymbol} {docInfo.fees}
            </span>
          </p>
        </div>
      </div>
      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656] ">
        <p>Booking Slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots?.length &&
            docSlots.map((item, index) => (
              <div
                onClick={() => setSlotIndex(index)}
                key={index}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index
                    ? "bg-primary text-white"
                    : "border border-[#DDDDDD]"
                }`}
              >
                <p>{item[0] && daysOfWeek[item[0].datatime.getDay()]}</p>
                <p>{item[0] && item[0].datatime.getDate()}</p>
              </div>
            ))}
        </div>

        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots?.length &&
            docSlots[slotIndex].map((item, index) => (
              <p
                onClick={() => setSlotTime(item.time)}
                key={index}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  item.time === slotTime
                    ? "bg-primary text-white"
                    : "text-[#949494] border border-[#B4B4B4]"
                }`}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
        </div>
        <div>
          <button
            onClick={bookAppointment}
            className="bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6"
          >
            Book an appointment
          </button>
        </div>
      </div>
      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
    </div>
  ) : null;
};

export default Appointment;
