// src/services/fileService.js
import api from './api';

export const fileService = {
  uploadFiles: async (formData) => {
    // Backend expects multipart/form-data for files
    const response = await api.post('/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  getFolderFiles: async (folderId) => {
    // Matches  backend route GET /file/:folderId backend
    const response = await api.get(`/file/${folderId}`);
    return response.data;
  },

  deleteFiles: async (fileIds) => {
    // Matches  bulk delete logic bacckend
    const response = await api.delete('/file', { data: { fileIds } });
    return response.data;
  }
};

