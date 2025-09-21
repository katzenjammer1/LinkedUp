import { useEffect, useState } from "react";
import { listenToUserChats, listenToChatMessages, sendChatMessage } from "../lib/chatService";
import "./ChatsSection.css";

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (activeChat) {
    return (
      <div className="chat-view">
        <div className="chat-header">
          <button className="back-btn" onClick={() => setActiveChat(null)}>
            ← Back
          </button>
          <h3 className="chat-title">{activeChat.name}</h3>
        </div>

        <div className="chat-messages">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.senderId === user.uid ? "message-own" : "message-other"}`}>
                <div className="message-content">
                  <span className="message-sender">{msg.senderName}</span>
                  <p className="message-text">{msg.text}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-messages">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
        </div>

        <div className="chat-input">
          <input
            className="message-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
          />
          <button className="send-btn" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    );
  }

  // Chat list view
  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h2>Your Chats</h2>
        <span className="chat-count">{chats.length}</span>
      </div>
      {chats.length > 0 ? (
        <div className="chats-container">
          {chats.map((chat) => (
            <div key={chat.id} className="chat-item" onClick={() => setActiveChat(chat)}>
              <div className="chat-avatar">
                <div className="avatar-placeholder">
                  {chat.name ? chat.name.charAt(0).toUpperCase() : "?"}
                </div>
              </div>
              <div className="chat-info">
                <h4 className="chat-name">{chat.name}</h4>
                <p className="chat-preview">
                  {chat.lastMessage?.text || "No messages yet"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-chats">
          <p>No chats yet</p>
          <small>Start chatting with your matches!</small>
        </div>
      )}
    </div>
  );
}