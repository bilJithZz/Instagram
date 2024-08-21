import React from 'react';
import './ProfileId.css';

const ProfileIdView = () => {
  

  return (
    <div className="profile-id-view">
     <div className="profile-details">
        <div className="profile-item">
           <img src="https://images.pexels.com/photos/7512663/pexels-photo-7512663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="unkonwn" />
           </div>
        <div className="follow">
          <div className="details1">
          <div className="details">
          <span>jhonson jhonson </span>
            <button>follow</button>
            <button>infollow</button>
          </div>
          <div className="follows">
            <span>7 post</span>
            <span>7 post</span>
            <span>7 post</span>
          </div>
          <div className="discriptiions">
            <p>username</p>
            <p>hhhhi</p>
          </div>
          <div className="hashtag">
            <p>#gggg</p>
          </div>
          </div>
        </div>
        </div>
        <div className="ind-post">
          <div className="ind-post-img">
            <img src="" alt="chat" />
          </div>
        </div>
    </div>
  );
};

export default ProfileIdView;
