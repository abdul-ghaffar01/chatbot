import React from "react";
import { motion } from "framer-motion";
import CheckIcon from "@mui/icons-material/Check";
import { Clock } from 'lucide-react';
const Message = ({ message, showDate, formattedDate }) => {
    const who = message.sender;

    // Format **bold** → <strong>
    const formatContent = (content) => {
        return content.split(/(\*\*.*?\*\*)/g).map((part, idx) =>
            part.startsWith("**") && part.endsWith("**") ? (
                <strong key={idx} className="font-semibold text-gray-100">
                    {part.slice(2, -2)}
                </strong>
            ) : (
                part
            )
        );
    };

    // Animation
    const variants = {
        fromLeft: { opacity: 0, x: -40 },
        fromRight: { opacity: 0, x: 40 },
        fromBottom: { opacity: 0, y: 40, x:20 },
        fadeIn: { opacity: 0, scale: 0.9 },
    };
    const animateTo = { opacity: 1, x: 0, y: 0, scale: 1 };

    // Info/system messages
    if (who === "info") {
        return (
            <motion.p
                initial={variants.fadeIn}
                animate={animateTo}
                transition={{ duration: 0.3 }}
                className="text-center text-gray-400 italic my-3 text-xs"
            >
                {message.content}
            </motion.p>
        );
    }

    const isUser = who === "user";
    const isBot =
        who.toLowerCase() === "abdul ghaffar" || who.toLowerCase() === "chatbot";

    const initialAnim = isUser
        ? variants.fromBottom
        : isBot
            ? variants.fromLeft
            : variants.fadeIn;

    return (
        <>
            {showDate && (
                <div className="text-center text-gray-500 text-xs my-4">
                    {formattedDate}
                </div>
            )}

            <motion.div
                initial={initialAnim}
                animate={animateTo}
                transition={{ duration: 0.35 }}
                className={`${isUser
                    ? "bg-gray-700 text-gray-100 self-end"
                    : "bg-gray-600 text-gray-50 self-start"
                    } w-fit min-w-[160px] max-w-[75%] px-3 py-2 rounded-2xl shadow-sm m-1`}
            >
                {/* Message content */}
                <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                    {formatContent(message.content)}
                </div>

                {/* Footer (name + time) */}
                <div className="text-[11px] flex items-center justify-between mt-2 opacity-80">
                    <p>{isUser ? "You" : who}</p>
                    <div className="flex items-center gap-1">
                        <p>
                            {new Date(message.sentAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                            })}
                        </p>
                        {isUser && (
                            <div className="flex items-center w-4">
                                {message.status === "pending" ? (
                                    // Gray / dim check for pending
                                    <Clock size={11} color="gray" />
                                ) : (
                                    // Bright check for delivered
                                    <CheckIcon
                                        className="text-blue-400"
                                        sx={{ fontSize: "14px" }}
                                        titleAccess="Delivered"
                                    />
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default Message;
