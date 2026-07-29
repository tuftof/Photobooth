import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Audio } from "ts-audio";
import { toPng } from "html-to-image";
import { useReactToPrint } from "react-to-print";
import { MdCamera, MdPrint, MdDownload, MdRefresh, MdCheckCircle } from "react-icons/md";
import templateOverlayImg from "../images/gen ass photobooth template no bg.png";
import countdownSound from "../audio/countdown.mp3";
import captureSound from "../audio/captureSound.mp3";

// Coordinates for the 4 slots positioned UNDERNEATH the transparent cutouts of gen ass photobooth template no bg.png
// Slots are enlarged (width: 29.2%, height: 18.2%) to bleed 15-20px under the white polaroid frames for 100% gapless masking in both preview, PNG, and print mode.
const SLOT_STYLES = [
  { top: "18.8%", left: "6.8%", width: "29.2%", height: "18.2%", rotate: "-3.9deg" },
  { top: "35.8%", left: "8.6%", width: "29.2%", height: "18.2%", rotate: "-3.9deg" },
  { top: "18.8%", left: "57.1%", width: "29.2%", height: "18.2%", rotate: "-3.9deg" },
  { top: "35.8%", left: "58.9%", width: "29.2%", height: "18.2%", rotate: "-3.9deg" },
];

export default function PhotoboothApp() {
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null]);
  const [activeSlot, setActiveSlot] = useState<number | null>(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // All 4 photos completed check
  const isAllComplete = photos.every((p) => p !== null);

  // Helper to find the next available empty slot index
  const getNextEmptySlot = (currentPhotos: (string | null)[], currentIdx: number): number | null => {
    for (let i = 0; i < 4; i++) {
      const idx = (currentIdx + i) % 4;
      if (currentPhotos[idx] === null) return idx;
    }
    return null;
  };

  // Sound triggers
  const playSound = (soundFile: string) => {
    try {
      const sound = Audio({ file: soundFile, volume: 0.6 });
      sound.play();
    } catch (err) {
      console.warn("Audio playback error:", err);
    }
  };

  // Single shot capture procedure
  const handleStartCapture = () => {
    if (activeSlot === null || isCapturing) return;

    setIsCapturing(true);
    let seconds = 5;
    setRemaining(seconds);
    playSound(countdownSound);

    const interval = setInterval(() => {
      seconds--;
      if (seconds > 0) {
        setRemaining(seconds);
        playSound(countdownSound);
      } else {
        clearInterval(interval);
        setRemaining(null);
        takePhoto();
      }
    }, 1000);
  };

  // Grab webcam frame
  const takePhoto = useCallback(() => {
    playSound(captureSound);
    const imageSrc = webcamRef.current?.getScreenshot();

    if (imageSrc && activeSlot !== null) {
      setPhotos((prev) => {
        const updated = [...prev];
        updated[activeSlot] = imageSrc;

        // Find next empty slot
        const nextSlot = getNextEmptySlot(updated, (activeSlot + 1) % 4);
        setActiveSlot(nextSlot);
        return updated;
      });
    }

    setIsCapturing(false);
  }, [activeSlot]);

  // Click on a photo slot to retake that specific shot
  const handleSlotClick = (index: number) => {
    if (isCapturing) return;

    // Clear photo at index & set as active slot for camera
    setPhotos((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
    setActiveSlot(index);
  };

  // Reset all 4 photos
  const handleResetAll = () => {
    if (isCapturing) return;
    setPhotos([null, null, null, null]);
    setActiveSlot(0);
  };

  // Download printable PNG using html-to-image
  const downloadImage = useCallback(() => {
    if (!contentRef.current) return;
    toPng(contentRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "photobooth-strip.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error("Error generating image:", err));
  }, []);

  // Print using react-to-print
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    pageStyle: `
      @page {
        size: 4in 6in portrait;
        margin: 0;
      }
      @media print {
        html, body {
          width: 4in !important;
          height: 6in !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          background: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .print-page {
          width: 4in !important;
          height: 6in !important;
          max-width: 4in !important;
          max-height: 6in !important;
          aspect-ratio: 4 / 6 !important;
          margin: 0 !important;
          padding: 0 !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          transform: none !important;
        }
        .print-page * {
          box-shadow: none !important;
          outline: none !important;
        }
      }
    `,
  });

  return (
    <div className="min-h-screen h-screen bg-slate-950 text-white flex flex-col md:flex-row items-center justify-center p-4 md:p-8 gap-6 md:gap-12 font-sans select-none overflow-hidden">
      
      {/* LEFT COLUMN: Template Strip */}
      <div className="flex-1 h-full max-h-[90vh] flex items-center justify-center w-full min-w-0">
        <div
          ref={contentRef}
          className="relative h-full max-h-[85vh] aspect-[1333/2000] bg-slate-900 shadow-2xl rounded-sm overflow-hidden transition-all duration-300 print-page flex-shrink-0"
        >
          {/* Layer 1: Photo Slots (Underneath Template at Z-10) */}
          {SLOT_STYLES.map((slotStyle, index) => {
            const hasPhoto = photos[index] !== null;
            const isActive = activeSlot === index;

            return (
              <div
                key={index}
                onClick={() => hasPhoto && handleSlotClick(index)}
                style={{
                  position: "absolute",
                  top: slotStyle.top,
                  left: slotStyle.left,
                  width: slotStyle.width,
                  height: slotStyle.height,
                  transform: `rotate(${slotStyle.rotate})`,
                  transformOrigin: "center center",
                }}
                className={`group overflow-hidden rounded-[2px] transition-all duration-200 z-10 ${
                  isActive
                    ? "ring-2 ring-yellow-400 shadow-xl"
                    : hasPhoto
                    ? "cursor-pointer hover:ring-2 hover:ring-white/90"
                    : "bg-slate-800/40 border border-white/20"
                }`}
                title={hasPhoto ? `Click to retake Shot ${index + 1}` : `Shot ${index + 1}`}
              >
                {/* Live Webcam in Active Slot */}
                {isActive && !hasPhoto && (
                  <div className="w-full h-full relative flex items-center justify-center bg-black">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      screenshotQuality={0.95}
                      mirrored={true}
                      videoConstraints={{ facingMode: "user" }}
                      className="w-full h-full object-cover"
                    />
                    {/* Countdown Overlay */}
                    {isCapturing && remaining !== null && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] animate-pulse z-40">
                        <span className="text-4xl sm:text-6xl font-black text-yellow-300 drop-shadow-lg">
                          {remaining}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Captured Photo */}
                {hasPhoto && (
                  <div className="w-full h-full relative">
                    <img
                      src={photos[index]!}
                      alt={`Shot ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Hover Retake Badge */}
                    {!isCapturing && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200 text-white z-40">
                        <MdRefresh className="text-3xl text-yellow-300 animate-spin-once" />
                        <span className="text-xs font-bold mt-1 tracking-wide">Click to Retake</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Empty inactive slot placeholder */}
                {!isActive && !hasPhoto && (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/40 bg-slate-900/60">
                    <span className="text-xs font-bold">Slot {index + 1}</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Layer 2: Template Cutout Overlay (On Top) */}
          <img
            src={templateOverlayImg}
            alt="Photobooth Template"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-20"
          />
        </div>
      </div>

      {/* RIGHT COLUMN: Control Panel & Status */}
      <div className="w-full md:w-[380px] lg:w-[440px] h-full max-h-[88vh] flex flex-col justify-between bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div>
          <div className="inline-block px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 rounded-full text-yellow-300 text-xs font-bold tracking-wider mb-3">
            GENERAL ASSEMBLY 2026-2027
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
            PHOTOBOOTH
          </h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            {isAllComplete
              ? "All 4 shots complete! You can click any photo frame on the left to retake it, or print/download your completed strip below."
              : "Your camera is live inside the highlighted slot on the template. Click 'Take Photo' when you're ready!"}
          </p>
        </div>

        {/* Live Status & Progress */}
        <div className="my-6 space-y-4">
          {/* Slot Progress Bar */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1">
            <span>Progress</span>
            <span className="text-yellow-300 font-bold">
              {photos.filter((p) => p !== null).length} / 4 Shots
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = photos[idx] !== null;
              const isCurrent = activeSlot === idx;

              return (
                <div
                  key={idx}
                  onClick={() => isFilled && handleSlotClick(idx)}
                  className={`h-12 rounded-xl border flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    isCurrent
                      ? "border-yellow-400 bg-yellow-400/20 text-yellow-300 ring-2 ring-yellow-400/50"
                      : isFilled
                      ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300 cursor-pointer hover:bg-emerald-500/30"
                      : "border-slate-800 bg-slate-800/40 text-slate-500"
                  }`}
                >
                  {isFilled ? (
                    <MdCheckCircle className="text-lg text-emerald-400" />
                  ) : (
                    <span>Shot {idx + 1}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Countdown Display Card */}
          {isCapturing && remaining !== null && (
            <div className="p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-2xl flex items-center justify-between animate-pulse">
              <span className="text-sm font-bold text-yellow-300">
                Get Ready! Capturing Shot {(activeSlot ?? 0) + 1}...
              </span>
              <span className="text-2xl font-black text-yellow-300">
                {remaining}s
              </span>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="space-y-3">
          {!isAllComplete ? (
            <>
              <button
                disabled={isCapturing || activeSlot === null}
                onClick={handleStartCapture}
                className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl transition-all duration-200 ${
                  isCapturing || activeSlot === null
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                    : "bg-yellow-400 text-slate-950 hover:bg-yellow-300 active:scale-[0.98] shadow-yellow-400/20"
                }`}
              >
                <MdCamera className="text-2xl" />
                {isCapturing
                  ? `Capturing Shot ${(activeSlot ?? 0) + 1}...`
                  : `Take Shot ${(activeSlot ?? 0) + 1}`}
              </button>

              {photos.some((p) => p !== null) && (
                <button
                  disabled={isCapturing}
                  onClick={handleResetAll}
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center gap-2 border border-slate-700/50 transition-all"
                >
                  <MdRefresh className="text-lg" /> Reset All Shots
                </button>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handlePrint}
                className="w-full py-4 rounded-2xl font-black text-lg bg-yellow-400 hover:bg-yellow-300 text-slate-950 flex items-center justify-center gap-3 shadow-xl shadow-yellow-400/20 active:scale-[0.98] transition-all"
              >
                <MdPrint className="text-2xl" /> Print Photo Strip
              </button>

              <button
                onClick={downloadImage}
                className="w-full py-4 rounded-2xl font-black text-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 flex items-center justify-center gap-3 shadow-xl shadow-emerald-400/20 active:scale-[0.98] transition-all"
              >
                <MdDownload className="text-2xl" /> Download PNG
              </button>

              <button
                onClick={handleResetAll}
                className="w-full py-3 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center gap-2 border border-slate-700/50 transition-all"
              >
                <MdRefresh className="text-lg" /> Start Over
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
