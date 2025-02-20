import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../common/ErrorMessage';
import PasswordInput from '../common/PasswordInput';
import './auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateField = (name, value) => {
    let fieldError = '';
    switch (name) {
      case 'email':
        if (!value) {
          fieldError = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          fieldError = 'Please enter a valid email';
        }
        break;
      case 'password':
        if (!value) {
          fieldError = 'Password is required';
        } else if (value.length < 6) {
          fieldError = 'Password must be at least 6 characters';
        }
        break;
      default:
        break;
    }
    return fieldError;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
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
      const fieldError = validateField(key, formData[key]);
      if (fieldError) {
        newErrors[key] = fieldError;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    if (!isFormValid()) {
      return;
    }
  
    setLoading(true);
    try {
      const result = await login(formData);
      if (result.success) {
        navigate(result.user.role === 'Admin' ? '/admin/dashboard' : '/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="auth-card card">
              <div className="card-body p-4">
                <div className="auth-header">
                  <h2 className="auth-title">Welcome Back!</h2>
                  <p className="auth-subtitle">Please enter your details to sign in</p>
                </div>
                
                <ErrorMessage message={error} />
                
                <form onSubmit={handleSubmit} noValidate className="auth-form">
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
                      placeholder="Enter your email"
                      autoComplete="email"
                      autoFocus
                    />
                    {touched.email && errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <PasswordInput
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                    touched={touched.password}
                    label="Password"
                    placeholder="Enter your password"
                  />

                  <div className="text-end mb-3">
                    <Link to="/forgot-password" className="text-decoration-none">
                      Forgot Password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className={`btn btn-primary w-100 ${loading ? 'loading-btn' : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  <div className="auth-links">
                    <p className="mb-0">
                      Don't have an account?{' '}
                      <Link to="/register">
                        Create one
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

export default Login;