import React, { useState } from 'react';
import './signin.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../Redux/dataSlice'; 

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To handle and display errors
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginSubmission = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/login', 
        { username, password }, 
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true  
        }
      );

      if (response.status === 200) {
        const { user, token } = response.data;
        // Persist token and login status in localStorage
        localStorage.setItem("isLogedIn", true);
        localStorage.setItem("token", token);
        // Update Redux state with user information
        dispatch(setAuthUser({ user, token }));
        // Redirect to home page or any other route
        navigate('/'); 
      }
    } catch (err) {
      setError('Login failed. Please check your username and password.');
      console.error('Login failed:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram Logo" />
        </div>
        <form onSubmit={loginSubmission} className="login-form">
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          <button type="submit">Log In</button>
          {error && <p className="login-error">{error}</p>} {/* Display error message */}
        </form>
        <div className="login-divider">
          <span>OR</span>
        </div>
        <div className="login-facebook">
          <a href="#">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook Logo" />
            Log in with Facebook
          </a>
        </div>
        <div className="login-forgot">
          <a href="#">Forgot password?</a>
        </div>
      </div>
      <div className="signup-container">
        <p>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
