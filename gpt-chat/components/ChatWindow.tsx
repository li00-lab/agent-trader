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

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    // Add placeholder assistant message
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("http://localhost:8000/run_sse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_name: "crm_data_agent",
          user_id: "user@ai",
          session_id: "7a2521656a8e45419c1dae20982893a7",
          streaming: true,
          new_message: {
            role: "user",
            parts: [{ text }],
          },
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const events = chunk.split("\n\n");

        for (const event of events) {
          if (event.startsWith("data:")) {
            const dataStr = event.replace("data:", "").trim();
            if (!dataStr || dataStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(dataStr);
              console.log("🔵 SSE event:", parsed);

              // Try extracting assistant text
              let delta = "";

              if (parsed.content?.parts) {
                delta += parsed.content.parts
                  .map((p: any) => p.text || "")
                  .join("");
              }

              if (!delta && parsed.actions?.stateDelta?.output) {
                delta = parsed.actions.stateDelta.output;
              }

              if (delta) {
                assistantMessage += delta;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantMessage,
                  };
                  return updated;
                });
              }
            } catch (err) {
              console.error("❌ Failed to parse SSE event:", dataStr, err);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error in handleSend:", err);
    }
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatArea}>
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
      </div>

      <ChatInput onSend={handleSend} />
      <Footer />
    </div>
  );
}
