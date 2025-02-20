import React from 'react';

const Carousel = () => {
  return (
    <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <a href="#">
          <img
            src="https://www.giva.co/cdn/shop/files/Hero_Banner_Web__5_-min.jpg?v=1739183578&width=2000"
            className="d-block w-100"
            alt="Slide 1"
          />
          </a>
          
        </div>
        <div className="carousel-item">
          <a href="#">
          <img
            src="https://cdn.bradojewellery.com/b/1920x/1739431637676.jpeg"
            className="d-block w-100"
            alt="Slide 2"
          />
          </a>
          
        </div>
        <div className="carousel-item">
          <a href="#">
          <img
            src="https://cdn.bradojewellery.com/b/1920x/1735214924357.jpeg"
            className="d-block w-100"
            alt="Slide 3"
          />
          </a>
         
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#mainCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#mainCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
