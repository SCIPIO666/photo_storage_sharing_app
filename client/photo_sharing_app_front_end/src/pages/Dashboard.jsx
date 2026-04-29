// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { photoService } from '../services/photoService';
import { albumService } from '../services/albumService';
import PhotoGrid from '../components/PhotoGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchAllPhotos();
    fetchAlbums();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [photos, searchTerm, selectedAlbum, sortBy]);

  const fetchAllPhotos = async () => {
    setLoading(true);
    try {
      const albumsRes = await albumService.getUserAlbums();
      const userAlbums = albumsRes.data || [];
      setAlbums(userAlbums);

      let allPhotos = [];
      for (const album of userAlbums) {
        try {
          const photosRes = await photoService.getAlbumPhotos(album.id);
          if (photosRes.data) {
            allPhotos = [...allPhotos, ...photosRes.data];
          }
        } catch (err) {
          console.error(`Failed to fetch photos for album ${album.id}:`, err);
        }
      }
      setPhotos(allPhotos);
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await albumService.getUserAlbums();
      setAlbums(res.data || []);
    } catch (error) {
      console.error('Failed to fetch albums:', error);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...photos];

    if (selectedAlbum !== 'all') {
      result = result.filter(photo => photo.albumId === selectedAlbum);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(photo => 
        photo.filename?.toLowerCase().includes(term)
      );
    }

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
      case 'az':
        result.sort((a, b) => (a.filename || '').localeCompare(b.filename || ''));
        break;
      default:
        break;
    }

    setFilteredPhotos(result);
  };

  const toggleSelectPhoto = (photoId) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  const selectAllPhotos = () => {
    if (selectedPhotos.size === filteredPhotos.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(filteredPhotos.map(p => p.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedPhotos.size === 0) return;
    
    const confirmed = window.confirm(
      `Delete ${selectedPhotos.size} photo(s)? This action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    setDeleting(true);
    try {
      const photoIds = Array.from(selectedPhotos);
      await photoService.deletePhotos(photoIds);
      setPhotos(photos.filter(p => !selectedPhotos.has(p.id)));
      setSelectedPhotos(new Set());
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete photos');
    } finally {
      setDeleting(false);
    }
  };

  const handleSingleDelete = async (photoId) => {
    if (!window.confirm('Delete this photo?')) return;
    
    try {
      await photoService.deletePhotos([photoId]);
      setPhotos(photos.filter(p => p.id !== photoId));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete photo');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const totalStorage = photos.reduce((sum, p) => sum + (p.size || 0), 0);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-gray-600 text-lg">
          You have <span className="font-semibold text-blue-600">{photos.length}</span> photo(s) in your library
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Photos</p>
              <p className="text-3xl font-bold text-blue-600">{photos.length}</p>
            </div>
            <div className="text-4xl">📸</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Albums</p>
              <p className="text-3xl font-bold text-green-600">{albums.length}</p>
            </div>
            <div className="text-4xl">📁</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Storage Used</p>
              <p className="text-3xl font-bold text-purple-600">
                {(totalStorage / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
            <div className="text-4xl">💾</div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search photos by filename..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Filters */}
          <select
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="largest">Largest Size</option>
            <option value="az">A-Z by Name</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedPhotos.size > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="text-white font-semibold">
              {selectedPhotos.size} photo(s) selected
            </div>
            <div className="flex gap-3">
              <button
                onClick={selectAllPhotos}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition font-medium"
              >
                {selectedPhotos.size === filteredPhotos.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                onClick={handleDeleteSelected}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : `Delete Selected (${selectedPhotos.size})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Grid */}
      <PhotoGrid
        photos={filteredPhotos}
        selectedPhotos={selectedPhotos}
        onToggleSelect={toggleSelectPhoto}
        onDelete={handleSingleDelete}
        formatFileSize={formatFileSize}
      />
    </div>
  );
};

export default Dashboard;