import React, { useEffect, useState } from "react";
import MEDIEVAL_BG from "../assets/others/medieval-bg.png";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../libs/socket";
import CardImages from "../constants/card-images";
import { toast } from "react-toastify";
import { Popconfirm } from "antd";

export default function Lobby() {
  const { roomName } = useParams();
  const navigate = useNavigate();

  const [currentRoom, setCurrentRoom] = useState();
  const [assignedRole, setAssignedRole] = useState();

  useEffect(() => {
    if (!roomName || !localStorage.getItem("socketId")) {
      return navigate("/");
    }

    socket.emit("join-room", { roomName }, (response) => {
      if (response.success) {
        setCurrentRoom(response.room);
      } else {
        toast.dismiss();
        toast.warn(response.message);
        navigate("/rooms");
      }
    });

    socket.on("room-update", (roomList) => {
      const foundRoom = roomList.find((room) => room.roomName === roomName);

      if (!foundRoom) return;

      setCurrentRoom((prev) => ({
        ...prev,
        players: foundRoom.players,
      }));
    });

    socket.on("room-dismiss", () => {
      toast.dismiss();
      toast.info("Room no longer exists!");
      navigate("/rooms");
    });

    socket.on("role-assigned", ({ role }) => {
      setAssignedRole(role);
    });

    socket.on("game-finished", ({ room }) => {
      setAssignedRole(undefined);
      setCurrentRoom(room);
      toast.info("Game has finished!");
    });
  }, []);

  const handleStartGame = () => {
    toast.dismiss();

    socket.emit("start-game", { roomName }, (response) => {
      if (!response.success) {
        toast.dismiss();
        toast.error(response.message, { type: "error" });
      }
    });
  };

  const handleEndGame = () => {
    socket.emit("end-game", { roomName });
    setAssignedRole(undefined);
    setCurrentRoom((prev) => ({
      ...prev,
      isInProgress: false,
    }));
  };

  if (!currentRoom) return;

  return (
    <div
      className={`w-full h-screen font-macondo flex flex-col items-center justify-center text-white`}
    >
      <img
        src={MEDIEVAL_BG}
        alt="bg"
        className={`absolute w-full h-full -z-50 object-cover`}
      />

      <div className="w-full lg:max-w-2/3 xl:max-w-1/2 min-h-64 bg-white/30 rounded-md border-2 border-white flex flex-col gap-1 items-stretch justify-center p-4">
        {!currentRoom.isInProgress && !assignedRole ? (
          <div className="w-full h-full flex flex-col justify-between gap-4">
            <div className="flex-1 space-y-2">
              <span className="flex items-center gap-2 font-semibold text-xl uppercase">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M12.5812 2.68627C12.2335 2.43791 11.7664 2.43791 11.4187 2.68627L1.9187 9.47198L3.08118 11.0994L11.9999 4.7289L20.9187 11.0994L22.0812 9.47198L12.5812 2.68627ZM19.5812 12.6863L12.5812 7.68627C12.2335 7.43791 11.7664 7.43791 11.4187 7.68627L4.4187 12.6863C4.15591 12.874 3.99994 13.177 3.99994 13.5V20C3.99994 20.5523 4.44765 21 4.99994 21H18.9999C19.5522 21 19.9999 20.5523 19.9999 20V13.5C19.9999 13.177 19.844 12.874 19.5812 12.6863ZM5.99994 19V14.0146L11.9999 9.7289L17.9999 14.0146V19H5.99994Z"></path>
                </svg>
                {roomName}
              </span>

              <div
                className={`min-h-40 max-h-64 overflow-y-auto p-2 border border-gray-300 rounded-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${
                  currentRoom.players.length < 3 && "grid-rows-3"
                } md:grid-rows-3 gap-2`}
              >
                {currentRoom.players &&
                  currentRoom.players.map((player, index) => {
                    const isYou = player.id === socket.id;
                    return (
                      <div
                        key={index}
                        className={`${
                          isYou
                            ? "bg-green-600 text-white font-semibold"
                            : "bg-white text-black"
                        } p-2 rounded-md relative group`}
                      >
                        <span className="flex items-center gap-2 text-sm">
                          {currentRoom.hostId === player.id && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                              fill="currentColor"
                            >
                              <path d="M2.00488 19H22.0049V21H2.00488V19ZM2.00488 5L7.00488 8.5L12.0049 2L17.0049 8.5L22.0049 5V17H2.00488V5ZM4.00488 8.84131V15H20.0049V8.84131L16.5854 11.2349L12.0049 5.28024L7.42435 11.2349L4.00488 8.84131Z"></path>
                            </svg>
                          )}{" "}
                          <p>
                            {player.userName || player.id} {isYou && "(You)"}
                          </p>
                        </span>

                        {currentRoom.isHost && player.id !== socket.id && (
                          <Popconfirm
                            title="Kick this player"
                            description={
                              "Are you sure to kick this player from the room?"
                            }
                            onConfirm={() => {
                              socket.emit("leave-room", {
                                roomName,
                                player: player.id,
                              });
                            }}
                            okText="Yes"
                            cancelText="No"
                          >
                            <button className="hidden group-hover:inline absolute top-1/2 right-2 -translate-y-1/2 p-1 rounded-full text-red-600 hover:bg-gray-300 duration-200 cursor-pointer">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                fill="currentColor"
                              >
                                <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
                              </svg>
                            </button>
                          </Popconfirm>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center text-center gap-4 my-auto text-lg md:text-2xl font-semibold">
              <button
                onClick={handleStartGame}
                disabled={!currentRoom.isHost}
                className="md:flex-1 bg-sky-600 px-8 py-2 rounded-md hover:brightness-75 duration-200 cursor-pointer disabled:cursor-default disabled:bg-white disabled:text-gray-600 disabled:hover:brightness-100"
              >
                {currentRoom.isHost
                  ? "START"
                  : "Waiting for the host to start..."}
              </button>
              <Popconfirm
                title="Leave room"
                description={
                  "Are you sure to leave the room?" + currentRoom.isHost &&
                  " This room will no longer exist!"
                }
                onConfirm={() => {
                  socket.emit("leave-room", { roomName, player: socket.id });
                  navigate("/rooms");
                }}
                okText="Leave"
                cancelText="No"
              >
                <button className="flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-2 rounded-md hover:brightness-75 duration-200 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                  >
                    <path d="M4 18H6V20H18V4H6V6H4V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V18ZM6 11H13V13H6V16L1 12L6 8V11Z"></path>
                  </svg>
                  Leave
                </button>
              </Popconfirm>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-stretch justify-start gap-2">
            <img
              src={CardImages[assignedRole.card.roleName]}
              alt=""
              className="w-[15em] aspect-[2/3] mx-auto rounded-xl"
            />
            <p className="text-center text-[2em] font-semibold uppercase">
              {assignedRole.card.roleName}
            </p>

            <p className="font-light text-center">
              {assignedRole.card.description}
            </p>
          </div>
        )}
      </div>
      {currentRoom.isHost && assignedRole && (
        <div className="mt-8 w-full lg:max-w-[50vw]">
          <Popconfirm
            title="Finish game"
            description="Are you sure to end the game right now?"
            onConfirm={handleEndGame}
            okText="End the game"
            cancelText="No"
          >
            <button className="border rounded-md w-full py-2 cursor-pointer hover:bg-white hover:text-black duration-200">
              FINISH GAME
            </button>
          </Popconfirm>
        </div>
      )}
    </div>
  );
}
