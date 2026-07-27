import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa6";

const videoConstraints = {
  width: 920,
  height: 620,
  facingMode: "user",
};

function Photobooth() {
  const [imgSrc, setImageSrc] = useState<string[]>([]);

  const duration = 5;
  const navigate = useNavigate();
  const webcamRef = React.useRef<Webcam>(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) return;

    setImageSrc((img) => {
      if (img.length === 4) {
        return img;
      }

      return [...img, imageSrc];
    });
  }, [webcamRef]);

  useEffect(() => {
    if (imgSrc.length === 4) {
      navigate("/download", { state: imgSrc });
      return;
    }

    return;
  }, [imgSrc]);

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="relative">
          <Webcam
            className="border-5 border-solid border-yellow-500"
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            mirrored={true}
            videoConstraints={videoConstraints}
          />
        </div>
        <div className="absolute text-8xl font-bold text-white">
          {remaining}
        </div>
        <button
          onClick={capture}
          className="border-1 rounded-l border-gray-300 bg-gray-200 w-20 flex justify-center p-2 hover:bg-gray-300 m-1"
        >
          <FaCamera className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}

export default Photobooth;
