import React from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../layout/Carousel';
import './home.css';

const FEATURED_CATEGORIES = [
  {
    id: 1,
    name: 'Bridal Choker',
    image: 'https://cdn.bradojewellery.com/is/540x/1724384731846.jpeg',
    description: 'Elegant for your special day',
    link: '/products?category=2'
  },
  {
    id: 2,
    name: 'Royalty Bangles',
    image: 'https://cdn.bradojewellery.com/is/540x/1724384687830.jpeg',
    description: 'Beautiful bangles for every occasion',
    link: '/products?category=4'
  },
  {
    id: 3,
    name: 'Temple Earrings',
    image: 'https://cdn.bradojewellery.com/is/540x/1724384709686.jpeg',
    description: 'Traditional temple jewelry earrings',
    link: '/products?category=3'
  },
  {
    id: 4,
    name: 'Exquisite Rings',
    image: 'https://cdn.bradojewellery.com/is/540x/1724384670437.jpeg',
    description: 'Fine crafted rings for every style',
    link: '/products?category=1'
  }
];

const HomePage = () => {
  const navigate = useNavigate();

  const CategoryCard = ({ category }) => (
    <div 
      className="category-card hover-shadow"
      onClick={() => navigate(category.link)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && navigate(category.link)}
    >
      <div className="category-img-wrapper">
        <img 
          src={category.image} 
          alt={category.name}
          className="img-fluid"
          onError={(e) => { e.target.src = '/placeholder.jpg' }}
        />
      </div>
      <div className="category-info">
        <h3>{category.name}</h3>
        <p>{category.description}</p>
      </div>
    </div>
  );

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <Carousel />
      
      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2 className="section-title">Traditional Jewellery</h2>
          <div className="row g-4">
            {FEATURED_CATEGORIES.map((category) => (
              <div key={category.id} className="col-md-6 col-lg-3">
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="brand-story">
        <div className="container">
          <div className="row">
            <div className="col-md-8 mx-auto">
              <h2>Our Story</h2>
              <p className="lead">
                Since 1990, Elegant Jewellery has been crafting timeless pieces 
                that celebrate life's most precious moments. Our commitment to 
                excellence and traditional craftsmanship has made us a trusted 
                name in fine jewelry.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;