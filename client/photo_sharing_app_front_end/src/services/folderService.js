// src/services/folderService.js
import api from './api';

export const folderService = {
  getFolders: async (rootOnly = false) => {
    const response = await api.get(`/folders?rootOnly=${rootOnly}`);
    return response.data;
  },

  createFolder: async (name, parentId = null) => {
    const response = await api.post('/folders', { name, parentId });
    return response.data;
  },

  deleteFolder: async (folderId, recursive = false) => {
    const response = await api.delete(`/folders/${folderId}?recursive=${recursive}`);
    return response.data;
  }
};
