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
            className="bg-white h-150 w-100 animate-fadeIn grid grid-cols-2 gap-1"
            ref={contentRef}
          >
            <div className="relative">
              <img src={images[0]} className="translate-x-1/7 translate-y-20 object-fit bg-white absolute object-center" height="120" width="155" />
              <img src={images[1]} className="translate-x-1/7 translate-y-51 object-fit bg-white absolute " height="120" width="155" />
              <img src={images[2]} className="translate-x-1/7 translate-y-82  object-fit bg-white absolute" height="120" width="155" />
              <img src={template} className="w-full h-full object-fit" />
            </div>
            <div>
               <img src={images[0]} className="translate-x-1/7 translate-y-20 object-fit bg-white absolute" height="120" width="155" />
              <img src={images[1]} className="translate-x-1/7 translate-y-51 object-fit bg-white absolute " height="120" width="155" />
              <img src={images[2]} className="translate-x-1/7 translate-y-82  object-fit bg-white absolute" height="120" width="155" />
              <img src={template} className="w-full h-full object-fit" />
            </div>
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
