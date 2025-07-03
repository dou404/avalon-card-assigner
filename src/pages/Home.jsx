import React, { useEffect, useState } from "react";
import BG_IMAGE from "../assets/others/animated-bg.jpg";
import PORTRAIT_BG_IMAGE from "../assets/others/portrait-bg.jpg";
import LOGO_IMAGE from "../assets/others/game-logo.png";
import START_BUTTON_IMAGE from "../assets/others/start-button.svg";
import SHIELD_GIF from "../assets/gif/shield-animation.gif";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { socket, connectSocket } from "@/libs/socket";
import api from "@/libs/axios";

export default function HomePage() {
  const [currentWidth, setCurrentWidth] = useState(window.innerWidth);
  const [userName, setUserName] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [serverCheckCount, setServerCheckCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const checkServerHealth = () => {
      setServerCheckCount((prev) => prev + 1);
      api
        .get("/health")
        .then((res) => {
          if (res.data.status === 200) {
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (serverCheckCount < 4) {
            setTimeout(() => checkServerHealth(), 30000);
          }
        });
    };

    checkServerHealth();

    const localStorageUserName = localStorage.getItem("userName");
    if (localStorageUserName) handleRegisterName(localStorageUserName, "FALSE");

    const handleResize = () => {
      setCurrentWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRegisterName = (name, isNew) => {
    if (!name || name.trim().length === 0) {
      toast.info("Enter a name for your future tomb!");
      return;
    }

    const trimmedUserName = name.trim();

    connectSocket(trimmedUserName, isNew);

    socket?.on("connect", () => {
      socket.on("register-username", (response) => {
        if (!response.success) {
          toast.warn(response.message || "Username is already taken!");
        } else {
          localStorage.setItem("userName", trimmedUserName);
          navigate("/rooms");
        }
      });
    });
  };

  return (
    <div className="w-full h-screen flex flex-col font-macondo items-center justify-start gap-[10%]">
      <img
        src={currentWidth > 895 ? BG_IMAGE : PORTRAIT_BG_IMAGE}
        className={`absolute w-full h-full -z-50 object-cover ${
          isLoading ? "brightness-40" : "brightness-75"
        }`}
      />

      {isLoading ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-2xl text-white font-semibold">
          {serverCheckCount < 4 ? (
            <>
              <img src={SHIELD_GIF} />
              <p className="mt-2">Waiting for server...</p>
              {serverCheckCount > 1 && (
                <p className="text-sm px-4 text-center">
                  It might take about{" "}
                  <span className="text-sky-600">1-2 minutes</span> to bring all
                  the swords and spears.
                </p>
              )}
            </>
          ) : (
            <p className="text-center">
              The server is currently unavailable. <br /> Please try again
              later!
            </p>
          )}
        </div>
      ) : (
        <>
          <img
            data-aos="fade-down"
            data-aos-duration="1000"
            src={LOGO_IMAGE}
            alt="avalon"
            className="w-2/3 lg:w-[30%] mt-32"
          />

          <div className="w-1/2 sm:w-1/3 lg:w-1/5 flex flex-col items-stretch justify-center gap-4">
            <input
              type="text"
              placeholder="Your heroic name"
              value={userName}
              onChange={(e) => {
                if (e.target.value.length < 20) setUserName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRegisterName(userName, "TRUE");
              }}
              className="font-macondo border-2 rounded-md bg-white p-4 text-xl"
            />

            <button
              data-aos="fade-up"
              data-aos-duration="2000"
              onClick={() => handleRegisterName(userName, "TRUE")}
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
        </>
      )}
    </div>
  );
}
