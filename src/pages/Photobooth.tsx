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

  const [remaining, setRemaining] = useState(0);
  const navigate = useNavigate();

  const webcamRef = React.useRef<Webcam>(null);
  const [captureStatus, setCaptureStatus] = useState(false);

  useEffect(() => {
    if (imgSrc.length === 4) {
      navigate("/download", { state: imgSrc });
      return;
    }
    return;
  }, [imgSrc, remaining]);

  const captureCountdown = () => {
    setCaptureStatus(true);
    let seconds = 5;
    setRemaining(seconds);

    const interval = setInterval(() => {
      seconds--;

      if (seconds > 0) {
        setRemaining(seconds);
      } else {
        clearInterval(interval);
        setCaptureStatus(false);
        setRemaining(0);
        capture();
      }
    }, 1000);
  };

  const capture = React.useCallback(() => {
    if (remaining === 0) {
      const imageSrc = webcamRef.current?.getScreenshot();

      if (!imageSrc) return;

      setImageSrc((img) => {
        if (img.length === 4) {
          return img;
        }

        return [...img, imageSrc];
      });
    }
  }, [webcamRef]);

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen bg-slate-700">
        <div className="size-fit relative flex justify-center items-center">
          {captureStatus && (
            <div className="text-8xl font-bold text-white absolute z-10">
              {remaining}
            </div>
          )}
          <Webcam
            className="shadow-xl brightness-80"
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            mirrored={true}
            videoConstraints={videoConstraints}
          />
        </div>

        <button
          onClick={captureCountdown}
          className="border-1 rounded-l bg-yellow-300 w-20 flex justify-center p-2 hover:bg-yellow-200 m-1"
        >
          <FaCamera className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}

export default Photobooth;
