"use client";

import styles from "./Sidebar.module.css";
import { useState } from "react";

type Props = { onNewChat: () => void };

export default function Sidebar({ onNewChat }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={collapsed ? styles.sidebarCollapsed : styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.logo}>✳︎ Chat</span>
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed((c) => !c)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {!collapsed && (
        <>
          <button className={styles.newChatBtn} onClick={onNewChat}>
            + New chat
          </button>

          <div className={styles.sectionTitle}>Recent</div>

          <div className={styles.footer}>
            <div className={styles.profile}>
              <div className={styles.avatar}>LW</div>
              <div>
                <div className={styles.name}>Li WenHan</div>
                <div className={styles.muted}>Free plan</div>
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
