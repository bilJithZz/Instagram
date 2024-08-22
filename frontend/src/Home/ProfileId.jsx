import React from 'react';
import './ProfileId.css';

const ProfileIdView = () => {
  return (
    <div className="profile-id-view">
      <div className="profile-header">
        <div className="profile-pic">
          <img 
            src="https://images.pexels.com/photos/7512663/pexels-photo-7512663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Profile"
          />
        </div>
        <div className="profile-info">
          <div className="profile-username">
            <span className="username">jhonson jhonson</span>
            <button className="follow-button">Follow</button>
            <button className="following-button">Message</button>
          </div>
          <div className="profile-stats">
            <span><strong>7</strong> posts</span>
            <span><strong>7</strong> followers</span>
            <span><strong>7</strong> following</span>
          </div>
          <div className="profile-bio">
            <p className="bio-username">username</p>
            <p className="bio-description">I'm not bossy, I just have better ideas</p>
          </div>
          <div className="profile-hashtags">
            <p>#gggg</p>
          </div>
        </div>
      </div>
      <div className="profile-posts">
        {[...Array(15)].map((_, index) => (
          <div key={index} className="post">
            <img 
              src="https://via.placeholder.com/150" 
              alt="Post" 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileIdView;
