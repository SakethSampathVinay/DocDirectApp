import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData?.name || "");
      formData.append("email", userData?.email || "");
      formData.append("address", JSON.stringify(userData?.address || {}));
      formData.append("gender", userData?.gender || "");
      formData.append("phone", userData?.phone || "");
      formData.append("dob", userData?.dob || "");

      if (image) formData.append("image", image);

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return userData ? (
    <div className="max-w-lg flex flex-col gap-2 text-sm pt-5">
      {isEdit ? (
        <label htmlFor="image">
          <div className="relative inline-block cursor-pointer">
            <img
              className="w-36 h-36 rounded opacity-75"
              src={image ? URL.createObjectURL(image) : userData.image}
              alt="user"
            />
            <img
              className="w-10 absolute bottom-12 right-12"
              src={assets.upload_icon}
              alt="upload"
            />
          </div>
          <input
            type="file"
            id="image"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>
      ) : (
        <img src={userData.image} alt="profile" className="w-36 rounded" />
      )}

      {isEdit ? (
        <input
          type="text"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
          value={userData?.name || ""}
        />
      ) : (
        <p>{userData?.name}</p>
      )}

      <hr className="bg-gray-400 h-px border-none" />

      <p className="text-gray-600 underline mt-3">CONTACT INFORMATION</p>
      <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
        <p className="font-medium">Email:</p>
        <p className="text-blue-500">{userData?.email}</p>

        <p className="font-medium">Phone:</p>
        {isEdit ? (
          <input
            type="text"
            className="bg-gray-50 max-w-52"
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, phone: e.target.value }))
            }
            value={userData?.phone || ""}
          />
        ) : (
          <p className="text-blue-500">{userData?.phone}</p>
        )}

        <p className="font-medium">Address:</p>
        {isEdit ? (
          <>
            <input
              type="text"
              className="bg-gray-50"
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...prev.address, line1: e.target.value },
                }))
              }
              value={userData?.address?.line1 || ""}
            />
            <input
              type="text"
              className="bg-gray-50"
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...prev.address, line2: e.target.value },
                }))
              }
              value={userData?.address?.line2 || ""}
            />
          </>
        ) : (
          <p className="text-gray-500">
            {userData?.address?.line1} <br /> {userData?.address?.line2}
          </p>
        )}
      </div>

      <div className="mt-10">
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="border px-8 py-2 rounded-full hover:bg-primary hover:text-white"
          >
            Save Information
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="border px-8 py-2 rounded-full hover:bg-primary hover:text-white"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  ) : null;
};

export default MyProfile;
