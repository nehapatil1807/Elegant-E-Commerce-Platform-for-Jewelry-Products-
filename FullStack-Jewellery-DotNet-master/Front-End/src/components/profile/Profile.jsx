import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-white py-3">
              <h4 className="mb-0">Profile Settings</h4>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-4">
                <div 
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                  style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}
                >
                  {user?.firstName?.charAt(0)}
                </div>
                <div>
                  <h5 className="mb-1">{user?.firstName} {user?.lastName}</h5>
                  <p className="text-muted mb-0">{user?.email}</p>
                </div>
              </div>

              <form>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={user?.firstName || ''}
                      disabled
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={user?.lastName || ''}
                      disabled
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={user?.email || ''}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={user?.phoneNumber || ''}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user?.role || ''}
                    disabled
                  />
                </div>

                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => toast.info('Profile editing will be available soon!')}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    'Edit Profile'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;