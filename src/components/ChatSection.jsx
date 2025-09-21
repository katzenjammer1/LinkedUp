import { useEffect, useState } from "react";
import { listenToUserChats, listenToChatMessages, sendChatMessage } from "../lib/chatService";

export default function ChatsSection({ user }) {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Subscribe to user's chats
  useEffect(() => {
    if (!user) return;
    const unsubscribe = listenToUserChats(user.uid, setChats);
    return () => unsubscribe();
  }, [user]);

  // Subscribe to messages in active chat
  useEffect(() => {
    if (!activeChat) return;
    const unsubscribe = listenToChatMessages(activeChat.id, setMessages);
    return () => unsubscribe();
  }, [activeChat]);

  const handleSend = () => {
    if (newMessage.trim() && activeChat) {
      sendChatMessage(activeChat.id, user, newMessage);
      setNewMessage("");
    }
  };

  if (activeChat) {
    return (
      <div className="chat-view">
        <div className="chat-header">
          <button onClick={() => setActiveChat(null)}>← Back</button>
          <h3>{activeChat.name}</h3>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={msg.senderId === user.uid ? "own" : "other"}>
              <p>{msg.senderName}: {msg.text}</p>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    );
  }

  // Chat list view
  return (
    <div className="chat-list">
      <h2>Your Chats</h2>
      {chats.length ? (
        <ul>
          {chats.map((chat) => (
            <li key={chat.id} onClick={() => setActiveChat(chat)}>
              <h4>{chat.name}</h4>
              <p>{chat.lastMessage?.text || "No messages yet"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No chats yet</p>
      )}
    </div>
  );
}
