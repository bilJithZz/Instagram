import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Signup from './Signup/Signup';
import Home from './Home/Home';
import Messege from './Home/Messege';
import Layout from './Layout/Layout';
import ProfileId from './Home/ProfileId';
import indProfile from './Home/indProfile';
import SignIn from './Signin/signin';
import CreatePost from "./Home/CreatePost"


function App() {
  return (
    <div className="App">
      <Routes>

        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<SignIn/>}/>
        <Route path="/createpost" element={<CreatePost/>}/>

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/messege" element={<Messege />} />
          <Route path="/profileid" element={<ProfileId />} />
          <Route path="/profile" element={<indProfile />} />
          
        </Route>
      </Routes>
    </div>
  );
}

export default App;
