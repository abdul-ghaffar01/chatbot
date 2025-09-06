const ENVIRONMENT = 'development';

const CHATBOT_BACKEND_URL = ENVIRONMENT === "DEV" ? "http://localhost:3009" : "https://chatbot.iabdulghaffar.com";

export { CHATBOT_BACKEND_URL, ENVIRONMENT };