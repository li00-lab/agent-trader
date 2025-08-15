"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import styles from "./ChatWindow.module.css";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatWindow({ messages }: { messages: ChatMessage[] }) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} content={m.content} />
        ))}
        <div ref={endRef} />
      </div>
    </main>
  );
}
