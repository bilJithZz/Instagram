import React, { useState } from 'react';
import axios from 'axios';
import "./CreatePost.css";
import { useSelector } from 'react-redux';

const NewPost = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');

  
  const token = useSelector(state => state.auth.token);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    const formData = new FormData();
    formData.append('image', image); 
    formData.append('caption', caption);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/post/createpost",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}` 
          },
          withCredentials: true 
        }
      );

      console.log('Response:', response.data);
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
            value={caption}
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
