import useChatStore from "@/store/chatStore";

const sendMessage = (
    messageText,
    socketInstance,
    userId,
    setMessageText,
    textareaRef,
    stopSendingMessage
) => {
    if (stopSendingMessage) return;
    if (!messageText.trim() || !socketInstance) return;
    
    const newMessage = {
        tempId: Date.now() + "-" + Math.random(),
        userId,
        to: "6884c115c3fd2ec85813625a",
        content: messageText,
        sender: "user",
        sentAt: new Date().toISOString(),
        status: "pending",
    };


    // add to local state immediately
    const { addMessage } = useChatStore.getState();
    addMessage(newMessage);

    // send to server
    socketInstance.emit("sendMessage", newMessage);

    // reset input
    setMessageText("");
    if (textareaRef?.current) {
        textareaRef.current.style.height = "24px";
        textareaRef.current.focus();
    }
};

export default sendMessage;
