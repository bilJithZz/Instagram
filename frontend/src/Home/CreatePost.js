import React, { useState } from 'react';
import axios from 'axios';
import "./CreatePost.css";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 

const NewPost = () => {
  const [image, setImage] = useState(null);
  const [content, setCaption] = useState('');
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.token);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      console.error('No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('image', image); 
    formData.append('content', content);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/post/createpost",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true // Include cookies with the request
        }
      );

      if (response.status === 201) {
        console.log('Post created successfully:', response.data);
        navigate('/');
      } else {
        console.error('Failed to create post:', response.status);
      }
    } catch (err) {
      console.error('Error uploading post:', err);
    }
  };

  return (
    <div className="new-post-page">
      <div className="new-post-container">
        <h2>Create New Post</h2>
        <form onSubmit={handleSubmit} className="new-post-form">
          <div className="upload-section">
            <input 
              type="file" 
              accept="image/*" 
              name="image"
              onChange={handleImageChange} 
            />
            {image && <img src={URL.createObjectURL(image)} alt="Preview" className="image-preview" />}
          </div>
          <textarea
            placeholder="Write a caption..."
            value={content}
            onChange={(e) => setCaption(e.target.value)}
            className="caption-input"
          />
          <button type="submit" className="submit-button">Share</button>
        </form>
      </div>
    </div>
  );
};

export default NewPost;
