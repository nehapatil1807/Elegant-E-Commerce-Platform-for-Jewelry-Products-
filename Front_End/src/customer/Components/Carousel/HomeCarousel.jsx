import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { homeCarouselData } from "./HomeCaroselData";
import { useNavigate } from "react-router-dom";
import "./Carousel.css"; // Import the CSS file for styling

const handleDragStart = (e) => e.preventDefault();

const HomeCarousel = () => {
  const navigate = useNavigate();

  const items = homeCarouselData.map((item, index) =>
    item.type === "image" ? (
      <img
        key={index}
        className="cursor-pointer rounded-md"
        onClick={() => navigate(item.path)}
        src={item.src}
        alt=""
        onDragStart={handleDragStart}
        role="presentation"
      />
    ) : (
      <video
        key={index}
        className="cursor-pointer rounded-md carousel-video"
        onClick={() => navigate(item.path)}
        src={item.src}
        autoPlay
        muted
        loop
        onDragStart={handleDragStart}
        role="presentation"
      >
        Your browser does not support the video tag.
      </video>
    )
  );

  return (
    <AliceCarousel
      mouseTracking
      items={items}
      autoPlay
      infinite
      autoPlayInterval={5000}
      disableButtonsControls
    />
  );
};

export default HomeCarousel;
