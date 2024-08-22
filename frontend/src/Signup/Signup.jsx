import React, { useState } from 'react'
import './Signup.css'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-logo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram Logo" />
        </div>
        <h2 className="register-heading">Sign up to see photos and videos from your friends.</h2>
        <button className="register-facebook">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook Logo" />
          Log in with Facebook
        </button>
        <div className="register-divider">
          <span>OR</span>
        </div>
        <form className="register-form">
          <input type="text" placeholder=" Email" />
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button type="submit">Sign Up</button>
        </form>
        <p className="register-terms">
          By signing up, you agree to our <a href="#">Terms</a>, <a href="#">Data Policy</a> and <a href="#">Cookies Policy</a>.
        </p>
      </div>
      <div className="login-container">
        <p>
          Have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
