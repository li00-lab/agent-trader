import { useState, useRef, useEffect } from "react";
import MessageInput from "./MessageInput";

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const handleSend = (text) => {
    const newMsg = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMsg]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: `Bot reply to: ${text}`,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }, 500);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-row ${msg.sender === "user" ? "user" : "bot"}`}
          >
            <div className="message-bubble">
              <div className="message-text">{msg.text}</div>
              <div className="message-time">{msg.timestamp}</div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  );
}

export default ChatWindow;
