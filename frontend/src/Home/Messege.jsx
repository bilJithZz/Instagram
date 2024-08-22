import React, { useState } from 'react';
import './Messege.css';

const contacts = [
  { id: 1, name: 'Harikrishna', image: 'https://images.pexels.com/photos/14727496/pexels-photo-14727496.jpeg' },
  { id: 2, name: 'John Doe', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' },
  { id: 3, name: 'Jane Smith', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg' },
  { id: 4, name: 'Emily Johnson', image: 'https://images.pexels.com/photos/4586342/pexels-photo-4586342.jpeg' },
  { id: 5, name: 'Michael Brown', image: 'https://images.pexels.com/photos/6316610/pexels-photo-6316610.jpeg' },
];

const ChatApp = () => {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState([
    { from: 'Harikrishna', text: 'Hello!' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    // Load messages for the selected contact if needed
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { from: 'Me', text: newMessage }]);
      setNewMessage('');
    }
  };

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
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.from === 'Me' ? 'sent' : 'received'}`}>
              <p>{message.text}</p>
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
