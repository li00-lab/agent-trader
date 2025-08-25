"use client";

import { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import styles from "./ChatWindow.module.css";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  rating?: number; // 1..5
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const assistantIdRef = useRef<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  // keep view pinned to the newest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Prepare ids
    const userId = crypto.randomUUID();
    const assistantId = crypto.randomUUID();
    assistantIdRef.current = assistantId;

    // Append user + placeholder assistant in one update (avoids race conditions)
    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: text },
      { id: assistantId, role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("http://localhost:8000/run_sse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_name: "crm_data_agent",
          user_id: "user@ai",
          session_id: "7a2521656a8e45419c1dae20982893a7",
          streaming: true,
          new_message: { role: "user", parts: [{ text }] },
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
          if (!event.startsWith("data:")) continue;

          const dataStr = event.replace("data:", "").trim();
          if (!dataStr || dataStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(dataStr);
            // Try extracting assistant delta text (adjust to your server’s payload)
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
              const targetId = assistantIdRef.current;
              if (!targetId) continue;

              setMessages((prev) =>
                prev.map((m) =>
                  m.id === targetId ? { ...m, content: assistantMessage } : m
                )
              );
            }
          } catch (err) {
            console.error("❌ Failed to parse SSE event:", dataStr, err);
          }
        }
      }
    } catch (err) {
      console.error("Error in handleSend:", err);
      // Optional: surface an error message inside the last assistant bubble
      const targetId = assistantIdRef.current;
      if (targetId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === targetId
              ? {
                  ...m,
                  content: (m.content || "") + "\n\n[Error receiving response]",
                }
              : m
          )
        );
      }
    } finally {
      assistantIdRef.current = null;
    }
  };

  // Star rating callback
  const handleRate = (id: string, rating: number | null) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, rating: rating ?? undefined } : m))
    );

    // Example: forward to your backend/analytics
    // void fetch("http://localhost:8000/feedback", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ message_id: id, rating }),
    // });
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatArea}>
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            role={m.role}
            content={m.content}
            rating={m.rating}
            onRate={
              m.role === "assistant" ? (v) => handleRate(m.id, v) : undefined
            }
          />
        ))}
        <div ref={endRef} />
      </div>

      <ChatInput onSend={handleSend} />
      <Footer />
    </div>
  );
}
