"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow, { ChatMessage } from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "m1", role: "assistant", content: "Hello! Ask me anything ✨" },
  ]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Demo assistant reply (replace with your API call)
    setTimeout(() => {
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Got it! (This is a mock reply.) Hook me to your /api/chat to get real responses.",
      };
      setMessages((prev) => [...prev, reply]);
    }, 500);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "New chat started. How can I help?",
      },
    ]);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "280px minmax(0, 1fr)",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Sidebar onNewChat={handleNewChat} />
      <div
        style={{
          display: "grid",
          gridTemplateRows: "1fr auto",
          background: "var(--bg)",
          minWidth: 0, // critical so chat can shrink nicely
        }}
      >
        <ChatWindow messages={messages} />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
