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
  const [loadingMessages, setLoadingMessages] = useState(false); // Track if messages are being loaded
  const [hasMoreMessages, setHasMoreMessages] = useState(true); // Track if there are more messages to load
  const socket = useRef(null);
  const token = useSelector(state => state.auth.token);
  const pageSize = 20; // Number of messages to fetch per request

  useEffect(() => {
    const fetchUserAndContacts = async () => {
      try {
        const response = await axiosInstance.get('/me');
        setUserId(response.data.id);

        const contactsResponse = await axiosInstance.get('/getAlluser');
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
      socket.current = io('http://localhost:5000');

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

  useEffect(() => {
    if (selectedContact && userId) {
      const fetchMessages = async () => {
        if (loadingMessages) return; // Prevent multiple fetches at the same time
        setLoadingMessages(true);

        try {
          const response = await axios.get(`http://localhost:5000/getMessages/${userId}/${selectedContact._id}?pageSize=${pageSize}`);
          setMessages(response.data.messages);
          setHasMoreMessages(response.data.hasMoreMessages); // Set flag based on response
        } catch (error) {
          console.error('Error fetching messages:', error);
        } finally {
          setLoadingMessages(false);
        }
      };

      fetchMessages();
    }
  }, [selectedContact, userId]);

  const loadMoreMessages = async () => {
    if (!hasMoreMessages || loadingMessages) return; // Prevent loading if no more messages or if already loading

    setLoadingMessages(true);
    try {
      const lastMessage = messages[messages.length - 1];
      const response = await axios.get(`http://localhost:5000/getMessages/${userId}/${selectedContact._id}?pageSize=${pageSize}&before=${lastMessage.timestamp}`);
      setMessages((prevMessages) => [...prevMessages, ...response.data.messages]);
      setHasMoreMessages(response.data.hasMoreMessages); // Update flag based on response
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setMessages([]); // Clear messages when changing contacts
    setHasMoreMessages(true); // Reset flag
    loadMoreMessages(); // Fetch messages for the newly selected contact
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' && selectedContact) {
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
        {contacts.length > 0 ? (
          contacts.map((contact) => (
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
          ))
        ) : (
          <div>No contacts available</div>
        )}
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
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.senderId === userId ? 'sent' : 'received'}`}>
              <p>{message.content}</p>
            </div>
          ))}
          {loadingMessages && <div>Loading more messages...</div>}
        </div>

        {hasMoreMessages && !loadingMessages && (
          <button onClick={loadMoreMessages}>Load More Messages</button>
        )}

        {selectedContact && (
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
