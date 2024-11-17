import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CSS/chat.css";
import { FaUserCircle } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import { toast } from "react-toastify";

function Chat({ userId, userData }) {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const chatBoxRef = useRef(null);

  const fetchChats = async () => {
    const response = await fetch('http://localhost:5007/api/chats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    setChats(data);
    if (data.length > 0) {
      setCurrentChat(data[0]); // Set the first chat as the default
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !currentChat) return;

    const response = await fetch(`http://localhost:5007/api/chats/${currentChat._id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ text: message })
    });

    if (response.ok) {
      const newMessage = await response.json();
      setCurrentChat(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage]
      }));
      setMessage("");
    } else {
      toast.error('Failed to send message');
    }
  };

  const initiateChatWithSeller = async () => {
    const response = await fetch(`http://localhost:5007/api/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ participantId: sellerId })
    });

    if (response.ok) {
      const chat = await response.json();
      setCurrentChat(chat); // Set the current chat to the newly created or fetched chat
    } else {
      toast.error('Failed to initiate chat with seller');
    }
  };

  useEffect(() => {
    fetchChats();
    if (sellerId) {
      initiateChatWithSeller(); // Initiate chat with seller if sellerId is present
    }
  }, [sellerId]);

  return (
    <div className="chat-container">
      <div className="sellers-sidebar">
        {chats.map(chat => (
          <div
            key={chat._id}
            className={`seller-item ${currentChat?._id === chat._id ? 'selected' : ''}`}
            onClick={() => setCurrentChat(chat)}
          >
            <div className="seller-avatar">
              {chat.participants.find(p => p._id !== userId)?.image ? (
                <img src={chat.participants.find(p => p._id !== userId)?.image} alt="Avatar" />
              ) : (
                <FaUserCircle size={30} />
              )}
            </div>
            <div className="seller-info">
              <div className="seller-name">{chat.participants.find(p => p._id !== userId)?.name}</div>
              <div className="last-message">
                {chat.messages[chat.messages.length - 1]?.text || 'No messages yet'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-area">
        {currentChat ? (
          <>
            <div className="chat-header">
              <div className="selected-seller-info">
                {currentChat.participants.find(p => p._id !== userId)?.name}
              </div>
            </div>

            <div className="messages-container" ref={chatBoxRef}>
              {currentChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-wrapper ${msg.sender === userId ? 'sent' : 'received'}`}
                >
                  <div className={`message ${msg.sender === userId ? 'sent' : 'received'}`}>
                    <p className="message-text">{msg.text}</p>
                    <div className="message-info">
                      <span className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="input-area">
              <div className="message-input-container">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="message-input"
                />
                <button onClick={sendMessage} className="send-button">
                  <BsSend />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            Select a chat or start a new conversation
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;