"use client";
import { useEffect, useState } from "react";
import ChatSide from "@/components/chatbot/ChatSide";
import AccountSetup from "@/components/chatbot/AccountSetup";
import GuestMode from "@/components/chatbot/GuestMode";
import { connectSocketReadOnly } from "@/utils/socket";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import decodeJWT from "@/utils/chatbot/decodeJwt";

const Page = () => {
  const [mounted, setMounted] = useState(false); // ✅ Fix hydration mismatch
  const [uiState, setUiState] = useState("loading"); 
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const router = useRouter();

  // Prevent SSR hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle JWT from query param or localStorage
  useEffect(() => {
    if (!mounted) return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      const payload = decodeJWT(token);
      localStorage.setItem("jwt", token);
      localStorage.setItem("user", JSON.stringify(payload));
      window.history.replaceState({}, document.title, window.location.pathname);
      setUiState("sessionStarted");
      router.push("/");
      return;
    }

    const jwt = localStorage.getItem("jwt");
    if (jwt && decodeJWT(jwt)) {
      setUiState("sessionStarted");
    } else {
      setUiState("accountSetup");
    }
  }, [mounted, router]);

  // Connect to socket for online users
  useEffect(() => {
    if (!mounted) return;

    const socket = connectSocketReadOnly();
    if (socket) setLoadingUsers(false);

    socket.on("onlineUsers", (users) => {
      if (!Array.isArray(users)) return setOnlineUsers([]);
      setOnlineUsers(users);
    });

    return () => socket.off("onlineUsers");
  }, [mounted]);

  if (!mounted) return null; // ✅ Skip SSR rendering entirely

  return (
    <div className="w-screen h-[100dvh] flex overflow-hidden">
      {/* Main content by state */}
      {uiState === "loading" && <Loader />}
      {uiState === "sessionStarted" && (
        <ChatSide setUiState={setUiState} />
      )}
      {uiState === "accountSetup" && (
        <AccountSetup setUiState={setUiState} />
      )}
      {uiState === "guestMode" && (
        <GuestMode setUiState={setUiState} />
      )}

      {/* Sidebar with online users */}
      <div className="hidden md:block md:flex-[1] max-w-[400px] border-l border-gray-500 bg-gray-900 flex flex-col overflow-y-auto">
        <div className="w-full h-fit overflow-y-auto p-2">
          <h1 className="text-xl text-gray-400 mb-1 font-medium">
            Online users
          </h1>
          {loadingUsers && <p>Loading online users...</p>}
          {!loadingUsers && onlineUsers.length === 0 && (
            <p className="text-gray-400">Nobody is online</p>
          )}
          {onlineUsers.map((user, index) => (
            <div
              key={user.id || user._id || index}
              className="flex items-center bg-gray-500 hover:bg-gray-600 rounded-md p-3 mb-2"
            >
              <h2 className="text-lg">{user.fullName}</h2>
              <span className="w-3 h-3 rounded-full ml-2 bg-green-500"></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
