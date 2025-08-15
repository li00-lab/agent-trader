import styles from "./MessageBubble.module.css";

export default function MessageBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";
  return (
    <div className={isUser ? styles.userRow : styles.assistantRow}>
      <div className={isUser ? styles.userBubble : styles.assistantBubble}>
        {!isUser && <div className={styles.botBadge}>AI</div>}
        <div className={styles.content}>{content}</div>
      </div>
    </div>
  );
}
