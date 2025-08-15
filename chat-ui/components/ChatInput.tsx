"use client";

import { useState } from "react";
import styles from "./ChatInput.module.css";

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState("");

  const submit = () => {
    onSend(value);
    setValue("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Message ChatGPT…"
          rows={1}
          className={styles.input}
        />
        <button
          className={styles.send}
          onClick={submit}
          aria-label="Send message"
        >
          Send
        </button>
      </div>
      <div className={styles.hint}>
        Press Enter to send • Shift+Enter for new line
      </div>
    </div>
  );
}
