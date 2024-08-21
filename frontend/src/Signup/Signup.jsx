import React, { useState } from 'react'
import './Signup.css'

const Signup = () => {

    const[email,setEmail]=useState("")
    const[username,setUsername]=useState("")
    const[password,setPassword]=useState("")

  return (
    <div className='insta-signup'>
        <div className="insta-signup-right">
            <form action="">
                <input type="text" placeholder='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input type="text" placeholder='username'  value={username} onChange={(e)=>setUsername(e.target.value)}/>
                <input type="text" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </form>
        </div>
    </div>
  )
}

export default Signup