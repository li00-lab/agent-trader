"use client";

import { useState } from "react";
import styles from "./ChatInput.module.css";

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void,
}) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type a message..."
        className={styles.input}
      />
      <button onClick={submit} className={styles.send}>
        Send
      </button>
    </div>
  );
}
