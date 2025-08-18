"use client";

import Footer from "./Footer";
import styles from "./ChatWindow.module.css";

export default function ChatWindow() {
  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatArea}></div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
