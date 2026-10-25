import { useRef, useCallback, useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

//CPEYESTA
import day1Template from "../images/day1Template.png";
import day2Template from "../images/day2Template.png";

import day1Elements from "../images/day1Elements.png";
import day2Elements from "../images/day2Elements.png";

//ACES
import acesTemplate from "../images/acesTemplate.png";
import acesElements from "../images/acesElements.png";

import LoadingPage from "../pages/LoadingPage";
import { useReactToPrint } from "react-to-print";
import { MdPrint, MdDownload, MdCamera } from "react-icons/md";
import QRCode from "qrcode";

function PhotoTemplate() {
  //passing the images

  const location = useLocation();
  const { images, option } = location.state || {};

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

    //template
    const bgImage = new Image();

    //shots
    const image1 = new Image();
    const image2 = new Image();
    const image3 = new Image();

    //elements

    const day1 = new Image();
    const day2 = new Image();
    const aces = new Image();

    day1.src = day1Elements;
    day2.src = day2Elements;
    aces.src = acesElements;

    //bgImage
    if (option === 0) bgImage.src = day1Template;
    if (option === 1) bgImage.src = day2Template;
    if (option === 2) bgImage.src = acesTemplate;

    image1.src = images[0];

    image2.src = images[1];

    image3.src = images[2];

    bgImage.onload = async () => {
      ctx.drawImage(bgImage, 0, 0, 400, 600);

      if (option === 0) {
        drawImageCover(ctx, image1, 12.6, 87, 175, 127.5);
        drawImageCover(ctx, image2, 12.6, 246, 175, 127.5);
        drawImageCover(ctx, image3, 12.6, 404.5, 175, 127.5);

        drawImageCover(ctx, image1, 212.5, 87, 175, 127.5);
        drawImageCover(ctx, image2, 212.5, 246, 175, 127.5);
        drawImageCover(ctx, image3, 212.5, 404.5, 175, 127.5);
      }

      if (option === 1) {
        drawImageCover(ctx, image1, 9.6, 88.2, 180.8, 133);
        drawImageCover(ctx, image2, 9.6, 248, 180.8, 133);
        drawImageCover(ctx, image3, 9.6, 410, 180.8, 133);

        drawImageCover(ctx, image1, 209.6, 88.2, 180.8, 133);
        drawImageCover(ctx, image2, 209.6, 248, 180.8, 133);
        drawImageCover(ctx, image3, 209.6, 410, 180.8, 133);
      }
      if (option === 2) {
        drawImageCover(ctx, image1, 8.2, 27.5, 182.3, 145.7);
        drawImageCover(ctx, image2, 8.2, 179.5, 182.3, 145.7);
        drawImageCover(ctx, image3, 8.2, 331.2, 182.3, 145.7);

        drawImageCover(ctx, image1, 209.6, 28, 182.3, 146);
        drawImageCover(ctx, image2, 209.6, 180, 182.3, 145.7);
        drawImageCover(ctx, image3, 209.6, 331.6, 182.3, 146);
      }

      const uploadedUrl = await upload();
      const qr = new Image();

      const dataUrl = await QRCode.toDataURL(uploadedUrl, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: "H",
      });

      await new Promise<void>((resolve, reject) => {
        qr.onload = () => resolve();
        qr.onerror = reject;
        qr.src = dataUrl;
      });

      if (option === 0) {
        ctx.drawImage(day1, 0, 0, 400, 600);

        ctx.drawImage(qr, 152, 550, 40, 40);
        ctx.drawImage(qr, 352, 550, 40, 40);
      }

      if (option === 1) {
        ctx.drawImage(day2, 0, 0, 400, 600);

        ctx.drawImage(qr, 157, 553, 35, 35);
        ctx.drawImage(qr, 357, 553, 35, 35);
      }
      if (option === 2) {
        ctx.drawImage(aces, 0, 0, 400, 600);

        ctx.drawImage(qr, 160, 560, 30, 30);
        ctx.drawImage(qr, 360, 560, 30, 30);
      }
    };
  }, [loading]);

  //upload photostrip function
  const upload = async (): Promise<string> => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("Canvas not ready");

    // 1. Convert canvas to blob (promisified)
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error("Canvas is empty"));
      }, "image/png");
    });

    // 2. Upload
    const formData = new FormData();
    formData.append("file", blob, "photo.png");
    formData.append("upload_preset", "Photobooth");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/qwy54ilu/image/upload",
      { method: "POST", body: formData },
    );
    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return data.secure_url as string;
  };

  function drawImageCover(
    ctx: CanvasRenderingContext2D,
    img: any,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = w / h;

    let sx, sy, sw, sh;

    if (imgRatio > boxRatio) {
      sh = img.naturalHeight;
      sw = sh * boxRatio;
      sx = (img.naturalWidth - sw) / 2;
      sy = 0;
    } else {
      sw = img.naturalWidth;
      sh = sw / boxRatio;
      sx = 0;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }
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
