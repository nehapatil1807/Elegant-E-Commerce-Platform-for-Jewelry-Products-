import React from "react";
import "./AboutUs.css"; 
import Navbar from "../../customer/Components/Navbar/Navigation";

const AboutUs = () => {
  return (
    <><div> <Navbar/></div><div className="about-container">

      <div className="about-banner">
        <h1>About Elegant</h1>
        <p>Discover the story behind our journey and craftsmanship.</p>
      </div>
      <div className="about-content">
        <h2>Our Story</h2>
        <p>
          At Elegant, we believe that every piece of jewelry tells a story.
          Established in 1995, we have been dedicated to crafting exquisite
          jewelry that combines tradition with modern elegance. Our designs
          are inspired by the rich heritage of Indian craftsmanship, ensuring
          each creation is a masterpiece.
        </p>
        <h2>Our Mission</h2>
        <p>
          To provide customers with timeless jewelry that celebrates life's
          most cherished moments. We are committed to delivering quality,
          authenticity, and exceptional service.
        </p>
        <h2>Why Choose Us?</h2>
        <ul>
          <li>Handcrafted designs with premium materials</li>
          <li>Ethically sourced gemstones</li>
          <li>Personalized customer experience</li>
        </ul>
      </div>
    </div></>
  );
};

export default AboutUs;
