// src/services/photoService.js
import api from './api';

export const photoService = {
  uploadPhoto: async (file, albumId) => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('albumId', albumId);
    
    const response = await api.post('/photos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  deletePhotos: async (photoIds) => {
    const response = await api.delete('/photos', {
      data: { photoIds }
    });
    return response.data;
  },
  
  getAlbumPhotos: async (albumId) => {
    const response = await api.get(`/albums/${albumId}/photos`);
    return response.data;
  },
  
  getPhoto: async (photoId) => {
    const response = await api.get(`/photos/${photoId}`);
    return response.data;
  }
};