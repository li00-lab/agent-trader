import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./chat.css";

function App() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <ChatWindow />
      </main>
    </div>
  );
}

export default App;
