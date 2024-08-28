import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axiosInstance from './axiosinstance'; // Adjust the path as needed
import './Messege.css';

const contacts = [
  { id: 1, name: 'Harikrishna', image: 'https://images.pexels.com/photos/14727496/pexels-photo-14727496.jpeg' },
  { id: 2, name: 'John Doe', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' },
  { id: 3, name: 'Jane Smith', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg' },
  { id: 4, name: 'Emily Johnson', image: 'https://images.pexels.com/photos/4586342/pexels-photo-4586342.jpeg' },
  { id: 5, name: 'Michael Brown', image: 'https://images.pexels.com/photos/6316610/pexels-photo-6316610.jpeg' },
];

const ChatApp = () => {
  const [userId, setUserId] = useState(null);
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState('');
  console.log(newMessage)
  const socket = useRef(null);

  useEffect(() => {
    
    const fetchUserId = async () => {
      try {
        const response = await axiosInstance.get('/me');
        setUserId(response.data.id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      socket.current = io('http://localhost:5000', {
        query: { userId },
      });

      socket.current.on('newMessage', (message) => {
        if (message.receiverId === userId || message.senderId === userId) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });

      return () => {
        socket.current.off('newMessage');
        socket.current.disconnect();
      };
    }
  }, [userId]);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '' && socket.current) {
      const message = {
        senderId: userId,
        receiverId: selectedContact.id,
        content: newMessage,
      };

      socket.current.emit('sendMessage', message);
      setNewMessage('');
    }
  };

  if (!userId) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="chat-container">
      <div className="contact-list">
        <h2>Chats</h2>
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`contact ${selectedContact.id === contact.id ? 'selected' : ''}`}
            onClick={() => handleSelectContact(contact)}
          >
            <img src={contact.image} alt={contact.name} />
            <span>{contact.name}</span>
          </div>
        ))}
      </div>

      <div className="chat-area">
        <div className="chat-header">
          <img src={selectedContact.image} alt={selectedContact.name} />
          <span>{selectedContact.name}</span>
        </div>

        <div className="chat-messages">
          {messages
            .filter(message =>
              (message.senderId === userId || message.receiverId === userId) &&
              (message.senderId === selectedContact.id || message.receiverId === selectedContact.id)
            )
            .map((message, index) => (
              <div key={index} className={`chat-message ${message.senderId === userId ? 'sent' : 'received'}`}>
                <p>{message.content}</p>
              </div>
            ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
