<ProtectedChatBot>
    <div className="flex-[2] w-full flex flex-col">
        {!socket ? (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-400">Connecting to chat...</p>
            </div>
        ) : (
            <>
                {/* Header */}
                <div className="w-full h-[50px] flex items-center justify-between p-2 bg-gray-800 shrink-0 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg text-gray-300 font-medium flex gap-1">
                            Abdul Ghaffar –{" "}
                            {botReplyEnabled ? (
                                <p className="text-gray-400">Bot</p>
                            ) : (
                                <div className="flex gap-2 items-center">
                                    <p className="text-gray-400">Real</p>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                            )}
                        </h1>
                    </div>
                    <div className="flex h-full items-center gap-2">
                        <Link
                            href="/options"
                            className="text-gray-400 hover:text-gray-200 rounded-full p-1 transition"
                        >
                            <MoreVertIcon />
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-gray-400 hover:text-gray-200 w-[50px] rounded-full p-1 transition disabled:opacity-50"
                            disabled={logoutLoading}
                        >
                            {logoutLoading ? <Spinner /> : <LogoutIcon />}
                        </button>
                    </div>
                </div>

                {/* Chat window */}
                <div className="flex-1 overflow-y-auto bg-gray-900">
                    {loadingHistory ? (
                        <div className="w-full h-full flex justify-center items-center">
                            <Spinner />
                        </div>
                    ) : (
                        <ChatWindow
                            messages={messages}
                            endRef={endRef}
                            scrollRef={scrollRef}
                            setStopSendingMessage={setStopSendingMessage}
                        />
                    )}
                </div>

                {/* Input */}
                <div className="w-full bg-gray-900 pt-2 px-2">
                    <div className="w-full rounded-[30px] pl-5 h-fit max-w-screen p-2 bg-gray-700 shrink-0 relative">
                        <textarea
                            onKeyDown={handleKeyDown}
                            ref={textareaRef}
                            onChange={handleChange}
                            value={messageText}
                            placeholder="Type your message"
                            style={{ height: "24px", lineHeight: "24px" }}
                            className="w-[calc(100%-70px)] h-fit bg-transparent mt-1 outline-none text-color-light resize-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        ></textarea>
                        {!stopSendingMessage && (
                            <button
                                onClick={() =>
                                    sendMessage(
                                        messageText,
                                        socket,
                                        userId,
                                        setMessageText,
                                        textareaRef,
                                        stopSendingMessage
                                    )
                                }
                                disabled={!messageText.trim()}
                                className="w-[60px] text-color-light p-2 absolute right-2 bottom-2"
                            >
                                {messageText.length > 0 && (
                                    <SendIcon className="text-color-light" />
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="text-xs text-gray-400 bg-gray-900 text-center py-2">
                    This model is still learning and may occasionally provide
                    inaccurate or incomplete responses.
                </div>
            </>
        )}
    </div>
</ProtectedChatBot>
