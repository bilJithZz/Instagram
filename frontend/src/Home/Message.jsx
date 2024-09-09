import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axiosInstance from './axiosinstance'; 
import './Messege.css'; 
import axios from 'axios';
import { useSelector } from 'react-redux';

const ChatApp = () => {
  const [userId, setUserId] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState('');
  const socket = useRef(null);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const fetchUserAndContacts = async () => {
      try {
        const response = await axiosInstance.get('/me');
        setUserId(response.data.id);

        const contactsResponse = await axiosInstance.get('/getAlluser');
        console.log("Contacts fetched:", contactsResponse.data.user);
        setContacts(contactsResponse.data.user);

        if (contactsResponse.data.user.length > 0) {
          setSelectedContact(contactsResponse.data.user[0]);
        }
      } catch (error) {
        console.error('Error fetching user ID or contacts:', error);
      }
    };

    fetchUserAndContacts();
  }, []);

  useEffect(() => {
    if (userId) {
      // Initialize socket connection
      socket.current = io('http://localhost:5000');

      // Handle incoming messages
      socket.current.on('newMessage', (message) => {
        if (message.receiverId === userId || message.senderId === userId) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });

      return () => {
        if (socket.current) {
          socket.current.off('newMessage');
          socket.current.disconnect();
        }
      };
    }
  }, [userId]);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setMessages([]); 
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' && socket.current) {
      try {
        const message = {
          receiverId: selectedContact._id,
          content: newMessage,
          senderId: userId,
        };
       
        await axios.post('http://localhost:5000/api/message/sendMessage', message, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true 
        });

        socket.current.emit('sendMessage', message);

        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  if (!userId) {
    return <div>Loading user data...</div>;
  }

  if (!selectedContact) {
    return <div>Select a contact to start a chat...</div>;
  }

  return (
    <div className="chat-container">
      <div className="contact-list">
        <h2>Chats</h2>
        {contacts.map((contact) => (
          <div
            key={contact._id}
            className={`contact ${selectedContact && selectedContact._id === contact._id ? 'selected' : ''}`}
            onClick={() => handleSelectContact(contact)}
          >
            <img 
              src={contact.profilepic || 'default-profile-pic.jpg'} 
              alt={contact.username || 'Default Profile Picture'} 
            />
            <span>{contact.username}</span>
          </div>
        ))}
      </div>

      <div className="chat-area">
        <div className="chat-header">
          <img 
            src={selectedContact?.profilepic || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'} 
            alt={selectedContact?.username || 'Default Profile Picture'} 
          />
          <span>{selectedContact?.username || 'No Contact Selected'}</span>
        </div>

        <div className="chat-messages">
          {messages
            .filter(message =>
              (message.senderId === userId || message.receiverId === userId) &&
              (message.senderId === selectedContact._id || message.receiverId === selectedContact._id)
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
