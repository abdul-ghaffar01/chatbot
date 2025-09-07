"use client";
import AllChats from "@/components/chatbot/admin/AllChat";
import ChatMessages from "@/components/chatbot/admin/ChatMessages";
import { isTokenValid } from "@/utils/checkAdminToken";
import { connectSocketWithUser } from "@/utils/socket";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Page = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [adminSocket, setAdminSocket] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const adminToken = localStorage.getItem("adminToken");
        setAdminSocket(connectSocketWithUser(adminToken));
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!isTokenValid(token)) {
            console.log("Token is invalid or expired. Redirecting...");
            localStorage.removeItem("adminToken");
            router.push("/adminlogin");
        } else {
            setLoggedIn(true);
        }
    }, [router]);

    if (!loggedIn) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-200">
                <div className="text-center space-y-2">
                    <p className="text-lg font-semibold">Checking authentication...</p>
                    <p className="text-sm text-gray-400">
                        Please wait while we verify your access.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full h-screen bg-gray-950 text-gray-100">
            {/* Sidebar (All Chats) */}
            <div className="w-1/4 border-r max-w-[350px] border-gray-800 bg-gray-900">
                <AllChats
                    adminSocket={adminSocket}
                    selectedUserId={selectedUserId}
                    onSelectChat={setSelectedUserId}
                />
            </div>

            {/* Chat Window */}
            <div className="flex-1 bg-gray-800 max-h-[100dvh]">
                <ChatMessages
                    adminSocket={adminSocket}
                    selectedUserId={selectedUserId}
                />
            </div>
        </div>
    );
};

export default Page;
