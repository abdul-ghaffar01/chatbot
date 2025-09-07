"use client";
import React, { useEffect, useRef, useState } from "react";

const ChatMessages = ({ selectedUserId, adminSocket }) => {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(false);
    const [botReplies, setBotReplies] = useState(true);
    const scrollRef = useRef(null);
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (!adminSocket) return;

        if (selectedUserId) {
            adminSocket.emit("chatHistoryForAdmin", selectedUserId);
        }

        const handleChatHistory = (history) => {
            setMessages(history);
        };

        const handleNewMessage = (message) => {
            if (
                String(message.userId) === String(selectedUserId) ||
                String(message.to) === String(selectedUserId)
            ) {
                setMessages((prev) => [...prev, message]);
            }
        };


        adminSocket.on("chatHistoryForAdmin", handleChatHistory);
        adminSocket.on("adminReceiveMessage", handleNewMessage);

        return () => {
            adminSocket.off("chatHistoryForAdmin", handleChatHistory);
            adminSocket.off("adminReceiveMessage", handleNewMessage);
        };
    }, [adminSocket, selectedUserId]);

    const handleSendMessage = () => {
        if (!messageText.trim()) return;
        adminSocket.emit("adminSendMessage", {
            targetUserId: selectedUserId,
            content: messageText,
        });
        setMessageText("");
    };

    if (!selectedUserId) {
        return (
            <div className="flex-1 flex items-center h-full justify-center text-gray-400 bg-gray-900">
                Select a chat to view messages
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-900 text-gray-100 h-[100dvh]">
            {/* Toggle bot replies */}
            <div className="p-2 border-b border-gray-700 flex justify-end">
                <button
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-sm rounded transition"
                    onClick={() => {
                        adminSocket.emit("toggleBotReply", {
                            targetUserId: selectedUserId,
                            enabled: !botReplies,
                        });
                        setBotReplies((prev) => !prev);
                    }}
                >
                    {botReplies ? "Stop bot replies" : "Continue bot replies"}
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto " ref={scrollRef}>
                {loading ? (
                    <p className="text-gray-400 italic">Loading messages...</p>
                ) : (
                    <>
                        {messages.map((msg, index) =>
                            msg.sender === "info" ? (
                                <p
                                    key={index}
                                    className="text-center text-gray-500 my-3 text-xs"
                                >
                                    {msg.content}
                                </p>
                            ) : (
                                <div
                                    key={index}
                                    className={`p-3 w-fit min-w-[250px] my-2 rounded-lg max-w-[70%] text-sm shadow-sm ${msg.sender !== "user"
                                        ? "bg-gray-700 text-white ml-auto"
                                        : "bg-gray-800 text-gray-200"
                                        }`}
                                >
                                    <p>{msg.content}</p>
                                    <span className="text-[10px] text-gray-400 block mt-1">
                                        {new Date(msg.sentAt).toLocaleTimeString()}
                                    </span>
                                </div>
                            )
                        )}
                        <div ref={endOfMessagesRef} />
                    </>
                )}
            </div>

            {/* Input area */}
            <div className="p-3 border-t border-gray-700 flex bg-gray-800">
                <input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 rounded bg-gray-900 border border-gray-700 text-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatMessages;
