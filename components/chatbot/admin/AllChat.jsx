"use client";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const AllChats = ({ onSelectChat, adminSocket, selectedUserId }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminSocket) return;

    const fetchChats = () => {
      console.log("✅ Admin socket connected, fetching chats...");
      adminSocket.emit("getAllChats");
    };

    if (adminSocket.connected) {
      fetchChats();
    } else {
      console.warn("⏳ Waiting for admin socket to connect...");
      adminSocket.once("connect", fetchChats);
    }

    const handleAllChats = (data) => {
      if (Array.isArray(data)) {
        setChats(data);
      } else {
        setChats([]);
      }
      setLoading(false);
    };

    adminSocket.on("allChats", handleAllChats);

    return () => {
      adminSocket.off("allChats", handleAllChats);
      adminSocket.off("connect", fetchChats);
    };
  }, [adminSocket]);

  const handleSelectChat = (userId) => {
    if (typeof onSelectChat === "function") {
      onSelectChat(userId);
    }
  };

  if (loading)
    return (
      <p className="p-4 text-gray-400 italic">Loading chats...</p>
    );

  return (
    <div className="w-full border-r border-gray-700 bg-gray-900 text-gray-100 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold p-4 border-b border-gray-700">
        All Chats
      </h2>

      {chats.length === 0 ? (
        <p className="p-4 text-gray-400">No chats available</p>
      ) : (
        <div className="divide-y divide-gray-800">
          {chats.map((chat) => (
            <div
              key={chat.userId || chat._id}
              onClick={() => handleSelectChat(chat.userId)}
              className={`p-4 transition-colors duration-200 cursor-pointer rounded-lg
                ${
                  chat.userId === selectedUserId
                    ? "bg-gray-700 text-white shadow-md"
                    : "hover:bg-gray-800"
                }`}
            >
              <p className="font-semibold text-sm md:text-base">
                {chat.fullName || "Unknown User"}
              </p>
              <p
                className={`text-xs md:text-sm truncate mt-1 ${
                  chat.userId === selectedUserId
                    ? "text-gray-300"
                    : "text-gray-500"
                }`}
              >
                {chat.lastMessage || "No messages yet"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

AllChats.propTypes = {
  onSelectChat: PropTypes.func.isRequired,
  adminSocket: PropTypes.object,
  selectedUserId: PropTypes.string,
};

export default AllChats;
