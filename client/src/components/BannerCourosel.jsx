import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { API_BASE_URL } from "../config/api";

const BannerCarousel = ({ banners }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {banners.map((banner, index) => (
        <div key={index} className="relative">
          <img
            src={`${API_BASE_URL}/banners/${banner.image}`}
            alt={`Banner ${index + 1}`}
            className="w-full h-auto"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
            <h2 className="text-xl sm:text-3xl md:text-5xl lg:text-7xl  font-bold">{banner.title}</h2>
            <p className="text-[0.5rem] sm:text-xs md:text-sm lg:text-2xl">{banner.description}</p>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default BannerCarousel;
