import React from "react";

function Video() {
  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden bg-primary aspect-video">
      <video
        className="w-full h-full object-cover"
        src="https://res.cloudinary.com/dgtfgihga/video/upload/v1746298129/Generated_File_May_04_2025_-_12_14AM_cq4jar.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
}

export default Video;
