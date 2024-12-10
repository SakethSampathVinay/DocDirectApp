import React, { createContext, useState } from "react";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const [dToken, setDToken] = useState(
    localStorage.getItem("DToken")
      ? localStorage.getItem("DToken")
      : localStorage.getItem("")
  );

  const backendurl = import.meta.env.VITE_BACKEND_URL;

  const value = {
    setDToken,
    dToken,
    backendurl,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
