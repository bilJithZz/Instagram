import React from 'react';
import "./Feed.css";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { SlOptionsVertical } from "react-icons/sl";
import { FaRegBookmark } from "react-icons/fa";
import {Link} from "react-router-dom"

const FeedItem = ({id, profileImg, postImg, username, postText }) => (
  <div className="feed-item">
    <div className="feed-profile">
    <Link to="/profileid"> <div className="feed-profile-img">
        <img src={profileImg} alt="Profile" />
        <span>{username}</span>
      </div>
      </Link> 
      <div className="options"><SlOptionsVertical /></div>
    </div>
    
    <div className="feed-post">
      <div className="feed-post-img">
        <img src={postImg} alt="Post" />
      </div>
      <div className="feed-op">
      <div className="feed-post-like-comment">
        <div className="feed-post-like">
          <FaRegHeart />
        </div>
        <div className="feed-post-comments">
          <FaRegComment />
        </div>
      </div>
      <div className="bookmark">
        <FaRegBookmark />
        </div>
      </div>

      <div className="feeds-likes">
        678 Likes
      </div>

      <div className="feed-post-name">
        <h4>{username}</h4> 
        <span>{postText}</span>
      </div>
      
      <div className="comment-placeholder">
        <input type="text" placeholder="Comment on the post" />
      </div>
    </div>
  </div>
);

const Feed = () => {
  const data = [
    { id:"1",
      profileImg: "https://images.pexels.com/photos/457418/pexels-photo-457418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      postImg: "https://images.pexels.com/photos/2305190/pexels-photo-2305190.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      username: "harikrishnan",
      postText: "hello"
    },
    {
      id:"2",
      profileImg: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
      postImg: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
      username: "harikrishnan",
      postText: "hello"
    },
    {
      id:"3",
      profileImg: "https://images.pexels.com/photos/712618/pexels-photo-712618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      postImg: "https://images.pexels.com/photos/712618/pexels-photo-712618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      username: "harikrishnan",
      postText: "ellow Mini CooperBeside White Concrete Buildingding"
    },
    {
      id:"4",
      profileImg: "https://images.pexels.com/photos/6457086/pexels-photo-6457086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      postImg: "https://images.pexels.com/photos/6457086/pexels-photo-6457086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      username: "harikrishnan",
      postText: "#hello"
    }
  ];

  return (
    <div className='feed'>
      {data.map((item, index) => (
        <FeedItem 
          key={index}
          profileImg={item.profileImg}
          postImg={item.postImg}
          username={item.username}
          postText={item.postText}
        />
      ))}
    </div>
  );
}

export default Feed;
