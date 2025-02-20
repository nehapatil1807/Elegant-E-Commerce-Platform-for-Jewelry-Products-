import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { productService } from '../../services/productService';
import { formatPrice } from '../../utils/formatters';
import './layout.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Fetch suggestions when search term changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const response = await productService.getAllProducts();
        if (response.success) {
          const filteredProducts = response.data
            .filter(product => 
              product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 5);
          setSuggestions(filteredProducts);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/products/${productId}`);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <span className="text-sm">
                <i className="bi bi-telephone me-2"></i>
                +91 98765 43210
              </span>
              <span className="text-sm">
                <i className="bi bi-envelope me-2"></i>
                info@elegant.com
              </span>
            </div>
            <div className="d-flex gap-3">
              <a href="#" className="text-white">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-white">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-white">
                <i className="bi bi-twitter"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div className="container">
          <div className="d-flex align-items-center w-100">
            {/* Brand Logo */}
            <Link to="/" className="navbar-brand">
              <span className="h4 mb-0">Elegant</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-grow-1 mx-4" ref={searchRef}>
              <form onSubmit={handleSearch} className="search-form">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for jewellery..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                  />
                  <button type="submit" className="btn">
                    <i className="bi bi-search"></i>
                  </button>
                </div>

                {/* Search Suggestions */}
                {showSuggestions && searchTerm.trim() && (
                  <div className="search-suggestions">
                    {loading ? (
                      <div className="suggestion-loading">
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((product) => (
                        <div
                          key={product.id}
                          className="suggestion-item"
                          onClick={() => handleSuggestionClick(product.id)}
                        >
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="suggestion-img"
                            onError={(e) => { e.target.src = '/placeholder.jpg' }}
                          />
                          <div className="suggestion-details">
                            <div className="suggestion-name">{product.name}</div>
                            <div className="suggestion-category">{product.categoryName}</div>
                            <div className="suggestion-price">{formatPrice(product.price)}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-suggestions">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Navigation Icons */}
            <div className="d-flex align-items-center gap-3">
              <Link to="/" className="nav-icon">
                <i className="bi bi-house"></i>
              </Link>
              
              <Link to="/products" className="nav-icon">
                <i className="bi bi-gem"></i>
              </Link>

              {!user?.role?.includes('Admin') && (
                <Link to="/cart" className="nav-icon position-relative">
                  <i className="bi bi-cart3"></i>
                  {cart?.totalItems > 0 && (
                    <span className="cart-badge">
                      {cart.totalItems}
                    </span>
                  )}
                </Link>
              )}

              {user ? (
                <div className="dropdown">
                  <button
                    className="btn btn-link text-dark dropdown-toggle d-flex align-items-center"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <div className="user-avatar">
                      {user.firstName?.charAt(0)}
                    </div>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    {user.role === 'Admin' ? (
                      <>
                        <li><Link className="dropdown-item" to="/admin/dashboard">Dashboard</Link></li>
                        <li><Link className="dropdown-item" to="/admin/products">Products</Link></li>
                        <li><Link className="dropdown-item" to="/admin/orders">Orders</Link></li>
                      </>
                    ) : (
                      <>
                        <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                        <li><Link className="dropdown-item" to="/orders">Orders</Link></li>
                      </>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="btn btn-primary rounded-pill px-4"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Category Navigation */}
      <div className="category-nav bg-white border-top border-bottom">
        <div className="container">
          <ul className="nav justify-content-center py-2">
            <li className="nav-item">
              <Link 
                to="/products?category=1" 
                className="nav-link text-dark px-4"
              >
                Rings
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/products?category=2" 
                className="nav-link text-dark px-4"
              >
                Necklaces
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/products?category=3" 
                className="nav-link text-dark px-4"
              >
                Earrings
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/products?category=4" 
                className="nav-link text-dark px-4"
              >
                Bracelets
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;