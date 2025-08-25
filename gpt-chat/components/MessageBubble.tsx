"use client";

import { useState } from "react";
import styles from "./MessageBubble.module.css";

export default function MessageBubble({
  role,
  content,
  rating,
  onRate,
}: {
  role: "user" | "assistant";
  content: string;
  rating?: number; // 1..5 (optional)
  onRate?: (value: number | null) => void; // null = clear rating
}) {
  const isUser = role === "user";

  return (
    <div className={isUser ? styles.userRow : styles.assistantRow}>
      <div className={isUser ? styles.userBubble : styles.assistantBubble}>
        {!isUser && <div className={styles.botBadge}>AI</div>}
        <div className={styles.content}>{content}</div>

        {/* Stars only for assistant messages */}
        {!isUser && onRate && (
          <StarRating value={rating ?? 0} onChange={onRate} />
        )}
      </div>
    </div>
  );
}

/* Inline star rater */
function StarRating({
  value,
  onChange,
}: {
  value: number; // 0..5
  onChange: (v: number | null) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;

  return (
    <div className={styles.ratingRow} aria-label="Rate this response">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= shown;
        return (
          <button
            key={n}
            type="button"
            className={`${styles.starBtn} ${filled ? styles.starFilled : ""}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(null)}
            onClick={() => onChange(value === n ? null : n)}
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
          >
            <svg viewBox="0 0 20 20" className={styles.star} aria-hidden="true">
              <path d="M10 1.6l2.5 5.2 5.8.8-4.2 4.1 1 5.7L10 14.9 4.9 17.4l1-5.7L1.6 7.6l5.9-.8L10 1.6z" />
            </svg>
          </button>
        );
      })}
      {value ? (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={() => onChange(null)}
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}
