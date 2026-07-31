import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { MdCamera, MdArrowForward, MdRefresh } from "react-icons/md";
import { Audio } from "ts-audio";
import countdownSound from "../audio/countdown.mp3";
import captureSound from "../audio/captureSound.mp3";
const videoConstraints = {
  width: 1020,
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
    return;
  }, [imgSrc, remaining]);

  const captureCountdown = (index: number, retake: boolean) => {
    setCaptureStatus(true);
    let seconds = 5;
    setRemaining(seconds);

    const countdown = Audio({
      file: countdownSound,
      volume: 0.5,
    });
    countdown.play();
    const interval = setInterval(() => {
      seconds--;
      if (seconds > 0) {
        countdown.play();
        setRemaining(seconds);
      } else {
        clearInterval(interval);
        setCaptureStatus(false);
        setRemaining(0);
        capture(retake, index);
      }
    }, 1000);
  };

  const capture = React.useCallback(
    (retake: boolean, index: number) => {
      const capture = Audio({
        file: captureSound,
        volume: 0.5,
      });
      capture.play();
      const imageSrc = webcamRef.current?.getScreenshot();

      if (!imageSrc) return;

      if (!retake) {
        setImageSrc((img) => {
          if (img.length === 3) {
            return img;
          }
          return [...img, imageSrc];
        });
      } else {
        setImageSrc((firstTake) => {
          const newImgSrc = [...firstTake];
          console.log(index);
          newImgSrc[index] = imageSrc;

          return newImgSrc;
        });
      }
    },
    [webcamRef],
  );

  return (
    <>
      <div className="grid grid-cols-[72%_auto] bg-slate-900 content-center">
        <div className="flex flex-col justify-center items-center h-screen ">
          <div className="size-fit relative flex justify-center items-center">
            {captureStatus && (
              <div className="text-8xl font-bold text-yellow-300 absolute z-10">
                {remaining}
              </div>
            )}
            <Webcam
              className="shadow-xl rounded-xl"
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              mirrored={true}
              videoConstraints={videoConstraints}
            />
          </div>

          <button
            disabled={captureStatus}
            onClick={() => captureCountdown(-1, false)}
            className="border-1 rounded-l bg-yellow-300 w-20 flex justify-center p-2 hover:bg-yellow-400 mt-2"
          >
            <MdCamera className="h-5 w-5 text-color" />
          </button>
        </div>
        <div className="flex flex-col bg-slate-800 h-fit m-8 rounded-xl shadow-xl/30 pt-5 pb-5">
          <span className="text-yellow-400 text-xl font-bold ml-5 mb-5">
            Shot Preview
          </span>
          <div className="h-fit w-full gap-3 flex flex-col justify-center items-center">
            <div
              className="relative group h-40 w-70 bg-black shadow-xl/30 rounded-xl"
              onClick={() => {
                captureCountdown(0, true);
              }}
            >
              {imgSrc[0] && (
                <div>
                  <img
                    src={imgSrc[0]}
                    className="h-40 w-70 rounded-xl bg-black shadow-xl/30 group-hover:brightness-50"
                  />
                  <div className="absolute flex justify-self-center top-12 flex-col">
                    <MdRefresh
                      className="h-13 w-13  text-yellow-500 
             opacity-0 group-hover:opacity-100 group-hover:animate-refresh flex justify-self-center self-center"
                    />
                    <span className="text-white text-xl flex self-center justify-self-center opacity-0 group-hover:opacity-100">
                      Retake
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div
              className="relative group h-40 w-70 bg-black shadow-xl/30 rounded-xl"
              onClick={() => {
                captureCountdown(1, true);
              }}
            >
              {imgSrc[1] && (
                <div>
                  <img
                    src={imgSrc[1]}
                    className="h-40 w-70 rounded-xl bg-black shadow-xl/30 group-hover:brightness-50"
                  />
                  <div className="absolute flex justify-self-center top-12 flex-col">
                    <MdRefresh
                      className="h-13 w-13  text-yellow-500 
             opacity-0 group-hover:opacity-100 group-hover:animate-refresh flex justify-self-center self-center"
                    />
                    <span className="text-white text-xl flex self-center justify-self-center opacity-0 group-hover:opacity-100">
                      Retake
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative group h-40 w-70 bg-black shadow-xl/30 rounded-xl"
              onClick={() => {
                captureCountdown(2, true);
              }}
            >
              {imgSrc[2] && (
                <div>
                  <img
                    src={imgSrc[2]}
                    className="h-40 w-70 rounded-xl bg-black shadow-xl/30 group-hover:brightness-50"
                  />
                  <div className="absolute flex justify-self-center top-12 flex-col">
                    <MdRefresh
                      className="h-13 w-13  text-yellow-500 
             opacity-0 group-hover:opacity-100 group-hover:animate-refresh flex justify-self-center self-center"
                    />
                    <span className="text-white text-xl flex self-center justify-self-center opacity-0 group-hover:opacity-100">
                      Retake
                    </span>
                  </div>
                </div>
              )}
            </div>

            {imgSrc.length === 3 && (
              <button
                disabled={captureStatus}
                className="w-70 flex text-black justify-center text-l font-bold hover:bg-yellow-400 items-center 
                bg-yellow-500 rounded-xl h-10 gap-1 mt-2"
                onClick={() => {
                  navigate("/download", { state: imgSrc });
                }}
              >
                Continue <MdArrowForward className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Photobooth;
