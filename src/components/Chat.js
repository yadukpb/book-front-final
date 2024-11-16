import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CSS/chat.css";
import { FaUserCircle } from "react-icons/fa";
import { BsThreeDotsVertical, BsSend } from "react-icons/bs";
import { toast } from "react-toastify";

function Chat({ userId, userData }) {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const chatBoxRef = useRef(null);

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await fetch('http://localhost:5007/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) throw new Error('Token refresh failed');

      const { accessToken } = await response.json();
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/auth');
      throw error;
    }
  };

  const fetchWithAuth = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.status === 401) {
        const newToken = await refreshToken();
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`
          }
        });
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (sellerId) {
      initializeChat();
    } else {
      fetchChats();
    }
  }, [sellerId]);

  const initializeChat = async () => {
    try {
      const response = await fetchWithAuth(`http://localhost:5007/api/chats/${sellerId}`);
      
      if (response.ok) {
        const chat = await response.json();
        setCurrentChat(chat);
        const seller = chat.participants.find(p => p._id === sellerId);
        setSelectedSeller(seller);
      } else {
        const sellerResponse = await fetchWithAuth(`http://localhost:5007/api/users/${sellerId}`);
        if (!sellerResponse.ok) throw new Error('Failed to fetch seller info');
        
        const sellerData = await sellerResponse.json();
        setSelectedSeller(sellerData);

        const createChatResponse = await fetchWithAuth('http://localhost:5007/api/chats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            participantId: sellerId
          })
        });

        if (!createChatResponse.ok) throw new Error('Failed to create chat');
        
        const newChat = await createChatResponse.json();
        setCurrentChat(newChat);
      }
    } catch (error) {
      toast.error('Failed to initialize chat');
    }
  };

  const fetchChats = async () => {
    try {
      const response = await fetch('http://localhost:5007/api/chats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('Failed to load chats');
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !currentChat) return;

    try {
      const response = await fetchWithAuth(`http://localhost:5007/api/chats/${currentChat._id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          text: message,
          senderId: userId
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const newMessage = await response.json();
      setCurrentChat(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage]
      }));
      setMessage("");
      
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="chat-container">
      <div className="sellers-sidebar">
        {chats.map(chat => {
          const otherParticipant = chat.participants.find(p => p._id !== localStorage.getItem('userId'));
          return (
            <div
              key={chat._id}
              className={`seller-item ${currentChat?._id === chat._id ? 'selected' : ''}`}
              onClick={() => navigate(`/chat/${otherParticipant._id}`)}
            >
              <div className="seller-avatar">
                {otherParticipant.image ? (
                  <img src={otherParticipant.image} alt={otherParticipant.name} />
                ) : (
                  <FaUserCircle size={30} />
                )}
              </div>
              <div className="seller-info">
                <div className="seller-name">{otherParticipant.name}</div>
                <div className="last-message">
                  {chat.messages[chat.messages.length - 1]?.text || 'No messages yet'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat-area">
        {currentChat ? (
          <>
            <div className="chat-header">
              <div className="selected-seller-info">
                {selectedSeller && (
                  <>
                    <div className="seller-avatar">
                      {selectedSeller.image ? (
                        <img src={selectedSeller.image} alt={selectedSeller.name} />
                      ) : (
                        <FaUserCircle size={30} />
                      )}
                    </div>
                    <div className="seller-details">
                      <div className="seller-name">{selectedSeller.name}</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="messages-container" ref={chatBoxRef}>
              {currentChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-wrapper ${msg.sender === localStorage.getItem('userId') ? 'sent' : 'received'}`}
                >
                  <div className="message">
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