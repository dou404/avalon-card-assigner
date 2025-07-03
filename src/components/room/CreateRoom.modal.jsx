import { Modal, Select } from "antd";
import React, { useState } from "react";
import { socket } from "../../libs/socket";
import { toast } from "react-toastify";

const generateRoomName = () => {
  const adjectives = [
    "brave",
    "fuzzy",
    "silent",
    "wild",
    "fancy",
    "bright",
    "mighty",
    "quick",
    "chilly",
    "cosmic",
  ];
  const nouns = [
    "tiger",
    "panda",
    "eagle",
    "otter",
    "dragon",
    "comet",
    "storm",
    "moon",
    "leaf",
    "shadow",
  ];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 9000) + 1000;

  return `${adjective}-${noun}-${number}-${Math.floor(Date.now() / 1000)}`;
};

export default function CreateRoomModal({ open, setOpen, handleJoinRoom }) {
  const [roomName, setRoomName] = useState(generateRoomName());
  const [key, setKey] = useState("");
  const [maxPlayer, setMaxPlayer] = useState(5);

  const getPlayerOptions = () => {
    const options = [];
    for (let i = 5; i <= 12; i++) {
      options.push({ label: i.toString(), value: i });
    }
    return options;
  };

  const handleCreateNewRoom = () => {
    if (!roomName || roomName === "") {
      toast.dismiss();
      toast("Please enter a name for the room!", {
        type: "warning",
      });
      return;
    }
    if (!key || key === "") {
      toast.dismiss();
      toast("Please enter a key!", {
        type: "warning",
      });
      return;
    }
    socket.emit("create-room", { roomName, maxPlayer, key }, (response) => {
      if (response.success) {
        setOpen(false);
        handleJoinRoom(roomName, true);
      } else {
        toast.dismiss();
        toast(response.message, {
          type: "warning",
        });
        return;
      }
    });
  };

  return (
    <Modal
      open={open}
      onCancel={(e) => {
        e.stopPropagation();
        setOpen(false);
      }}
      footer={null}
      centered
      styles={{
        content: {
          backgroundColor: "black",
        },
      }}
    >
      <div className="font-macondo text-white space-y-4 text-xl">
        <p className="text-3xl font-semibold uppercase">Host a room</p>

        <div className="">
          <p>Room name:</p>
          <input
            type="text"
            value={roomName}
            onChange={(e) => {
              if (e.target.value.length < 50) setRoomName(e.target.value);
            }}
            className="w-full border border-white rounded-md p-2"
          />
        </div>

        <div className="">
          <p>Key:</p>
          <p className="text-sm italic font-light text-red-400">
            *This key must be granted to create new room!
          </p>
          <input
            type="password"
            value={key}
            onChange={(e) => {
              if (e.target.value.length < 21) setKey(e.target.value);
            }}
            className="w-full border border-white rounded-md p-2 my-1"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <p>Max player:</p>
          <Select
            options={getPlayerOptions()}
            defaultValue={maxPlayer}
            onChange={(value) => setMaxPlayer(value)}
            className="flex-1"
          />
        </div>

        <button
          onClick={handleCreateNewRoom}
          className="w-full py-2 mt-4 rounded-md bg-white text-black font-semibold cursor-pointer hover:brightness-75 duration-200"
        >
          CREATE
        </button>
      </div>
    </Modal>
  );
}
