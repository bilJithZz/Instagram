import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import './Feed.css';
import { FaRegHeart, FaRegBookmark, FaRegComment } from 'react-icons/fa';
import { SlOptions } from "react-icons/sl";
import { Link } from 'react-router-dom';
import { fetchPosts, selectAllPosts } from '../Redux/postSlice';

const FeedItem = ({ id, profileImg, postImg, username, post }) => {
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [likesList, setLikesList] = useState(post.likes);
  const token = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.userId);

  useEffect(() => {
    setLiked(likesList.includes(userId));
  }, [likesList, userId]);

  const handleDelete = async () => {

    console.log(post.author.posts)
    try {
      const response = await axios.delete(`http://localhost:5000/api/post/delete/${post._id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        dispatch(fetchPosts());
        console.log("Post deleted successfully");
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleLike = async () => {
    if (!token) {
      console.error('User is not logged in');
      return;
    }

    try {
      const postId = post._id;
      let response;
      if (!liked) {
        response = await axios.post(`http://localhost:5000/api/post/likePost/${postId}`, {}, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response && response.status === 200) {
          setLiked(true);
          setLikesCount(likesCount + 1);
          setLikesList([...likesList, userId]); 
        }
      } else {
        response = await axios.post(`http://localhost:5000/api/post/dislikePost/${postId}`, {}, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response && response.status === 200) {
          setLiked(false);
          setLikesCount(likesCount - 1);
          setLikesList(likesList.filter((id) => id !== userId)); 
        }
      }
    } catch (error) {
      console.error('Error liking/unliking the post:', error);
    }
  };

  return (
    <div className="feed-item">
      <div className="feed-profile">
        <Link className="feed-profile-link" to={`/getpost/${post.author?._id}`}>
          <div className="feed-profile-img">
            <img src={profileImg} alt="Profile" />
            <span>{username}</span>
          </div>
        </Link>
        {token && (
          <div className="options" onClick={handleDelete}>
            <SlOptions />
          </div>
        )}
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
          {likesCount} Likes
        </div>

        <div className="feed-post-name">
          <h4>{username}</h4>
          <span>{post.caption || ''}</span>
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
  console.log(posts)
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

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
            const imageUrl = item.picture.replace(/^Images[\\/]/, '');
            return (
              <FeedItem
                key={item._id}
                id={item._id}
                profileImg={item.author?.profilepic || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'}
                postImg={`http://localhost:5000/${imageUrl}`}
                username={item.author?.username || 'Unknown User'}
                post={item}
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
