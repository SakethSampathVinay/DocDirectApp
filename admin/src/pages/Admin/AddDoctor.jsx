import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        return toast.error("Image Not Selected");
      }
      console.log(docImg);

      const formData = new FormData();

      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        {
          headers: { Authorization: `Bearer ${aToken}` },
          "Content-Type": "multipart/form-data",
        }
      );

      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName("");
        setPassword("");
        setEmail("");
        setAddress1("");
        setAddress2("");
        setDegree("");
        setAbout("");
        setFees("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmitHandler} className="m-5 w-full">
        <p className="mb-5 text-lg font-medium">Add Doctor</p>
        <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
          <div className="flex items-center gap-4 mb-8 text-gray-500">
            <label htmlFor="doc-img">
              <img
                className="w-16 bg-gray-100 rounded-full cursor-pointer"
                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                alt=""
              />
            </label>
            <input
              onChange={(event) => setDocImg(event.target.files[0])}
              type="file"
              name=""
              id="doc-img"
              hidden
            />
            <p>
              Upload Doctor <br /> Picture
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
            <div className="w-full lg:flex-1 flex flex-col gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <p>Your Name</p>
                <input
                  onChange={(event) => setName(event.target.value)}
                  value={name}
                  type="text"
                  placeholder="Name"
                  className="border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <p>Doctor Email</p>
                <input
                  onChange={(event) => setEmail(event.target.value)}
                  value={email}
                  type="text"
                  placeholder="Email"
                  className="border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <p>Set Password</p>
                <input
                  onChange={(event) => setPassword(event.target.value)}
                  value={password}
                  type="password"
                  placeholder="Password"
                  className="border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <p>Experience</p>
                <select
                  onChange={(event) => setExperience(event.target.value)}
                  value={experience}
                  className="border rounded px-2 py-2"
                >
                  <option value="1 Year">1 Year</option>
                  <option value="2 Year">2 Year</option>
                  <option value="3 Year">3 Year</option>
                  <option value="4 Year">4 Year</option>
                  <option value="5 Year">5 Year</option>
                  <option value="6 Year">6 Year</option>
                  <option value="7 Year">7 Year</option>
                  <option value="8 Year">8 Year</option>
                  <option value="9 Year">9 Year</option>
                  <option value="10 Year">10 Year</option>
                </select>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <p>Fees</p>
                <input
                  onChange={(event) => setFees(event.target.value)}
                  value={fees}
                  type="number"
                  placeholder="Doctor Fees"
                  className="border rounded px-3 py-2"
                  required
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-x-1">
              <p>Speciality</p>
              <select
                onChange={(event) => setSpeciality(event.target.value)}
                value={speciality}
                className="border rounded px-2 py-2"
              >
                <option value="General physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Degree</p>
              <input
                onChange={(event) => setDegree(event.target.value)}
                value={degree}
                type="text"
                placeholder="Degree"
                className="border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                onChange={(event) => setAddress1(event.target.value)}
                value={address1}
                type="text"
                placeholder="Address 1"
                className="border rounded px-3 py-2"
                required
              />
              <input
                onChange={(event) => setAddress2(event.target.value)}
                value={address2}
                type="text"
                placeholder="Address 2"
                className="border rounded px-3 py-2"
                required
              />
            </div>
          </div>
        </div>
        <div>
          <p>About Doctor</p>
          <textarea
            onChange={(event) => setAbout(event.target.value)}
            value={about}
            className="w-full px-4 pt-2 border rounded"
            rows={5}
            placeholder="Write about Doctor"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
        >
          Add Doctor
        </button>
      </form>
    </div>
  );
};

export default AddDoctor;
