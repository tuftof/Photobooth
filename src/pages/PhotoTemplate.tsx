import { useRef, useCallback, useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import template from "../images/template1.png";
import { toPng } from "html-to-image";
import LoadingPage from "../pages/LoadingPage";
import { useReactToPrint } from "react-to-print";
import { MdPrint, MdDownload, MdCamera } from "react-icons/md";
function PhotoTemplate() {
  //passing the images

  const location = useLocation();
  const images = location.state;

  //Loading image
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  //downloading image
  const downloadImage = useCallback(() => {
    if (contentRef.current === null) {
      return;
    }

    toPng(contentRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "photo.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [contentRef]);

  //print image

  const reactToPrintFn = useReactToPrint({
    contentRef: contentRef,
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, [loading]);

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="flex flex-col justify-center items-center h-screen gap-3 bg-slate-700">
          <div
            style={{ backgroundImage: `url(${template})` }}
            className="bg-no-repeat bg-cover bg-center h-150 w-100 animate-fadeIn object-cover"
            ref={contentRef}
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

          <div className="flex gap-5">
            <button
              className="bg-yellow-400 p-2 rounded-lg text-l font-bold flex items-center gap-2"
              onClick={reactToPrintFn}
            >
              <MdPrint /> Print
            </button>
            <button
              className="bg-green-400 p-2 rounded-lg text-l font-bold flex items-center gap-2"
              onClick={downloadImage}
            >
              <MdDownload /> Download
            </button>
            <Link to={"/"}>
              <button className="bg-white p-2 rounded-lg text-l font-bold flex items-center gap-2">
                <MdCamera /> Retake
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default PhotoTemplate;
