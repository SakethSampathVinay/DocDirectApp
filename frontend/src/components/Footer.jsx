import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm">
        <div>
          <h1
            onClick={() => navigate("/")}
            className="text-primary font-sans font-black text-4xl pb-5"
          >
            DocDirect
          </h1>
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            At DocDirect, we connect you with highly qualified and experienced
            doctors from various specialties. Our trusted network of medical
            professionals includes certified practitioners, specialists, and
            surgeons with years of expertise in providing top-notch healthcare.
            Whether you need a general consultation, a specialist advice, or
            ongoing care, Prescripto ensures you have access to the best medical
            services from the comfort of your home.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+01 12345 67890</li>
            <li>abc@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025 @ DocDirect.com - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
