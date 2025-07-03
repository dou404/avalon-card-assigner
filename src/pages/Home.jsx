import React, { useEffect, useState } from "react";
import BG_IMAGE from "../assets/others/animated-bg.jpg";
import PORTRAIT_BG_IMAGE from "../assets/others/portrait-bg.jpg";
import LOGO_IMAGE from "../assets/others/game-logo.png";
import START_BUTTON_IMAGE from "../assets/others/start-button.svg";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function HomePage() {
  const [currentWidth, setCurrentWidth] = useState(window.innerWidth);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setCurrentWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`w-full h-screen flex flex-col items-center justify-start gap-[10%]`}
    >
      <img
        src={currentWidth > 895 ? BG_IMAGE : PORTRAIT_BG_IMAGE}
        className="absolute w-full h-full z-[-999]"
      />

      <img
        data-aos="fade-down"
        data-aos-duration="1000"
        src={LOGO_IMAGE}
        alt="avalon"
        className="w-2/3 lg:w-[30%] mt-32"
      />

      <button
        data-aos="fade-up"
        data-aos-duration="2000"
        onClick={() => navigate("/rooms")}
        className="flex items-center justify-center gap-4 px-6 py-3 bg-gradient-to-br from-amber-800 to-yellow-700 text-white font-serif text-lg border-4 border-yellow-300 rounded-lg shadow-inner shadow-black hover:brightness-110 hover:scale-105 transition duration-200 tracking-wide cursor-pointer"
      >
        <img
          src={START_BUTTON_IMAGE}
          alt="start"
          className="w-8 sm:w-12 aspect-square group-hover:scale-110 duration-300"
        />
        <p className="text-2xl sm:text-[2.5rem] text-white font-macondo group-hover:text-slate-300">
          START
        </p>
      </button>
    </div>
  );
}
