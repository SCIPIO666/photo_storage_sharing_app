// components/Photo/PhotoGrid.jsx
import React, { useState } from 'react';
import { photoService } from '../../services/photoService';
import './PhotoGrid.css';

/**
 * PHOTO GRID COMPONENT
 * 
 * Displays photos in either grid or list view
 * Supports selection mode, deletion, and full-size preview
 */
const PhotoGrid = ({ photos, viewMode, selectedPhotos, onToggleSelect, onDelete }) => {
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  /**
   * FORMAT FILE SIZE FOR DISPLAY
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * FORMAT DATE
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleDelete = async (photoId) => {
    if (!window.confirm('Delete this photo?')) return;
    
    setDeletingId(photoId);
    try {
      await photoService.deletePhotos([photoId]);
      if (onDelete) onDelete(photoId);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete photo');
    } finally {
      setDeletingId(null);
    }
  };

  if (viewMode === 'grid') {
    return (
      <>
        <div className="photo-grid">
          {photos.map(photo => (
            <div
              key={photo.id}
              className={`photo-grid-item ${selectedPhotos.has(photo.id) ? 'selected' : ''}`}
            >
              {/* Selection Checkbox */}
              <div className="photo-select">
                <input
                  type="checkbox"
                  checked={selectedPhotos.has(photo.id)}
                  onChange={() => onToggleSelect(photo.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Image */}
              <img
                src={photo.url}
                alt={photo.filename}
                onClick={() => setPreviewPhoto(photo)}
                loading="lazy"
              />

              {/* Overlay with actions on hover */}
              <div className="photo-overlay">
                <button
                  className="photo-action preview-btn"
                  onClick={() => setPreviewPhoto(photo)}
                  title="Preview"
                >
                  🔍
                </button>
                <button
                  className="photo-action delete-btn"
                  onClick={() => handleDelete(photo.id)}
                  disabled={deletingId === photo.id}
                  title="Delete"
                >
                  {deletingId === photo.id ? '...' : '🗑️'}
                </button>
              </div>

              {/* Photo Info */}
              <div className="photo-info">
                <div className="photo-filename" title={photo.filename}>
                  {photo.filename}
                </div>
                <div className="photo-meta">
                  {formatFileSize(photo.size)} • {formatDate(photo.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Preview Modal */}
        {previewPhoto && (
          <div className="lightbox" onClick={() => setPreviewPhoto(null)}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button className="lightbox-close" onClick={() => setPreviewPhoto(null)}>
                ×
              </button>
              <img src={previewPhoto.url} alt={previewPhoto.filename} />
              <div className="lightbox-info">
                <h3>{previewPhoto.filename}</h3>
                <p>Size: {formatFileSize(previewPhoto.size)}</p>
                <p>Uploaded: {new Date(previewPhoto.createdAt).toLocaleString()}</p>
                <p>Type: {previewPhoto.mimeType}</p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // List View
  return (
    <div className="photo-list">
      <table className="photo-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}>
              <input
                type="checkbox"
                checked={selectedPhotos.size === photos.length && photos.length > 0}
                onChange={() => {
                  if (selectedPhotos.size === photos.length) {
                    selectedPhotos.clear();
                    photos.forEach(p => onToggleSelect(p.id));
                  } else {
                    photos.forEach(p => {
                      if (!selectedPhotos.has(p.id)) onToggleSelect(p.id);
                    });
                  }
                }}
              />
            </th>
            <th>Preview</th>
            <th>Filename</th>
            <th>Size</th>
            <th>Album</th>
            <th>Uploaded</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {photos.map(photo => (
            <tr key={photo.id} className={selectedPhotos.has(photo.id) ? 'selected-row' : ''}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedPhotos.has(photo.id)}
                  onChange={() => onToggleSelect(photo.id)}
                />
              </td>
              <td>
                <img
                  src={photo.url}
                  alt={photo.filename}
                  className="list-thumbnail"
                  onClick={() => setPreviewPhoto(photo)}
                  style={{ cursor: 'pointer' }}
                />
              </td>
              <td className="filename-cell">{photo.filename}</td>
              <td>{formatFileSize(photo.size)}</td>
              <td>{photo.album?.name || 'Unknown Album'}</td>
              <td>{formatDate(photo.createdAt)}</td>
              <td>
                <button
                  className="action-btn preview"
                  onClick={() => setPreviewPhoto(photo)}
                  title="Preview"
                >
                  👁️
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => handleDelete(photo.id)}
                  disabled={deletingId === photo.id}
                  title="Delete"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Lightbox Preview (same as grid view) */}
      {previewPhoto && (
        <div className="lightbox" onClick={() => setPreviewPhoto(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setPreviewPhoto(null)}>
              ×
            </button>
            <img src={previewPhoto.url} alt={previewPhoto.filename} />
            <div className="lightbox-info">
              <h3>{previewPhoto.filename}</h3>
              <p>Size: {formatFileSize(previewPhoto.size)}</p>
              <p>Uploaded: {new Date(previewPhoto.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;