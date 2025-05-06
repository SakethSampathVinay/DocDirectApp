import React from "react";
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Video from "../components/video";

const Home = () => {
  return (
    <div>
      <Video />
      {/* <Header /> */}
      <SpecialityMenu />
      <TopDoctors />
      {/* <Banner /> */}
      <img className="h-[600px] w-full" src="https://res.cloudinary.com/dgtfgihga/image/upload/v1746299137/20250503_2343_Quick_Doctor_Booking_simple_compose_01jtbnjk7sedxrqt7nbsy0bjv4_ghgpmo.png" />
    </div>
  );
};

export default Home;
