import { useRef, useCallback, useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

import template from "../images/sampleTemplate.png";
import LoadingPage from "../pages/LoadingPage";
import { useReactToPrint } from "react-to-print";
import { MdPrint, MdDownload, MdCamera } from "react-icons/md";

function PhotoTemplate() {
  //passing the images

  const location = useLocation();
  const images = location.state;

  //Loading image
  const [loading, setLoading] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  //downloading image
  const downloadImage = useCallback(() => {
    if (canvasRef.current === null) {
      return;
    }

    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "photo.png";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [canvasRef]);

  //print image

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = Math.max(window.devicePixelRatio || 1, 3);

    canvas.width = 400 * scale;
    canvas.height = 600 * scale;

    canvas.style.width = "400px";
    canvas.style.height = "600px";

    ctx.scale(scale, scale);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const bgImage = new Image();
    const image1 = new Image();
    const image2 = new Image();
    const image3 = new Image();
    bgImage.src = template;
    image1.src = images[0];
    image2.src = images[1];
    image3.src = images[2];

    bgImage.onload = () => {
      ctx.drawImage(bgImage, 0, 0, 400, 600);

      ctx.drawImage(image1, 21, 82, 164, 117);
      ctx.drawImage(image2, 21, 205.5, 164, 117);
      ctx.drawImage(image3, 21, 329, 164, 117);

      ctx.drawImage(image1, 225, 82, 164, 117);
      ctx.drawImage(image2, 225, 205.5, 164, 117);
      ctx.drawImage(image3, 225, 329, 164, 117);
    };
  }, [loading]);

  const reactToPrintFn = useReactToPrint({
    contentRef: contentRef,
  });

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="flex flex-col justify-center items-center h-screen gap-3 bg-slate-900">
          <div ref={contentRef}>
            <canvas ref={canvasRef} />
          </div>

          <div className="flex gap-5">
            <button
              className="bg-yellow-400 p-2 rounded-lg text-l font-bold flex items-center gap-2 hover:bg-yellow-300"
              onClick={reactToPrintFn}
            >
              <MdPrint /> Print
            </button>
            <button
              className="bg-green-400 p-2 rounded-lg text-l font-bold flex items-center gap-2 hover:bg-green-300"
              onClick={downloadImage}
            >
              <MdDownload /> Download
            </button>
            <Link to={"/"}>
              <button className="bg-mist-200 p-2 rounded-lg text-l font-bold flex items-center gap-2 hover:bg-white">
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
