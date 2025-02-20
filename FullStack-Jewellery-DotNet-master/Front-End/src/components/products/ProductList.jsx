import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { productService } from '../../services/productService';
import { formatPrice } from '../../utils/formatters';
import { toast } from 'react-toastify';
import ProductCard from './ProductCard';
import './ProductList.css';

const CATEGORIES = [
  { id: 'all', name: 'All Jewelry', icon: 'bi-grid' },
  { id: '1', name: 'Rings', icon: 'bi-circle', description: 'Engagement & Fashion Rings' },
  { id: '2', name: 'Necklaces', icon: 'bi-gem', description: 'Chains & Pendants' },
  { id: '3', name: 'Earrings', icon: 'bi-diamond', description: 'Studs & Drops' },
  { id: '4', name: 'Bracelets', icon: 'bi-circle-half', description: 'Bangles & Chains' }
];

const ProductList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    priceRange: searchParams.get('price') || 'all',
    sort: searchParams.get('sort') || 'latest',
    search: searchParams.get('search') || '',
    minPrice: 0,
    maxPrice: 10000
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      if (response.success) {
        setProducts(response.data);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      toast.error('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.category !== 'all') params.set('category', newFilters.category);
    if (newFilters.priceRange !== 'all') params.set('price', newFilters.priceRange);
    if (newFilters.sort !== 'latest') params.set('sort', newFilters.sort);
    if (newFilters.search) params.set('search', newFilters.search);
    
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const filteredProducts = products.filter(product => {
    if (filters.category !== 'all' && product.categoryId.toString() !== filters.category) {
      return false;
    }
    
    const price = product.price;
    if (price < filters.minPrice || price > filters.maxPrice) {
      return false;
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.categoryName.toLowerCase().includes(searchTerm)
      );
    }
    
    return true;
  }).sort((a, b) => {
    switch (filters.sort) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="products-grid">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="product-card skeleton">
            <div className="product-image-wrapper skeleton"></div>
            <div className="product-info">
              <div className="skeleton" style={{ height: '24px', width: '80%', marginBottom: '8px' }}></div>
              <div className="skeleton" style={{ height: '16px', width: '60%', marginBottom: '16px' }}></div>
              <div className="skeleton" style={{ height: '32px', width: '40%' }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="products-page">
      

{/* Hero Section */}
<div className="products-hero" style={{
  backgroundImage: "url('https://www.giva.co/cdn/shop/files/web_copy_2-min_8f3cf049-cbcf-4b35-9631-ac3bb2e07373.jpg?v=1736756469&width=1500')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  position: 'relative'
}}>
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)' // Dark overlay
  }}></div>
  <div className="container" style={{ position: 'relative', zIndex: 1 }}>
    <h1 className="hero-title">Our Collection</h1>
    <p className="hero-description">
      Discover our exquisite collection of handcrafted jewellery pieces, 
      designed to make every moment special.
    </p>
  </div>
</div>

      <div className="container">
        <div className="row g-4">
          {/* Filters Panel */}
          <div className="col-lg-3">
            <div className={`filters-panel ${showFilters ? 'show' : ''}`}>
              <div className="d-flex d-lg-none justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Filters</h5>
                <button 
                  className="btn-close" 
                  onClick={() => setShowFilters(false)}
                ></button>
              </div>

              <div className="filter-section">
                <h6 className="filter-title">Categories</h6>
                {CATEGORIES.map((category) => (
                  <div className="form-check mb-2" key={category.id}>
                    <input
                      type="radio"
                      className="form-check-input"
                      name="category"
                      id={`cat-${category.id}`}
                      checked={filters.category === category.id.toString()}
                      onChange={() => handleFilterChange('category', category.id.toString())}
                    />
                    <label className="form-check-label" htmlFor={`cat-${category.id}`}>
                      <i className={`bi ${category.icon} me-2`}></i>
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>

              <div className="filter-section">
                <h6 className="filter-title">Price Range</h6>
                <div className="price-range-slider">
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="10000"
                    step="100"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                  <div className="d-flex justify-content-between">
                    <span>{formatPrice(0)}</span>
                    <span>{formatPrice(filters.maxPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-lg-9">
            {/* Results Summary */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <p className="mb-0">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary d-lg-none"
                  onClick={() => setShowFilters(true)}
                >
                  <i className="bi bi-funnel me-2"></i>
                  Filters
                </button>
                <select
                  className="form-select w-auto"
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <option value="latest">Latest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-search display-1 text-muted mb-3"></i>
                <h4>No products found</h4>
                <p className="text-muted">Try adjusting your search or filter criteria</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setFilters({
                      category: 'all',
                      priceRange: 'all',
                      sort: 'latest',
                      search: '',
                      minPrice: 0,
                      maxPrice: 10000
                    });
                    updateURL({
                      category: 'all',
                      priceRange: 'all',
                      sort: 'latest',
                      search: ''
                    });
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Button */}
      <button
        className="btn btn-primary rounded-pill px-4 py-2 filters-mobile-button d-lg-none"
        onClick={() => setShowFilters(true)}
      >
        <i className="bi bi-funnel me-2"></i>
        Filters
      </button>

      {/* Filters Backdrop */}
      {showFilters && (
        <div
          className="modal-backdrop fade show d-lg-none"
          onClick={() => setShowFilters(false)}
        ></div>
      )}
    </div>
  );
};

export default ProductList;