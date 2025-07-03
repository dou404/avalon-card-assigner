import { Route, Routes } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import HomePage from "./pages/Home";
import { useEffect } from "react";
import Rooms from "./pages/Rooms";
import { socket } from "./libs/socket";
import Lobby from "./pages/Lobby";
import { ToastContainer } from "react-toastify";

function App() {
  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: false,
    });
  }, []);

  useEffect(() => {
    socket?.on("connect", () => {
      localStorage.setItem("socketId", socket.id);
    });

    socket.on("disconnect", () => {
      localStorage.removeItem("socketId");
      localStorage.removeItem("userName");
    });

    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/room/:roomName" element={<Lobby />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        newestOnTop
        limit={2}
        theme="light"
      />
    </>
  );
}

export default App;
