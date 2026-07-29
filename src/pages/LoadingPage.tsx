import { useEffect } from "react";
import camera from "../images/cameraLoad.png";
import { useNavigate } from "react-router-dom";

function LoadingPage() {
  useEffect(() => {
    setTimeout(() => {
      const navigate = useNavigate();
      navigate("/download");
    }, 1000);
  });
  return (
    <>
      <div className="h-screen bg-slate-700">
        <div className="flex justify-center h-screen items-center flex-col animate-fadeIn">
          <img
            src={camera}
            alt=""
            className="h-40 animate-rotateCam"
            style={{
              animationDirection: "alternate-reverse",
            }}
          />
          <span className="text-yellow-300 text-xl">Preparing your image</span>
        </div>
      </div>
    </>
  );
}

export default LoadingPage;
