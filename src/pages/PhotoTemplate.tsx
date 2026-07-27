import { useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import template from "../images/template1.png";
import { toPng } from "html-to-image";
function PhotoTemplate() {
  const location = useLocation();
  const images = location.state;

  const divRef = useRef<HTMLDivElement>(null);

  const downloadImage = useCallback(() => {
    if (divRef.current === null) {
      return;
    }

    toPng(divRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "photo.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [divRef]);

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen gap-3">
        <div
          style={{ backgroundImage: `url(${template})` }}
          className="bg-no-repeat bg-cover bg-center  h-150 w-100"
          ref={divRef}
        >
          <div
            style={{
              backgroundImage: `url(${images[0]})`,
              transform: "translate(2.12rem, 7.72rem) rotate(-3.9deg)",
              height: "5.5rem",
              width: "6.4rem",
            }}
            className="bg-cover bg-center bg-no-repeat "
          ></div>

          <div
            style={{
              backgroundImage: `url(${images[1]})`,
              transform: "translate(2.57rem, 8.64rem) rotate(-3.9deg)",
              height: "5.5rem",
              width: "6.4rem",
            }}
            className="bg-cover bg-center bg-no-repeat "
          ></div>

          <div
            style={{
              backgroundImage: `url(${images[2]})`,
              transform: "translate(14.71rem, -3.28rem) rotate(-3.9deg)",
              height: "5.5rem",
              width: "6.4rem",
            }}
            className="bg-cover bg-center bg-no-repeat "
          ></div>

          <div
            style={{
              backgroundImage: `url(${images[3]})`,
              transform: "translate(15.18rem, -2.365rem) rotate(-3.9deg)",
              height: "5.5rem",
              width: "6.4rem",
            }}
            className="bg-cover bg-center bg-no-repeat "
          ></div>
        </div>

        <button
          className="bg-blue-300 p-2 rounded-lg text-l"
          onClick={downloadImage}
        >
          Download image
        </button>
      </div>
    </>
  );
}

export default PhotoTemplate;
