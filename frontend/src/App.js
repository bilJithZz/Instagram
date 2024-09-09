import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Signup from './Signup/Signup';
import Home from './Home/Home';
import Message from './Home/Message';
import Layout from './Layout/Layout';
import ProfileId from './Home/ProfileId';
import SignIn from './Signin/signin';
import CreatePost from "./Home/CreatePost";
import Notification from './Home/Notification';
import Editprofile from './Home/Editprofile';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<SignIn />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/message" element={<Message />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/getpost/:id" element={<ProfileId />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/profile" element={<ProfileId />} />
          <Route path="/editProfile" elements={<Editprofile/>}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
