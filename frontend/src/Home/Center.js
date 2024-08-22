import React from 'react'
import "./Center.css"
import ProfilePic from './ProfilePic'
import Feed from './Feed'

const Center = () => {
  return (
    <div className='center-container'>
       <div className="center-feed">
          <Feed/>
        </div>
    </div>
  )
}

export default Center