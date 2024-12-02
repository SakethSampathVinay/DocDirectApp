import React, { useState } from "react";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: "Edward Vincent",
    image: assets.profile_pic,
    email: "sakethsampath2006@gmail.com",
    phone: "1234567890",
    address: {
      line1: "123, Main Street",
      line2: "456, Main Street",
    },
    gender: "Male",
    dob: "2000-01-20",
  });

  const [isEdit, setIsEdit] = useState(false);

  return (
    <div>
      <img src={userData.image} alt="profile image" />
      {isEdit ? (
        <input
          type="text"
          onChange={(event) =>
            setUserData((prev) => ({ ...prev, name: event.target.value }))
          }
          value={userData.name}
        />
      ) : (
        <p>{userData.name}</p>
      )}
      <hr className="bg-[#ADADAD] h-[1px] border-none" />

      <div>
        <p className="text-gray-600 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-500">{userData.email}</p>
          <p className="font-medium">Phone:</p>

          {isEdit ? (
            <input
              className="bg-gray-50 max-w-52"
              type="text"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
              value={userData.phone}
            />
          ) : (
            <p className="text-blue-500">{userData.phone}</p>
          )}

          <p className="font-medium">Address:</p>

          {isEdit ? (
            <p>
              <input
                className="bg-gray-50"
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
                value={userData.address.line1}
              />
              <br />
              <input
                className="bg-gray-50"
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
                value={userData.address.line2}
              />
            </p>
          ) : (
            <p className="text-gray-500">
              {userData.address.line1} <br /> {userData.address.line2}
            </p>
          )}
        </div>
      </div>
      <div>
        <p className="text-[#797979] underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
          <p className="font-medium">Gender:</p>

          {isEdit ? (
            <select
              className="max-w-20 bg-gray-50"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={userData.gender}
            >
              <option value="Not Selected">Not Selected</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-500">{userData.gender}</p>
          )}

          <p className="font-medium">Birthday:</p>

          {isEdit ? (
            <input
              className="max-w-28 bg-gray-50"
              type="date"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
              value={userData.dob}
            />
          ) : (
            <p className="text-gray-500">{userData.dob}</p>
          )}
        </div>
      </div>
      <div className="mt-10">
        {isEdit ? (
          <button
            onClick={() => setIsEdit(false)}
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            Save information
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
