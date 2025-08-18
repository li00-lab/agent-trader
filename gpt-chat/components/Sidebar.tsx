"use client";
import { useState } from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${
          isCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded
        }`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={styles.toggleButton}
        >
          {isCollapsed ? "→" : "←"}
        </button>

        {!isCollapsed && (
          <>
            <h2>Menu</h2>
            <ul className={styles.menuList}>
              <li className={styles.menuItem}>Chat 1</li>
              <li className={styles.menuItem}>Chat 2</li>
              <li className={styles.menuItem}>Chat 3</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
