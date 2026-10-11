import { useRef, useCallback, useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import flowerElement from "../images/flower.png";
import fabricElement from "../images/fabric.png";
import signElement from "../images/sign.png";
import starElement from "../images/star.png";
import leftStarElement from "../images/leftStar.png";
import firstTemplate from "../images/firstTemplateBg.png";
import secondTemplate from "../images/secondTemplate.png";
import thirdTemplate from "../images/thirdTemplate.png";
import LoadingPage from "../pages/LoadingPage";
import { useReactToPrint } from "react-to-print";
import { MdPrint, MdDownload, MdCamera } from "react-icons/md";

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
    const image4 = new Image();

    //elements for first template
    const flower = new Image();
    const sign = new Image();
    const fabric = new Image();
    const star = new Image();
    const leftStar = new Image();

    if (option === 0) bgImage.src = firstTemplate;
    if (option === 1) bgImage.src = secondTemplate;
    if (option === 2) bgImage.src = thirdTemplate;

    image1.src = images[0];
    image2.src = images[1];
    image3.src = images[2];
    image4.src = images[3];

    flower.src = flowerElement;
    sign.src = signElement;
    fabric.src = fabricElement;
    star.src = starElement;
    leftStar.src = leftStarElement;

    bgImage.onload = () => {
      ctx.drawImage(bgImage, 0, 0, 400, 600);

      if (option === 0) {
        drawImageCover(ctx, image1, 6, 24.5, 184, 120);
        drawImageCover(ctx, image2, 6, 150.5, 184, 120);
        drawImageCover(ctx, image3, 6, 274.5, 184, 120);
        drawImageCover(ctx, image4, 6, 400.5, 184, 120);

        drawImageCover(ctx, image1, 209, 24.5, 184, 120);
        drawImageCover(ctx, image2, 209, 150.5, 184, 120);
        drawImageCover(ctx, image3, 209, 274.5, 184, 120);
        drawImageCover(ctx, image4, 209, 400.5, 184, 120);

        ctx.drawImage(fabric, -4, 10, 60, 40);
        ctx.drawImage(fabric, 199, 10, 60, 40);

        ctx.drawImage(star, 170, 43, 35, 35);
        ctx.drawImage(star, 376, 43, 35, 35);

        ctx.drawImage(leftStar, -10, 128, 45, 45);
        ctx.drawImage(leftStar, 196, 128, 45, 45);

        drawImageCover(ctx, sign, 70, 255, 55, 20);
        drawImageCover(ctx, sign, 275, 255, 55, 20);

        ctx.drawImage(flower, -13, 357, 50, 50);
        ctx.drawImage(flower, 193, 357, 50, 50);

        ctx.drawImage(star, 166, 472, 40, 40);
        ctx.drawImage(star, 370, 472, 40, 40);
      }

      if (option === 1) {
        drawImageCover(ctx, image1, 6, 131, 184, 104.5);
        drawImageCover(ctx, image2, 6, 236, 184, 104.5);
        drawImageCover(ctx, image3, 6, 341, 184, 104.5);
        drawImageCover(ctx, image4, 6, 446, 184, 104.5);

        drawImageCover(ctx, image1, 210, 131, 184, 104.5);
        drawImageCover(ctx, image2, 210, 236, 184, 104.5);
        drawImageCover(ctx, image3, 210, 341, 184, 104.5);
        drawImageCover(ctx, image4, 210, 446, 184, 104.5);
      }

      if (option === 2) {
        drawImageCover(ctx, image1, 8.5, 43, 183.5, 113);
        drawImageCover(ctx, image1, 8.5, 158.5, 183.5, 113);
        drawImageCover(ctx, image1, 8.5, 274, 183.5, 113);
        drawImageCover(ctx, image1, 8.5, 389.5, 183.5, 113);

        drawImageCover(ctx, image1, 208.5, 15, 184, 113);
        drawImageCover(ctx, image2, 208.5, 131, 184, 113);
        drawImageCover(ctx, image3, 208.5, 275, 184, 113);
        drawImageCover(ctx, image4, 208.5, 390, 184, 113);
      }
    };
  }, [loading]);

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
