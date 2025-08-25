import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <Sidebar />

      {/* Right column */}
      <main className={styles.main} style={{ minWidth: 0 }}>
        <ChatWindow />
      </main>
    </div>
  );
}
