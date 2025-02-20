import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/authService';
import ErrorMessage from '../common/ErrorMessage';
import PasswordInput from '../common/PasswordInput';
import './auth.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    if (!/\d/.test(password) || !/[a-z]/.test(password) || !/[A-Z]/.test(password)) return 'medium';
    return 'strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTouched({ password: true, confirmPassword: true });

    // Validate token
    if (!token) {
      setError('Invalid reset token');
      return;
    }

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.resetPassword(token, formData.password);
      
      if (response.success) {
        toast.success('Password has been reset successfully');
        navigate('/login');
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="auth-card card">
                <div className="card-body p-4">
                  <div className="auth-success">
                    <i className="bi bi-exclamation-circle text-danger display-1"></i>
                    <h2 className="auth-title">Invalid Link</h2>
                    <p className="auth-subtitle">
                      This password reset link is invalid or has expired.
                      Please request a new password reset link.
                    </p>
                    <Link to="/forgot-password" className="btn btn-primary w-100">
                      Request New Link
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
                  <h2 className="auth-title">Reset Password</h2>
                  <p className="auth-subtitle">Enter your new password below</p>
                </div>

                <ErrorMessage message={error} />

                <form onSubmit={handleSubmit} className="auth-form">
                  <PasswordInput
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="password"
                    label="New Password"
                    placeholder="Enter new password"
                    error={touched.password && validatePassword(formData.password)}
                    touched={touched.password}
                  />

                  {formData.password && (
                    <div className="password-strength">
                      <div className={`strength-bar ${getPasswordStrength(formData.password)}`} />
                      <span className="strength-text">{getPasswordStrength(formData.password)}</span>
                    </div>
                  )}

                  <PasswordInput
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    error={touched.confirmPassword && formData.password !== formData.confirmPassword ? 
                      'Passwords do not match' : ''}
                    touched={touched.confirmPassword}
                  />

                  <button
                    type="submit"
                    className={`btn btn-primary w-100 ${loading ? 'loading-btn' : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Resetting Password...
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

export default ResetPassword;