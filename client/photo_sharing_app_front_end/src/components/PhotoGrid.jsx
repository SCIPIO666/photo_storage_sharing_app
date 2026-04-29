// src/components/PhotoGrid.jsx
import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';

const PhotoGrid = ({ photos, selectedPhotos, onToggleSelect, onDelete, formatFileSize }) => {
  const [previewPhoto, setPreviewPhoto] = useState(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No photos found</h3>
        <p className="text-gray-600">Upload your first photo to get started!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {photos.map(photo => (
          <div
            key={photo.id}
            className={`relative group bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition ${
              selectedPhotos?.has(photo.id) ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            {/* Selection Checkbox */}
            <div className="absolute top-2 left-2 z-10">
              <button
                onClick={() => onToggleSelect(photo.id)}
                className={`w-6 h-6 rounded ${
                  selectedPhotos?.has(photo.id) 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white bg-opacity-80 hover:bg-gray-100'
                } flex items-center justify-center`}
              >
                {selectedPhotos?.has(photo.id) && '✓'}
              </button>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(photo.id)}
              className="absolute top-2 right-2 z-10 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Image */}
            <img
              src={photo.url}
              alt={photo.filename}
              className="w-full aspect-square object-cover cursor-pointer"
              onClick={() => setPreviewPhoto(photo)}
            />

            {/* Info */}
            <div className="p-2">
              <div className="text-sm font-medium truncate" title={photo.filename}>
                {photo.filename}
              </div>
              <div className="text-xs text-gray-500">
                {formatFileSize(photo.size)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Preview */}
      {previewPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setPreviewPhoto(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={previewPhoto.url}
              alt={previewPhoto.filename}
              className="max-w-full max-h-[85vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4">
              <p className="font-semibold">{previewPhoto.filename}</p>
              <p className="text-sm">Size: {formatFileSize(previewPhoto.size)}</p>
              <p className="text-sm">Uploaded: {new Date(previewPhoto.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGrid;