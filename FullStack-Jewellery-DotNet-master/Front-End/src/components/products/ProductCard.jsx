import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';
import './products.css';

const ProductCard = ({ product }) => {
  const calculateDiscount = () => {
    if (!product.originalPrice || product.originalPrice <= product.price) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  const discount = calculateDiscount();

  return (
    <div className="product-card">
      {/* Quick View Button */}
      <Link 
        to={`/products/${product.id}`}
        className="quick-view-btn"
        aria-label="Quick view"
      >
        <i className="bi bi-eye"></i>
      </Link>

      {/* Product Link and Image */}
      <Link to={`/products/${product.id}`} className="product-image-wrapper">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          onError={(e) => { e.target.src = '/placeholder.jpg' }}
        />
        {discount > 0 && (
          <div className="discount-badge">
            {discount}% OFF
          </div>
        )}
      </Link>

      {/* Product Info */}
      <Link to={`/products/${product.id}`} className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-category">{product.categoryName}</div>
        <div className="price-section">
          <span className="current-price">{formatPrice(product.price)}</span>
          {discount > 0 && (
            <span className="original-price">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;