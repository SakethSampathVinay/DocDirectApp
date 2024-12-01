import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-[#707070]">
        <p>
          Contact <span className="text-gray-700 font-semibold">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img src={assets.contact_image} alt="contact image" className="w-full md:max-w-[360px]"/>
        <div className="flex flex-col justify-center items-start gap-6">
          <p className=' font-semibold text-lg text-gray-600'>OUR OFFICE</p>
          <p className=' text-gray-500'>Greater Noida</p>
          <p className=' text-gray-500'>
            Tel: (91) 7093023759 <br /> Email: sakethsampath2006@yahoo.com
          </p>
          <p className=' font-semibold text-lg text-gray-600'>CAREERS AT DocDirect</p>
          <p className=' text-gray-500'>Learn more about our teams and job openings.</p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
