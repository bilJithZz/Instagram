import React, { useEffect, useState } from 'react';
import './ProfileId.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ProfileIdView = () => {
  const [profileData, setProfileData] = useState({
    username: 'jhonson jhonson',
    posts: 0,
    followers: 0,
    following: 0,
    bio: "I'm not bossy, I just have better ideas",
    hashtags: ['#gggg'],
    postsList: [],
  });

  const token = useSelector(state => state.auth.token);
  const { id } = useParams(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/post/getpost/${id}`, { // Correct URL format
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = response.data;
        console.log(data)
        console.log("hh")

        setProfileData({
          username: data.username || 'jhonson jhonson',
          posts: data.posts || 0,
          followers: data.followers || 0,
          following: data.following || 0,
          bio: data.bio || "I'm not bossy, I just have better ideas",
          hashtags: data.hashtags || ['#gggg'],
          postsList: data.postsList || [],
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchData();
  }, [id, token]); // Use `id` and `token` as dependencies

  return (
    <div className="profile-id-view">
      <div className="profile-header">
        <div className="profile-pic">
          <img 
            src={profileData.profilePic || "https://images.pexels.com/photos/7512663/pexels-photo-7512663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} 
            alt="Profile"
          />
        </div>
        <div className="profile-info">
          <div className="profile-username">
            <span className="username">{profileData.username}</span>
            <button className="follow-button">Follow</button>
            <button className="following-button">Message</button>
          </div>
          <div className="profile-stats">
            <span><strong>{profileData.posts}</strong> posts</span>
            <span><strong>{profileData.followers}</strong> followers</span>
            <span><strong>{profileData.following}</strong> following</span>
          </div>
          <div className="profile-bio">
            <p className="bio-username">{profileData.username}</p>
            <p className="bio-description">{profileData.bio}</p>
          </div>
          <div className="profile-hashtags">
            {profileData.hashtags.map((hashtag, index) => (
              <p key={index}>{hashtag}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="profile-posts">
        {profileData.postsList.length > 0 ? (
          profileData.postsList.map((post, index) => (
            <div key={index} className="post">
              <img 
                src={post.imageUrl} 
                alt="Post" 
              />
            </div>
          ))
        ) : (
          <div>No posts available</div>
        )}
      </div>
    </div>
  );
};

export default ProfileIdView;
