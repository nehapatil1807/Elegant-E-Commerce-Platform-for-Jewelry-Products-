import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/authService';
import ErrorMessage from '../common/ErrorMessage';
import './auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const validateEmail = (email) => {
    if (!email) {
      return 'Email is required';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTouched(true);

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    try {
      setLoading(true);
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        setSuccess(true);
        toast.success('Password reset instructions sent to your email');
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="auth-card card">
                <div className="card-body p-4">
                  <div className="auth-success">
                    <i className="bi bi-envelope-check success-icon"></i>
                    <h2 className="auth-title">Check Your Email</h2>
                    <p className="auth-subtitle">
                      We've sent password reset instructions to your email address.
                      Please check your inbox and follow the instructions.
                    </p>
                    <Link to="/login" className="btn btn-primary w-100">
                      Return to Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="auth-card card">
              <div className="card-body p-4">
                <div className="auth-header">
                  <h2 className="auth-title">Forgot Password?</h2>
                  <p className="auth-subtitle">
                    Enter your email address and we'll send you instructions 
                    to reset your password.
                  </p>
                </div>

                <ErrorMessage message={error} />

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      className={`form-control ${touched && error ? 'is-invalid' : 
                        touched && !error ? 'is-valid' : ''}`}
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched(true)}
                      placeholder="Enter your email"
                      disabled={loading}
                      required
                      autoFocus
                    />
                    {touched && error && (
                      <div className="invalid-feedback">{error}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className={`btn btn-primary w-100 ${loading ? 'loading-btn' : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </button>

                  <div className="auth-links">
                    <Link to="/login" className="d-flex align-items-center justify-content-center gap-2">
                      <i className="bi bi-arrow-left"></i>
                      Back to Login
                    </Link>
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

export default ForgotPassword;