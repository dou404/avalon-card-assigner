import React, { useEffect, useState } from "react";
import MEDIEVAL_BG from "../assets/others/medieval-bg.png";
import RoleSet from "../components/role-set/RoleSet";
import CreateRoomModal from "../components/room/CreateRoom.modal";
import { socket } from "../libs/socket";
import { useNavigate } from "react-router-dom";

export default function Rooms() {
  const navigate = useNavigate();
  const [isRoleSetsModalOpen, setIsRoleSetsModalOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [roomList, setRoomList] = useState([]);
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    if (!userName) {
      return navigate("/");
    }

    socket.emit("get-room-list", (response) => {
      setRoomList(response.roomList);
    });

    socket.on("room-update", (roomList) => {
      setRoomList(roomList);
    });
  }, []);

  return (
    <div
      className={`w-full h-screen font-macondo flex items-center justify-center`}
    >
      <img
        src={MEDIEVAL_BG}
        alt="bg"
        className={`absolute w-full h-full -z-50 object-cover`}
      />

      <div className="grow lg:max-w-1/2 px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-white px-4 sm:px-8 py-8 mx-auto">
          <p className="flex items-center gap-2 text-3xl sm:text-[3em] font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="currentColor"
            >
              <path d="M20 22H18V20C18 18.3431 16.6569 17 15 17H9C7.34315 17 6 18.3431 6 20V22H4V20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13ZM12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"></path>
            </svg>
            {userName}
          </p>

          <div className="w-full md:w-fit md:ml-auto flex flex-col md:flex-row items-stretch md:items-center justify-center gap-2">
            <button
              onClick={() => setIsRoleSetsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-2 sm:px-4 py-2 bg-sky-600 font-semibold rounded-md hover:brightness-75 duration-200 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z"></path>
              </svg>
              Sets of Role
            </button>
            <RoleSet
              open={isRoleSetsModalOpen}
              setOpen={setIsRoleSetsModalOpen}
            />

            <button
              onClick={() => setIsCreateRoomModalOpen(true)}
              className="flex items-center justify-center gap-2 px-2 sm:px-4 py-2 bg-green-600 font-semibold rounded-md hover:brightness-75 duration-200 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
              </svg>
              Host a room
            </button>
            {isCreateRoomModalOpen && (
              <CreateRoomModal
                open={isCreateRoomModalOpen}
                setOpen={setIsCreateRoomModalOpen}
              />
            )}
          </div>
        </div>

        <div className="w-full min-h-64 max-h-80 overflow-y-auto bg-white/30 rounded-md border-2 border-white flex flex-col gap-2 items-stretch justify-start">
          {roomList && roomList.length > 0 ? (
            roomList.map((room, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-stretch md:items-center gap-4 p-4 bg-white border border-gray-500 rounded-md ${
                  room.isInProgress && "opacity-30"
                }`}
              >
                <div className="flex flex-col">
                  <p className="flex items-start md:items-center gap-2 text-lg font-semibold uppercase">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="currentColor"
                    >
                      <path d="M1.51587 7.87678C1.67997 9.82977 3.0892 11.452 5.00006 11.8875V19.0013H3.00006V21.0013H21.0001V19.0013H19.0001V11.8875C20.9109 11.452 22.3202 9.82977 22.4842 7.87678C21.9938 7.95878 21.4973 8 21.0001 8C17.186 8 13.7861 5.59592 12.5148 2H11.4853C10.214 5.59592 6.81411 8 3.00006 8C2.50278 8 2.00635 7.95878 1.51587 7.87678ZM17.0001 19.0013H7.00006V12H17.0001V19.0013ZM18.5556 9.93749L18.2813 10H5.71878L5.44452 9.93749C5.30845 9.90648 5.17809 9.86594 5.05345 9.81587C6.59012 9.53219 8.02261 8.92072 9.35093 7.98146C10.4075 7.23431 11.2906 6.35588 12.0001 5.34615C12.7096 6.35588 13.5926 7.23431 14.6492 7.98146C15.9775 8.92072 17.41 9.53219 18.9467 9.81587C18.8221 9.86594 18.6917 9.90648 18.5556 9.93749Z"></path>
                    </svg>{" "}
                    {room.roomName}
                  </p>

                  <span
                    className={`flex items-center gap-1 md:ml-8 ${
                      room.players.length === room.maxPlayer && "text-red-600"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="currentColor"
                    >
                      <path d="M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H16C16 18.6863 13.3137 16 10 16C6.68629 16 4 18.6863 4 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM10 11C12.21 11 14 9.21 14 7C14 4.79 12.21 3 10 3C7.79 3 6 4.79 6 7C6 9.21 7.79 11 10 11ZM18.2837 14.7028C21.0644 15.9561 23 18.752 23 22H21C21 19.564 19.5483 17.4671 17.4628 16.5271L18.2837 14.7028ZM17.5962 3.41321C19.5944 4.23703 21 6.20361 21 8.5C21 11.3702 18.8042 13.7252 16 13.9776V11.9646C17.6967 11.7222 19 10.264 19 8.5C19 7.11935 18.2016 5.92603 17.041 5.35635L17.5962 3.41321Z"></path>
                    </svg>
                    <p>
                      {room.players.length} / {room.maxPlayer}
                    </p>
                  </span>
                </div>

                <div className="w-full md:w-fit ml-auto">
                  <button
                    disabled={
                      room.players.length === room.maxPlayer ||
                      room.isInProgress
                    }
                    onClick={() => {
                      navigate(`/room/${room.roomName}`);
                    }}
                    className="w-full bg-green-600 px-8 py-2 rounded-md text-white font-semibold cursor-pointer hover:bg-green-800 duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                  >
                    JOIN
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="m-auto text-2xl font-light text-white">
              There is no available room!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
