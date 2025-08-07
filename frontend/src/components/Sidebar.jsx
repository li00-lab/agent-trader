function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">ChatGPT</div>

      <button className="new-chat-btn">+ New Chat</button>

      <ul className="chat-history">
        <li>Build chat UI</li>
        <li>Investment Ideas</li>
        <li>Vacation Plans</li>
      </ul>

      <div className="sidebar-footer">👤 Li WenHan</div>
    </aside>
  );
}

export default Sidebar;
