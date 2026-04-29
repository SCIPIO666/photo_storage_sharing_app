// components/PhotoGrid.jsx
import React, { useState } from 'react';
import { Trash2, X, Check } from 'lucide-react';

const PhotoGrid = ({ photos, selectedPhotos, onToggleSelect, onDelete, formatFileSize }) => {
  const [previewPhoto, setPreviewPhoto] = useState(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-md">
        <div className="text-7xl mb-4">📸</div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">No photos found</h3>
        <p className="text-gray-600">Upload your first photo to get started!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {photos.map(photo => (
          <div
            key={photo.id}
            className={`relative group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
              selectedPhotos?.has(photo.id) ? 'ring-4 ring-blue-500' : ''
            }`}
          >
            {/* Selection Checkbox */}
            <div className="absolute top-2 left-2 z-10">
              <button
                onClick={() => onToggleSelect(photo.id)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                  selectedPhotos?.has(photo.id) 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700'
                }`}
              >
                {selectedPhotos?.has(photo.id) && <Check className="w-4 h-4" />}
              </button>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(photo.id)}
              className="absolute top-2 right-2 z-10 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Image */}
            <div className="relative cursor-pointer overflow-hidden bg-gray-100">
              <img
                src={photo.url}
                alt={photo.filename}
                className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => setPreviewPhoto(photo)}
              />
            </div>

            {/* Info */}
            <div className="p-3">
              <div className="text-sm font-semibold text-gray-800 truncate" title={photo.filename}>
                {photo.filename}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatFileSize(photo.size)}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(photo.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Preview Modal */}
      {previewPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            {/* Image */}
            <div className="bg-black rounded-lg overflow-hidden">
              <img
                src={previewPhoto.url}
                alt={previewPhoto.filename}
                className="w-full max-h-[85vh] object-contain"
              />
            </div>
            
            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-6 rounded-b-lg">
              <h3 className="text-xl font-semibold mb-2">{previewPhoto.filename}</h3>
              <div className="flex gap-4 text-sm">
                <span>Size: {formatFileSize(previewPhoto.size)}</span>
                <span>Type: {previewPhoto.mimeType}</span>
                <span>Uploaded: {new Date(previewPhoto.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGrid;