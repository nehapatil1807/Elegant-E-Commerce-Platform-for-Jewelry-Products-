import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { formatPrice } from '../../utils/formatters';
import { toast } from 'react-toastify';
import Loading from '../common/Loading';
import './Checkout.css';

const PAYMENT_METHODS = [
  { id: 'COD', name: 'Cash on Delivery', icon: 'bi-cash', description: 'Pay when you receive your order' },
  { id: 'UPI', name: 'UPI Payment', icon: 'bi-phone', description: 'Pay via UPI', disabled: true },
  { id: 'CARD', name: 'Credit/Debit Card', icon: 'bi-credit-card', description: 'Pay with your card', disabled: true }
];

const STEPS = [
  { key: 'shipping', label: 'Shipping', icon: 'bi-truck' },
  { key: 'payment', label: 'Payment', icon: 'bi-credit-card' },
  { key: 'review', label: 'Review', icon: 'bi-list-check' }
];

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { createOrder } = useOrders();
  const [activeStep, setActiveStep] = useState('shipping');
  const [processing, setProcessing] = useState(false);
  const [pincodeLookup, setPincodeLookup] = useState({ loading: false, data: null });

  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    // Only check cart on initial mount
    if (!cartLoading && (!cart?.items?.length)) {
      toast.error('Your cart is empty');
      navigate('/cart', { replace: true }); // Using replace to prevent back navigation to empty checkout
    }
  }, []);

  const validatePincode = async (pincode) => {
    if (pincode.length === 6) {
      setPincodeLookup({ loading: true, data: null });
      try {
        // Simulated API call - in real app, replace with actual pincode validation API
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (['400001', '400002', '400003'].includes(pincode)) {
          setPincodeLookup({
            loading: false,
            data: {
              city: 'Mumbai',
              state: 'Maharashtra',
              serviceable: true
            }
          });
          setShippingDetails(prev => ({
            ...prev,
            city: 'Mumbai',
            state: 'Maharashtra'
          }));
          setErrors(prev => ({ ...prev, pincode: '' }));
        } else {
          setPincodeLookup({
            loading: false,
            data: { serviceable: false }
          });
          setErrors(prev => ({
            ...prev,
            pincode: 'Delivery not available at this pincode'
          }));
        }
      } catch (error) {
        setPincodeLookup({ loading: false, data: null });
        setErrors(prev => ({
          ...prev,
          pincode: 'Error validating pincode'
        }));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Only allow digits
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      // Format as 5-5 only if we have enough digits
      let formatted = cleaned;
      if (cleaned.length > 5) {
        formatted = cleaned.slice(0, 5) + '-' + cleaned.slice(5);
      }
      setShippingDetails(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'pincode') {
      const cleaned = value.replace(/\D/g, '').slice(0, 6);
      setShippingDetails(prev => ({ ...prev, [name]: cleaned }));
      if (cleaned.length === 6) {
        validatePincode(cleaned);
      } else {
        setPincodeLookup({ loading: false, data: null });
      }
    } else {
      setShippingDetails(prev => ({ ...prev, [name]: value }));
    }

    // Validate field immediately
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          newErrors[name] = 'Full name is required';
        } else if (value.length < 3) {
          newErrors[name] = 'Name must be at least 3 characters';
        } else {
          delete newErrors[name];
        }
        break;

      case 'phone':
        const cleanedPhone = value.replace(/\D/g, '');
        if (!value) {
          newErrors[name] = 'Phone number is required';
        } else if (!/^[789]\d{9}$/.test(cleanedPhone)) {
          newErrors[name] = 'Enter valid 10-digit phone number starting with 7, 8, or 9';
        } else {
          delete newErrors[name];
        }
        break;

      case 'addressLine1':
        if (!value.trim()) {
          newErrors[name] = 'Address is required';
        } else if (value.length < 10) {
          newErrors[name] = 'Please enter complete address';
        } else {
          delete newErrors[name];
        }
        break;

      case 'pincode':
        if (!value) {
          newErrors[name] = 'Pincode is required';
        } else if (!/^\d{6}$/.test(value)) {
          newErrors[name] = 'Enter valid 6-digit pincode';
        } else if (pincodeLookup.data?.serviceable === false) {
          newErrors[name] = 'Delivery not available at this pincode';
        } else {
          delete newErrors[name];
        }
        break;

      case 'city':
      case 'state':
        if (!value.trim()) {
          newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        } else {
          delete newErrors[name];
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validateForm = () => {
    let isValid = true;
    const requiredFields = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    
    requiredFields.forEach(field => {
      const value = shippingDetails[field];
      if (!validateField(field, value)) {
        isValid = false;
      }
      setTouched(prev => ({ ...prev, [field]: true }));
    });

    return isValid;
  };

  const handleStepSubmit = () => {
    switch (activeStep) {
      case 'shipping':
        if (validateForm()) {
          setActiveStep('payment');
        }
        break;
      case 'payment':
        setActiveStep('review');
        break;
      case 'review':
        handlePlaceOrder();
        break;
      default:
        break;
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setProcessing(true);
      // Remove hyphens from phone number before sending
      const formattedShippingDetails = {
        ...shippingDetails,
        phone: shippingDetails.phone.replace(/-/g, '')
      };
      
      const orderData = {
        shippingDetails: formattedShippingDetails,
        paymentMethod
      };
  
      const result = await createOrder(orderData);
      
      if (result.success) {
        // Show success toast first
        toast.success('Order placed successfully');
        
        // Wait a brief moment for the cart to clear
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Navigate to order tracking
        navigate(`/order-tracking/${result.order.id}`);
      } else {
        toast.error(result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Error placing order');
    } finally {
      setProcessing(false);
    }
  };

  const getStepStatus = (stepKey) => {
    const stepIndex = STEPS.findIndex(s => s.key === stepKey);
    const currentIndex = STEPS.findIndex(s => s.key === activeStep);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  if (cartLoading) return <Loading />;

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Checkout Steps */}
        <div className="checkout-steps">
          {STEPS.map((step, index) => {
            const status = getStepStatus(step.key);
            return (
              <div key={step.key} className="checkout-step">
                <div className={`step-indicator ${status}`}>
                  <i className={`bi ${step.icon}`}></i>
                </div>
                <div className="step-label">{step.label}</div>
                {index < STEPS.length - 1 && (
                  <div className={`step-line ${status === 'completed' ? 'completed' : ''}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* Shipping Form */}
            {activeStep === 'shipping' && (
              <div className="checkout-section">
                <h5 className="section-title">Shipping Details</h5>
                <div className="address-form">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className={`form-control ${touched.fullName && errors.fullName ? 'is-invalid' : ''}`}
                        name="fullName"
                        value={shippingDetails.fullName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Enter your full name"
                      />
                      {touched.fullName && errors.fullName && (
                        <div className="invalid-feedback">{errors.fullName}</div>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className={`form-control ${touched.phone && errors.phone ? 'is-invalid' : ''}`}
                        name="phone"
                        value={shippingDetails.phone}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Enter 10-digit phone number"
                      />
                      {touched.phone && errors.phone && (
                        <div className="invalid-feedback">{errors.phone}</div>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label">Address Line 1</label>
                      <input
                        type="text"
                        className={`form-control ${touched.addressLine1 && errors.addressLine1 ? 'is-invalid' : ''}`}
                        name="addressLine1"
                        value={shippingDetails.addressLine1}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="House/Flat No., Building Name, Street"
                      />
                      {touched.addressLine1 && errors.addressLine1 && (
                        <div className="invalid-feedback">{errors.addressLine1}</div>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label">Address Line 2 (Optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="addressLine2"
                        value={shippingDetails.addressLine2}
                        onChange={handleInputChange}
                        placeholder="Landmark, Area (optional)"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Pincode</label>
                      <div className="pincode-input">
                        <input
                          type="text"
                          className={`form-control ${touched.pincode && errors.pincode ? 'is-invalid' : ''}`}
                          name="pincode"
                          value={shippingDetails.pincode}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          placeholder="6-digit pincode"
                        />
                        {pincodeLookup.loading && (
                          <div className="pincode-spinner">
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        )}
                        {touched.pincode && errors.pincode && (
                          <div className="invalid-feedback">{errors.pincode}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className={`form-control ${touched.city && errors.city ? 'is-invalid' : ''}`}
                        name="city"
                        value={shippingDetails.city}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Enter city"
                        readOnly={pincodeLookup.data?.city}
                      />
                      {touched.city && errors.city && (
                        <div className="invalid-feedback">{errors.city}</div>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className={`form-control ${touched.state && errors.state ? 'is-invalid' : ''}`}
                        name="state"
                        value={shippingDetails.state}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Enter state"
                        readOnly={pincodeLookup.data?.state}
                      />
                      {touched.state && errors.state && (
                        <div className="invalid-feedback">{errors.state}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Methods */}
            {activeStep === 'payment' && (
              <div className="checkout-section">
                <h5 className="section-title">Payment Method</h5>
                {PAYMENT_METHODS.map(method => (
                  <div
                    key={method.id}
                    className={`payment-method ${method.disabled ? 'disabled' : ''} ${paymentMethod === method.id ? 'selected' : ''}`}
                    onClick={() => !method.disabled && setPaymentMethod(method.id)}
                  >
                    <div className="payment-method-header">
                      <i className={`bi ${method.icon} payment-method-icon`}></i>
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{method.name}</h6>
                        <small className="text-muted">
                          {method.disabled ? 'Coming soon' : method.description}
                        </small>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          checked={paymentMethod === method.id}
                          disabled={method.disabled}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Order Review */}
            {activeStep === 'review' && (
              <div className="checkout-section">
                <h5 className="section-title">Order Review</h5>
                
                {/* Shipping Details Summary */}
                <div className="mb-4">
                  <h6 className="mb-3">Shipping Details</h6>
                  <div className="card">
                    <div className="card-body">
                      <p className="mb-1">{shippingDetails.fullName}</p>
                      <p className="mb-1">{shippingDetails.addressLine1}</p>
                      {shippingDetails.addressLine2 && (
                        <p className="mb-1">{shippingDetails.addressLine2}</p>
                      )}
                      <p className="mb-1">
                        {shippingDetails.city}, {shippingDetails.state} {shippingDetails.pincode}
                      </p>
                      <p className="mb-0">Phone: {shippingDetails.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items Summary */}
                <div className="mb-4">
                  <h6 className="mb-3">Order Items</h6>
                  {cart?.items.map((item) => (
                    <div key={item.productId} className="order-item">
                      <div className="order-item-image">
                        <img
                          src={item.imageUrl || '/placeholder.jpg'}
                          alt={item.productName}
                          onError={(e) => { e.target.src = '/placeholder.jpg' }}
                        />
                      </div>
                      <div className="order-item-details">
                        <div className="order-item-name">{item.productName}</div>
                        <div className="order-item-meta">
                          Quantity: {item.quantity} × {formatPrice(item.productPrice)}
                        </div>
                      </div>
                      <div className="text-end">
                        <strong>{formatPrice(item.subtotal)}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment Method Summary */}
                <div>
                  <h6 className="mb-3">Payment Method</h6>
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <i className={`bi ${PAYMENT_METHODS.find(m => m.id === paymentMethod)?.icon} fs-4 me-3`}></i>
                        <div>
                          <h6 className="mb-0">{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name}</h6>
                          <small className="text-muted">Pay when you receive your order</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="col-lg-4">
            <div className="checkout-section">
              <h5 className="section-title">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({cart?.items?.length} items)</span>
                <span>{formatPrice(cart?.totalAmount)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>Total</strong>
                <strong>{formatPrice(cart?.totalAmount)}</strong>
              </div>

              <div className="action-buttons">
                {activeStep !== 'shipping' && (
                  <button
                    className="btn-back"
                    onClick={() => {
                      const currentIndex = STEPS.findIndex(s => s.key === activeStep);
                      setActiveStep(STEPS[currentIndex - 1].key);
                    }}
                  >
                    <i className="bi bi-arrow-left"></i>
                    Back
                  </button>
                )}

                <button
                  className={`btn btn-primary flex-grow-1 ${processing ? 'loading-btn' : ''}`}
                  onClick={handleStepSubmit}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <span className="spinner-border spinner-border-sm"></span>
                      Processing...
                    </>
                  ) : activeStep === 'review' ? (
                    'Place Order'
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;