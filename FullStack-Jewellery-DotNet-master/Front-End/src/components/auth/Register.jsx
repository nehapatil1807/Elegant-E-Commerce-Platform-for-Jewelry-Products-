import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../common/ErrorMessage';
import PasswordInput from '../common/PasswordInput';
import './auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'User'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const validateField = (name, value, allValues = formData) => {
    let fieldError = '';
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          fieldError = `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        } else if (value.length < 2) {
          fieldError = `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        } else if (/\d/.test(value)) {
          fieldError = `${name === 'firstName' ? 'First' : 'Last'} name cannot contain numbers`;
        } else if (!/^[a-zA-Z\s]*$/.test(value)) {
          fieldError = `${name === 'firstName' ? 'First' : 'Last'} name can only contain letters`;
        }
        break;

      case 'email':
        if (!value) {
          fieldError = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          fieldError = 'Please enter a valid email address';
        }
        break;

      case 'phoneNumber':
        const phoneDigits = value.replace(/\D/g, '');
        if (!value) {
          fieldError = 'Phone number is required';
        } else if (!/^[789]\d{9}$/.test(phoneDigits)) {
          fieldError = 'Please enter a valid 10-digit phone number starting with 7, 8, or 9';
        }
        break;

        case 'password':
          if (!value) {
            fieldError = 'Password is required';
          } else if (value.length < 8 || value.length > 128) {
            fieldError = 'Password must be between 8 and 128 characters';
          } else if (!/\d/.test(value)) {
            fieldError = 'Password must contain at least one number';
          } else if (!/[a-z]/.test(value)) {
            fieldError = 'Password must contain at least one lowercase letter';
          } else if (!/[A-Z]/.test(value)) {
            fieldError = 'Password must contain at least one uppercase letter';
          } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            fieldError = 'Password must contain at least one special character';
          } else if (/(.)\1{2,}/.test(value)) {
            fieldError = 'Password cannot contain repeated characters more than twice in a row';
          } else if (/^[A-Za-z]+$|^\d+$/.test(value)) {
            fieldError = 'Password cannot consist of only letters or only numbers';
          }
          break;
      case 'confirmPassword':
        if (!value) {
          fieldError = 'Please confirm your password';
        } else if (value !== allValues.password) {
          fieldError = 'Passwords do not match';
        }
        break;

      default:
        break;
    }
    return fieldError;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNumber') {
      // Format phone number
      const cleaned = value.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{0,5})(\d{0,5})$/);
      const formatted = match ? match[1] + (match[2] ? '-' + match[2] : '') : cleaned;
      
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));

      // Update confirm password validation when password changes
      if (name === 'password' && touched.confirmPassword) {
        const confirmError = validateField('confirmPassword', formData.confirmPassword, {
          ...formData,
          [name]: value
        });
        setErrors(prev => ({
          ...prev,
          confirmPassword: confirmError
        }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const isFormValid = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'role') {
        const fieldError = validateField(key, formData[key]);
        if (fieldError) {
          newErrors[key] = fieldError;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Mark all fields as touched
    const touchedFields = {};
    Object.keys(formData).forEach(key => {
      touchedFields[key] = true;
    });
    setTouched(touchedFields);

    if (!isFormValid()) {
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registrationData } = formData;
      const result = await register(registrationData);
      if (result.success) {
        navigate('/products');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    if (!/\d/.test(password) || !/[a-z]/.test(password) || !/[A-Z]/.test(password)) return 'medium';
    return 'strong';
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="auth-card card">
              <div className="card-body p-4">
                <div className="auth-header">
                  <h2 className="auth-title">Create an Account</h2>
                  <p className="auth-subtitle">Fill in your details to get started</p>
                </div>

                <ErrorMessage message={error} />

                <form onSubmit={handleSubmit} noValidate className="auth-form">
                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label htmlFor="firstName" className="form-label">First Name</label>
                      <input
                        type="text"
                        className={`form-control ${touched.firstName && errors.firstName ? 'is-invalid' : 
                          touched.firstName && !errors.firstName ? 'is-valid' : ''}`}
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your first name"
                        autoFocus
                      />
                      {touched.firstName && errors.firstName && (
                        <div className="invalid-feedback">{errors.firstName}</div>
                      )}
                    </div>

                    <div className="col-md-6 form-group">
                      <label htmlFor="lastName" className="form-label">Last Name</label>
                      <input
                        type="text"
                        className={`form-control ${touched.lastName && errors.lastName ? 'is-invalid' : 
                          touched.lastName && !errors.lastName ? 'is-valid' : ''}`}
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your last name"
                      />
                      {touched.lastName && errors.lastName && (
                        <div className="invalid-feedback">{errors.lastName}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${touched.email && errors.email ? 'is-invalid' : 
                        touched.email && !errors.email ? 'is-valid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your email address"
                      autoComplete="email"
                    />
                    {touched.email && errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className={`form-control ${touched.phoneNumber && errors.phoneNumber ? 'is-invalid' : 
                        touched.phoneNumber && !errors.phoneNumber ? 'is-valid' : ''}`}
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your phone number"
                    />
                    {touched.phoneNumber && errors.phoneNumber && (
                      <div className="invalid-feedback">{errors.phoneNumber}</div>
                    )}
                  </div>

                  <PasswordInput
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                    touched={touched.password}
                    label="Create Password"
                    placeholder="Create a strong password"
                  />

                  {formData.password && (
                    <div className="password-strength">
                      <div className={`strength-bar ${passwordStrength}`} />
                      <span className="strength-text">{passwordStrength}</span>
                    </div>
                  )}

                  <PasswordInput
                    name="confirmPassword"
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                    placeholder="Confirm your password"
                  />

                  <button
                    type="submit"
                    className={`btn btn-primary w-100 ${loading ? 'loading-btn' : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  <div className="auth-links">
                    <p className="mb-0">
                      Already have an account?{' '}
                      <Link to="/login">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;