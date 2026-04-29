// pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorAlert from '../components/Common/ErrorAlert';
import './Profile.css';

/**
 * USER PROFILE PAGE
 * 
 * Features:
 * - View profile information
 * - Edit name and email
 * - Change password
 * - Delete account (with confirmation)
 * - Upload profile picture (bonus)
 * - Account statistics
 */

const Profile = () => {
  const { user, login } = useAuth(); // login used to refresh user data after update
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });
  
  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  // Profile picture state
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  // Initialize edit form with user data
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  /**
   * HANDLE PROFILE UPDATE
   */
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await api.patch('/auth/profile', editForm);
      
      // Update user data in context
      await login(user.email, user.password); // Re-fetch user data
      // Or update context directly
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  /**
   * HANDLE PASSWORD CHANGE
   */
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await api.patch('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setSuccess('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  /**
   * HANDLE PROFILE PICTURE UPLOAD
   */
  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setError('Profile picture must be less than 2MB');
      return;
    }
    
    const formData = new FormData();
    formData.append('avatar', file);
    
    setUploadingPicture(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setProfilePicture(response.data.url);
      setSuccess('Profile picture updated!');
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload picture');
    } finally {
      setUploadingPicture(false);
    }
  };

  /**
   * HANDLE ACCOUNT DELETION
   * 
   * DANGER: This is irreversible
   * Deletes all user data, photos, albums from both DB and Cloudinary
   */
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
      setError('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }
    
    setLoading(true);
    
    try {
      await api.delete('/auth/account');
      
      // Log out user
      localStorage.clear();
      window.location.href = '/login';
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete account');
      setLoading(false);
    }
  };

  if (!user) return <LoadingSpinner />;

  return (
    <div className="profile-page">
      {/* Success/Error Messages */}
      {success && <div className="success-alert">{success}</div>}
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="avatar-section">
            <div className="avatar-wrapper">
              {profilePicture || user.avatar ? (
                <img
                  src={profilePicture || user.avatar}
                  alt={user.name}
                  className="avatar-large"
                />
              ) : (
                <div className="avatar-placeholder">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              
              <label className="avatar-upload-btn">
                📷
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  disabled={uploadingPicture}
                  hidden
                />
              </label>
            </div>
            
            <div className="profile-title">
              <h1>{user.name}</h1>
              <p className="user-email">{user.email}</p>
              <p className="member-since">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Account Information Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Account Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-edit"
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{user.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Account ID:</span>
                  <span className="info-value mono">{user.id}</span>
                </div>
              </div>
            )}
          </div>

          {/* Security Card */}
          <div className="profile-card">
            <h2>Security</h2>
            
            <div className="security-options">
              <div className="security-option">
                <div>
                  <h3>Change Password</h3>
                  <p className="option-description">
                    Update your password to keep your account secure
                  </p>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="btn-secondary"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Account Statistics Card */}
          <div className="profile-card">
            <h2>Account Statistics</h2>
            
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">{user._count?.albums || 0}</div>
                <div className="stat-label">Albums Created</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{user._count?.photos || 0}</div>
                <div className="stat-label">Photos Uploaded</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  {((user._count?.photos || 0) * 2.5).toFixed(1)} MB
                </div>
                <div className="stat-label">Storage Used</div>
              </div>
            </div>
          </div>

          {/* Danger Zone Card */}
          <div className="profile-card danger-zone">
            <h2>Danger Zone</h2>
            
            <div className="danger-option">
              <div>
                <h3>Delete Account</h3>
                <p className="option-description">
                  Permanently delete your account and all associated data.
                  This action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn-danger"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Password</h2>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
                ×
              </button>
            </div>
            
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value
                  })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value
                  })}
                  required
                />
                <small>Minimum 6 characters</small>
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value
                  })}
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal danger-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚠️ Delete Account</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <p className="warning-text">
                This action is <strong>permanent and cannot be undone</strong>.
              </p>
              <p>Deleting your account will:</p>
              <ul>
                <li>Delete all your photos from Cloudinary</li>
                <li>Remove all your albums and data</li>
                <li>Permanently erase your account information</li>
              </ul>
              
              <div className="confirm-input">
                <label>
                  Type <strong>DELETE MY ACCOUNT</strong> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE MY ACCOUNT"
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading || deleteConfirmText !== 'DELETE MY ACCOUNT'}
                className="btn-danger"
              >
                {loading ? 'Deleting...' : 'Permanently Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;