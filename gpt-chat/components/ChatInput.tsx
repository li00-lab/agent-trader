"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ChatInput.module.css";

type Cmd = { id: string; label: string; hint?: string };

const COMMANDS: Cmd[] = [
  { id: "/SaveToRAG", label: "/SaveToRAG", hint: "Store in RAG index" },
  { id: "/SaveToDB", label: "/SaveToDB", hint: "Write to database" },
  { id: "/Summarize", label: "/Summarize", hint: "Summarize content" },
  { id: "/Translate", label: "/Translate", hint: "Translate content" },
];

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [raw, setRaw] = useState("");
  const [show, setShow] = useState(false);
  const [q, setQ] = useState("");
  const [ix, setIx] = useState(0);

  // NEW: track if a command has been confirmed (chip placed)
  const [confirmedCmd, setConfirmedCmd] = useState<string | null>(null);

  const matches = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return COMMANDS;
    return COMMANDS.filter((c) => c.id.toLowerCase().includes(t));
  }, [q]);

  const html = useMemo(() => {
    const m = raw.match(/^\/[^\s]+/);
    if (!m) return escapeHtml(raw);
    const cmd = m[0];
    return `<span class="${styles.chip}">${escapeHtml(cmd)}</span>${escapeHtml(
      raw.slice(cmd.length)
    )}`;
  }, [raw]);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html || "";
      placeCaretAtEnd(editorRef.current);
    }
  }, [html]);

  const handleInput = () => {
    if (!editorRef.current) return;
    const text = getPlainText(editorRef.current);
    setRaw(text);

    // If a command was confirmed and the text still starts with it,
    // do NOT show the menu.
    if (confirmedCmd && text.startsWith(confirmedCmd)) {
      setShow(false);
      setQ("");
      return;
    }

    // If user deleted the confirmed command, unlock
    if (confirmedCmd && !text.startsWith(confirmedCmd)) {
      setConfirmedCmd(null);
    }

    // Show menu ONLY while typing the initial "/query" token
    // (no space typed yet) and ONLY if no command is confirmed.
    const m = text.match(/^\/([^\s]*)$/); // e.g. "/", "/sav", but not "/save "
    if (!confirmedCmd && m) {
      setQ(m[1] ?? "");
      setShow(true);
      setIx(0);
    } else {
      setShow(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (show && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      const n = matches.length;
      setIx((prev) =>
        e.key === "ArrowDown" ? (prev + 1) % n : (prev - 1 + n) % n
      );
      return;
    }
    if (show && (e.key === "Tab" || e.key === "Enter")) {
      e.preventDefault();
      applySuggestion(matches[ix]?.id ?? "");
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const applySuggestion = (id: string) => {
    if (!id) return;
    // Replace the leading "/query" token with the picked command + space
    const next = raw.replace(/^\/[^\s]*/, id) + " ";
    setRaw(next);

    // ✅ Lock the command and close the menu
    setConfirmedCmd(id);
    setShow(false);
    setQ("");

    // Render chip immediately and keep caret at the end
    requestAnimationFrame(() => {
      if (!editorRef.current) return;
      editorRef.current.innerHTML = next.replace(
        /^\/[^\s]*/,
        `<span class="${styles.chip}">${id}</span>`
      );
      placeCaretAtEnd(editorRef.current);
    });
  };

  const submit = () => {
    const text = raw.trim();
    if (!text) return;
    onSend(text);
    setRaw("");
    setShow(false);
    setQ("");
    setConfirmedCmd(null);
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
      editorRef.current.focus();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div
        ref={editorRef}
        className={styles.input}
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder="Type a message…  (try “/”)"
        onInput={handleInput}
        onKeyDown={onKeyDown}
      />
      <button className={styles.send} onClick={submit} aria-label="Send">
        Send
      </button>

      {show && matches.length > 0 && (
        <div className={styles.menu} role="listbox">
          {matches.map((m, i) => (
            <div
              key={m.id}
              role="option"
              aria-selected={i === ix}
              className={`${styles.item} ${i === ix ? styles.active : ""}`}
              onMouseDown={(e) => {
                e.preventDefault(); // keep focus
                applySuggestion(m.id);
              }}
              onMouseEnter={() => setIx(i)}
            >
              <span className={styles.itemCmd}>{m.id}</span>
              {m.hint && <span className={styles.itemHint}>{m.hint}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* --- helpers --- */
function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
function getPlainText(el: HTMLElement) {
  const clone = el.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("span").forEach((sp) => {
    sp.replaceWith(document.createTextNode(sp.textContent || ""));
  });
  return clone.innerText.replace(/\u00A0/g, " ");
}
function placeCaretAtEnd(el: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}
