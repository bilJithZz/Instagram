import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import './Feed.css';
import { FaRegHeart, FaRegBookmark, FaRegComment } from 'react-icons/fa';
import { SlOptions } from "react-icons/sl";
import { Link } from 'react-router-dom';
import { fetchPosts,  updatePost } from '../Redux/postSlice';
import {selectAllPosts} from "../Redux/postSlice"


const FeedItem = ({ id, profileImg, postImg, username, postText, userId, post }) => {
  const dispatch = useDispatch();
  const [liked, setLiked] = useState("");

  const handleLike = async () => {
    try {
      const postId = post;
     console.log(postId)
     console.log(post)
      if (liked) {
        await axios.post(`http://localhost:5000/api/post/likePost/${id}`);
        post.likes.length=post.likes.length+1
        console.log( post.likes.length)
      } else {
        await axios.post(`http://localhost:5000/api/post/dislikePost/${id}`);
      }
      setLiked(!liked);
      // dispatch(updatePost({ ...post, likes: liked ? post.likes.filter(like => like !== userId) : [...post.likes, userId] }));
    } catch (error) {
      console.error('Error liking/unliking the post:', error);
    }
  };

  return (
    <div className="feed-item">
      <div className="feed-profile">
        <Link to={`/getpost/${post.author?._id}`}>
          <div className="feed-profile-img">
            <img src={profileImg} alt="Profile" />
            <span>{username}</span>
          </div>
        </Link>
        <div className="options">
       
        <SlOptions />
        </div>
      </div>

      <div className="feed-post">
        <div className="feed-post-img">
          <img src={postImg} alt="Post" />
        </div>
        <div className="feed-op">
          <div className="feed-post-like-comment">
            <div className="feed-post-like" onClick={handleLike}>
              <FaRegHeart className={liked ? 'liked' : ''} />
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
          {post.likes.length} Likes
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
};

const Feed = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  let content;

  if (status === 'loading') {
    content = <p>Loading...</p>;
  } else if (status === 'succeeded') {
    if (posts.length > 0) {
      content = (
        <div className="feed">
          {posts.map((item) => {
          
            const imageUrl = item.picture.replace(/^Images\\/,'');
            return (
              <FeedItem
                key={item._id}
                id={item._id}
                profileImg={item.author?.profilepic || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'}
                postImg={`http://localhost:5000/${imageUrl}`}
                username={item.author?.username || 'Unknown User'}
                postText={item.caption || ''}
                post={item}
                userId={userId}
              />
            );
          })}
        </div>
      );
    } else {
      content = <p>No posts available</p>;
    }
  } else if (status === 'failed') {
    content = <p>{error}</p>;
  }

  return <div>{content}</div>;
};

export default Feed;