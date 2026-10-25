import { useLocation, useNavigate } from "react-router-dom";
import cpeyestaday1 from "../images/cpeyestaday1.png";
import cpeyestaday2 from "../images/cpeyestaday2.png";
import aces from "../images/aces.png";
function TemplateOptions() {
  const location = useLocation();
  const images = location.state;
  const navigate = useNavigate();
  const selectTemplate = (option: number) => {
    navigate("/download", { state: { images: images, option: option } });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 justify-center items-center gap-2">
      <span className="text-yellow-400 text-xl italic ml-5 mb-5 ">
        Choose a desired template.
      </span>
      <div className="flex flex-row gap-5">
        <div
          onClick={() => selectTemplate(0)}
          className="flex animate-pulse space-x-4 hover:scale-105 ease-in duration-200"
        >
          <img
            src={cpeyestaday1}
            style={{ width: 350, height: 500 }}
            className=" object-fit "
          />
        </div>
        <div
          onClick={() => selectTemplate(1)}
          className="flex animate-pulse space-x-4 hover:scale-105 ease-in duration-200"
        >
          <img
            src={cpeyestaday2}
            style={{ width: 350, height: 500 }}
            className=" object-fit "
          />
        </div>
        <div
          onClick={() => selectTemplate(2)}
          className="flex animate-pulse space-x-4 hover:scale-105 ease-in duration-200"
        >
          <img
            src={aces}
            style={{ width: 350, height: 500 }}
            className=" object-fit "
          />
        </div>
      </div>
    </div>
  );
}

export default TemplateOptions;
