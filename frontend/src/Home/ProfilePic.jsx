import React from 'react';
import Slider from "react-slick";
import "./ProfilePic.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProfilePic = () => {
  const images = [
    "https://images.pexels.com/photos/7512663/pexels-photo-7512663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/7512663/pexels-photo-7512663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/7512663/pexels-photo-7512663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/7512663/pexels-photo-7512663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/7512663/pexels-photo-7512663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: true,
  };

  return (
    <div className="profile-pic-carousel">
      <Slider {...settings}>
        {images.map((src, index) => (
          <div className="profile-pic-item" key={index}>
            <img src={src} alt={`Profile ${index + 1}`} />
            <p>Item {index + 1}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ProfilePic;
