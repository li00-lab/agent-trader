"use client";

import { useState } from "react";
import Footer from "./Footer";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import styles from "./ChatWindow.module.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(newMessages);

    // Add dummy bot reply
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: "hi" }]);
    }, 500);
  };

  return (
    <div className={styles.chatWindow}>
      {/* Chat area */}
      <div className={styles.chatArea}>
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
      </div>

      {/* Chat input */}
      <ChatInput onSend={handleSend} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
