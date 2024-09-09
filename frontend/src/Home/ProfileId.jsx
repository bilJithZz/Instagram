import React, { useEffect, useState } from 'react';
import './ProfileId.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ProfileIdView = () => {
  const [isFollow, setIsFollow] = useState(false);
  const [profileData, setProfileData] = useState({
    username: 'jhonson jhonson',
    posts: 0,
    followers: 0,
    following: 0,
    bio: "I'm not bossy, I just have better ideas",
    hashtags: ['#gggg'],
    postsList: [],
    profilePic: ''
  });

  const token = useSelector(state => state.auth.token);
  const { id } = useParams(); 
  console.log({"id": id});

  useEffect(() => {
    const fetchData = async () => {
      try {
      
        const profileResponse = await axios.get(`http://localhost:5000/api/post/getpost/${id}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = profileResponse.data.individualPosts; 
  
        console.log({"data":data})
       
        const postsList = data.map(post => ({
          id: post._id,
          caption: post.caption || '',
          picture: post.picture || '',
          likes: post.likes.length || 0,
          comments: post.comments.length || 0,
          author: post.author.username || 'Unknown',
        }));

        const author = data.length > 0 ? data[0].author : {};
        
        setProfileData({
          username: author.username || 'jhonson jhonson',
          posts: postsList.length || 0,
          followers: author.followers.length || 0, 
          following: author.following.length || 0, 
          bio: author.bio || "I'm not bossy, I just have better ideas",
          hashtags: author.hashtags || ['#gggg'], 
          postsList: postsList,
          profilePic: author.profilepic || "",
        });

        // Check follow status
        const followResponse = await axios.get(`http://localhost:5000/api/user/isfollowing/${id}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        setIsFollow(followResponse.data.isFollowing);

      } catch (error) {
        console.error('Error fetching profile data or follow status:', error);
      }
    };

    fetchData();
  }, [id, token]);

  const handleFollowToggle = async () => {
    try {
      const url = isFollow
        ?`http://localhost:5000/api/user/follow/${id}`
        :  `http://localhost:5000/api/user/unfollow/${id}`;
      await axios.post(url, {}, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      setIsFollow(!isFollow);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  return (
    <div className="profile-id-view">
      <div className="profile-header">
        <div className="profile-pic">
          <img 
            src={profileData.profilePic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
            alt="Profile"
          />
        </div>
        <div className="profile-info">
          <div className="profile-username">
            <span className="username">{profileData.username}</span>
            <button className="follow-button" onClick={handleFollowToggle}>
              {isFollow ? 'Following' : 'Follow'}
            </button>
            <button className="message-button">Edit-Profile</button> 
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
          profileData.postsList.map((post) => {
           
            const imageUrl = post.picture.replace(/Images/, '');
            return (
              <div key={post.id} className="post">
                <img 
                  src={`http://localhost:5000/${imageUrl}`} 
                  alt={post.caption}
                />
                {/* <p>{post.caption}</p> */}
              </div>
            );
          })
        ) : (
          <div>No posts available</div>
        )}
      </div>
    </div>
  );
};

export default ProfileIdView;
