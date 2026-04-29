//
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { photoService } from '../services/photoService';
import { albumService } from '../services/albumService';
import PhotoGrid from '../components/Photo/PhotoGrid';
import AlbumSelector from '../components/Album/AlbumSelector';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorAlert from '../components/Common/ErrorAlert';
import './Dashboard.css';

/**
 * DASHBOARD PAGE
 * 
 * Displays all photos uploaded by the user in a grid layout
 * Features:
 * - Fetch all user photos across all albums
 * - Bulk delete functionality
 * - Filter by album
 * - Sort options (date, size, name)
 * - Search by filename
 * - Responsive grid layout
 */

const Dashboard = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [deleting, setDeleting] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Fetch all user photos on component mount
  useEffect(() => {
    fetchAllPhotos();
    fetchUserAlbums();
  }, []);

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFiltersAndSort();
  }, [photos, selectedAlbum, searchTerm, sortBy]);

  /**
   * FETCH ALL PHOTOS FROM ALL ALBUMS
   * 
   * Challenge: Need to get photos from multiple albums
   * Solution: Fetch all user albums first, then fetch photos from each
   * Alternative: Backend endpoint GET /api/users/me/photos (we'll implement)
   */
  const fetchAllPhotos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Option 1: Fetch all albums then concatenate photos
      const albumsResponse = await albumService.getUserAlbums();
      const userAlbums = albumsResponse.data;
      
      let allPhotos = [];
      for (const album of userAlbums) {
        const photosResponse = await photoService.getAlbumPhotos(album.id);
        allPhotos = [...allPhotos, ...photosResponse.data];
      }
      
      setPhotos(allPhotos);
      setFilteredPhotos(allPhotos);
      
    } catch (err) {
      console.error('Failed to fetch photos:', err);
      setError('Failed to load your photos. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * FETCH USER ALBUMS FOR FILTER DROPDOWN
   */
  const fetchUserAlbums = async () => {
    try {
      const response = await albumService.getUserAlbums();
      setAlbums(response.data);
    } catch (err) {
      console.error('Failed to fetch albums:', err);
    }
  };

  /**
   * APPLY FILTERS AND SORTING TO PHOTOS
   * 
   * Filters:
   * - Album selection
   * - Search term (filename)
   * 
   * Sort options:
   * - Newest first (default)
   * - Oldest first
   * - Largest file size
   * - Smallest file size
   * - A-Z by filename
   */
  const applyFiltersAndSort = () => {
    let result = [...photos];
    
    // Filter by album
    if (selectedAlbum !== 'all') {
      result = result.filter(photo => photo.albumId === selectedAlbum);
    }
    
    // Filter by search term (case-insensitive)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(photo => 
        photo.filename.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'largest':
        result.sort((a, b) => b.size - a.size);
        break;
      case 'smallest':
        result.sort((a, b) => a.size - b.size);
        break;
      case 'az':
        result.sort((a, b) => a.filename.localeCompare(b.filename));
        break;
      default:
        break;
    }
    
    setFilteredPhotos(result);
  };

  /**
   * TOGGLE PHOTO SELECTION FOR BULK DELETE
   */
  const toggleSelectPhoto = (photoId) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  /**
   * SELECT ALL PHOTOS IN CURRENT VIEW
   */
  const selectAllPhotos = () => {
    const allIds = filteredPhotos.map(photo => photo.id);
    setSelectedPhotos(new Set(allIds));
  };

  /**
   * CLEAR ALL SELECTIONS
   */
  const clearSelection = () => {
    setSelectedPhotos(new Set());
  };

  /**
   * DELETE SELECTED PHOTOS
   * 
   * Shows confirmation dialog before deletion
   * Updates UI optimistically after successful deletion
   */
  const handleDeleteSelected = async () => {
    if (selectedPhotos.size === 0) {
      alert('Please select photos to delete');
      return;
    }
    
    const confirmMessage = selectedPhotos.size === 1
      ? 'Delete this photo? This action cannot be undone.'
      : `Delete ${selectedPhotos.size} photos? This action cannot be undone.`;
    
    if (!window.confirm(confirmMessage)) return;
    
    setDeleting(true);
    
    try {
      const photoIds = Array.from(selectedPhotos);
      await photoService.deletePhotos(photoIds);
      
      // Remove deleted photos from state
      const remainingPhotos = photos.filter(p => !selectedPhotos.has(p.id));
      setPhotos(remainingPhotos);
      setSelectedPhotos(new Set());
      
      // Show success message (could use toast notification)
      alert(`Successfully deleted ${photoIds.length} photo(s)`);
      
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete photos. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  /**
   * HANDLE SINGLE PHOTO DELETE (from grid component)
   */
  const handleSinglePhotoDelete = async (photoId) => {
    if (!window.confirm('Delete this photo?')) return;
    
    try {
      await photoService.deletePhotos([photoId]);
      setPhotos(photos.filter(p => p.id !== photoId));
      alert('Photo deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete photo');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1>Your Media Library</h1>
          <p className="welcome-message">
            Welcome back, {user?.name}! You have {photos.length} photo(s) in your library.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <span className="stat-value">{photos.length}</span>
            <span className="stat-label">Total Photos</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{albums.length}</span>
            <span className="stat-label">Albums</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {(photos.reduce((sum, p) => sum + p.size, 0) / (1024 * 1024)).toFixed(1)}
            </span>
            <span className="stat-label">Total MB</span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="dashboard-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Search photos by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-section">
          <select
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Albums</option>
            {albums.map(album => (
              <option key={album.id} value={album.id}>
                {album.name} ({album._count?.photos || 0})
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="largest">Largest Size</option>
            <option value="smallest">Smallest Size</option>
            <option value="az">A-Z by Name</option>
          </select>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              ⊞
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedPhotos.size > 0 && (
        <div className="bulk-actions-bar">
          <div className="selection-info">
            {selectedPhotos.size} photo(s) selected
          </div>
          <div className="bulk-buttons">
            <button onClick={selectAllPhotos} className="btn-secondary">
              Select All ({filteredPhotos.length})
            </button>
            <button onClick={clearSelection} className="btn-secondary">
              Clear
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={deleting}
              className="btn-danger"
            >
              {deleting ? 'Deleting...' : `Delete Selected (${selectedPhotos.size})`}
            </button>
          </div>
        </div>
      )}

      {/* Photo Grid/List */}
      {filteredPhotos.length === 0 ? (
        <div className="empty-state">
          {photos.length === 0 ? (
            <>
              <div className="empty-icon">📸</div>
              <h3>No photos yet</h3>
              <p>Upload your first photo to get started!</p>
            </>
          ) : (
            <>
              <div className="empty-icon">🔍</div>
              <h3>No matching photos</h3>
              <p>Try adjusting your search or filter criteria</p>
            </>
          )}
        </div>
      ) : (
        <PhotoGrid
          photos={filteredPhotos}
          viewMode={viewMode}
          selectedPhotos={selectedPhotos}
          onToggleSelect={toggleSelectPhoto}
          onDelete={handleSinglePhotoDelete}
        />
      )}
    </div>
  );
};

export default Dashboard;