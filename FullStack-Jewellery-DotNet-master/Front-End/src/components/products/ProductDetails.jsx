import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { productService } from '../../services/productService';
import { formatPrice } from '../../utils/formatters';
import { toast } from 'react-toastify';
import Loading from '../common/Loading';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Additional images - in real app, these would come from the product data
  const additionalImages = [
    'https://cdn.bradojewellery.com/p/200x/1691224769933.jpeg',
    'https://cdn.bradojewellery.com/p/200x/1691224769933.jpeg',
    'https://cdn.bradojewellery.com/p/200x/1691224769933.jpeg',
    'https://cdn.bradojewellery.com/p/200x/1691224769933.jpeg'
  ];

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.imageUrl);
    }
  }, [product]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await productService.getProduct(id);
      if (response.success) {
        setProduct(response.data);
        setQuantity(1);
      } else {
        toast.error('Product not found');
        navigate('/products');
      }
    } catch (error) {
      toast.error('Error loading product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.info('Please login to add items to cart');
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }

    try {
      setAddingToCart(true);
      const result = await addToCart(product.id, quantity);
      if (result.success) {
        toast.success('Product added to cart');
        navigate('/cart');
      } else {
        toast.error(result.message || 'Failed to add product to cart');
      }
    } catch (error) {
      toast.error('Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <Loading />;
  if (!product) return null;

  return (
    <div className="product-details-page">
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/products">Products</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/products?category=${product.categoryId}`}>
                {product.categoryName}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="card border-0 shadow-sm">
          <div className="row g-0">
            {/* Product Images */}
            <div className="col-md-6">
              <div className="product-gallery">
                <div className="main-image-container">
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="main-image"
                    onError={(e) => { e.target.src = '/placeholder.jpg' }}
                  />
                </div>
                <div className="thumbnail-grid">
                  {/* Main product image thumbnail */}
                  <button
                    className={`thumbnail-btn ${selectedImage === product.imageUrl ? 'active' : ''}`}
                    onClick={() => setSelectedImage(product.imageUrl)}
                  >
                    <img
                      src={product.imageUrl}
                      alt={`${product.name} - Main`}
                      onError={(e) => { e.target.src = '/placeholder.jpg' }}
                    />
                  </button>
                  
                  {/* Additional image thumbnails */}
                  {additionalImages.map((img, index) => (
                    <button
                      key={index}
                      className={`thumbnail-btn ${selectedImage === img ? 'active' : ''}`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <img
                        src={img}
                        alt={`${product.name} - View ${index + 1}`}
                        onError={(e) => { e.target.src = '/placeholder.jpg' }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="col-md-6">
              <div className="product-info">
                <h1 className="product-title">{product.name}</h1>
                <div className="product-category">{product.categoryName}</div>
                
                <div className="product-price">
                  <span className="current-price">{formatPrice(product.price)}</span>
                </div>

                <div className="stock-status mb-4">
                  <i className={`bi bi-check2-circle me-2 ${product.stock > 0 ? 'text-success' : 'text-danger'}`}></i>
                  {product.stock > 0 ? (
                    <span className="text-success">In Stock ({product.stock} available)</span>
                  ) : (
                    <span className="text-danger">Out of Stock</span>
                  )}
                </div>

                {product.stock > 0 && (
                  <>
                    <div className="quantity-selector mb-4">
                      <label className="form-label">Quantity</label>
                      <div className="d-flex align-items-center">
                        <div className="quantity-control">
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1 || addingToCart}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <input
                            type="number"
                            className="quantity-input"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                            min="1"
                            max={product.stock}
                            disabled={addingToCart}
                          />
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={quantity >= product.stock || addingToCart}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary btn-lg w-100 mb-3"
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                    >
                      {addingToCart ? (
                        <>
                          <span className="spinner-border spinner-border-sm text-light me-2" />
                          Adding to Cart...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cart-plus me-2"></i>
                          Add to Cart
                        </>
                      )}
                    </button>
                  </>
                )}

                <div className="product-features mt-4">
                  <h5 className="mb-3">Product Features</h5>
                  <div className="features-grid">
                    <div className="feature-item">
                      <i className="bi bi-shield-check"></i>
                      <span>100% Authentic</span>
                    </div>
                    <div className="feature-item">
                      <i className="bi bi-arrow-repeat"></i>
                      <span>Easy Returns</span>
                    </div>
                    <div className="feature-item">
                      <i className="bi bi-truck"></i>
                      <span>Free Shipping</span>
                    </div>
                    <div className="feature-item">
                      <i className="bi bi-patch-check"></i>
                      <span>Quality Assured</span>
                    </div>
                  </div>
                </div>

                <div className="product-description mt-4">
                  <h5 className="mb-3">Product Description</h5>
                  <p>
                    Experience the epitome of elegance with our {product.name}. 
                    Meticulously crafted to perfection, this piece showcases exceptional 
                    artistry and attention to detail. Perfect for both special occasions 
                    and everyday wear, it adds a touch of sophistication to any ensemble.
                  </p>
                  <ul className="feature-list">
                    <li>Premium quality materials</li>
                    <li>Unique design</li>
                    <li>Expert craftsmanship</li>
                    <li>Elegant finish</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;