import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      <ChatWindow />
    </div>
  );
}
