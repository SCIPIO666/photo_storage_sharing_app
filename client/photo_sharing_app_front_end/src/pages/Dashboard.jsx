// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { photoService } from '../services/photoService';
import { albumService } from '../services/albumService';
import PhotoGrid from '../components/PhotoGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search } from 'lucide-react';

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
  const [viewMode] = useState('grid');
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-gray-600">
          You have {photos.length} photo(s) in your library
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{photos.length}</div>
          <div className="text-gray-600">Total Photos</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{albums.length}</div>
          <div className="text-gray-600">Albums</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">
            {(photos.reduce((sum, p) => sum + (p.size || 0), 0) / (1024 * 1024)).toFixed(1)} MB
          </div>
          <div className="text-gray-600">Total Storage</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={selectedAlbum}
              onChange={(e) => setSelectedAlbum(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="largest">Largest Size</option>
              <option value="az">A-Z by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPhotos.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex justify-between items-center">
          <div>
            <span className="font-semibold">{selectedPhotos.size}</span> photo(s) selected
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteSelected}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              <span>🗑️</span>
              {deleting ? 'Deleting...' : 'Delete Selected'}
            </button>
          </div>
        </div>
      )}

      {/* Photo Display */}
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