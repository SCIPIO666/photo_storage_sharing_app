// src/services/albumService.js
import api from './api';

export const albumService = {
  createAlbum: async (name, description) => {
    const response = await api.post('/albums', { name, description });
    return response.data;
  },
  
  getUserAlbums: async () => {
    const response = await api.get('/albums');
    return response.data;
  },
  
  getAlbum: async (albumId) => {
    const response = await api.get(`/albums/${albumId}`);
    return response.data;
  },
  
  updateAlbum: async (albumId, updates) => {
    const response = await api.patch(`/albums/${albumId}`, updates);
    return response.data;
  },
  
  deleteAlbum: async (albumId) => {
    const response = await api.delete(`/albums/${albumId}`);
    return response.data;
  }
};