import { io } from 'socket.io-client';
import { CHATBOT_BACKEND_URL } from './env';

let socket = null;

// Call this to connect as an active user (will be tracked as online)
export function connectSocketWithUser(token) {
    socket = io(CHATBOT_BACKEND_URL, {
        query: { token },
        autoConnect: true
    });
    return socket;
}

// Call this when you just want passive access (e.g., just to receive onlineUsers)
export function connectSocketReadOnly() {
    socket = io(CHATBOT_BACKEND_URL, {
        autoConnect: true
    });
    return socket;
}

export { socket };
