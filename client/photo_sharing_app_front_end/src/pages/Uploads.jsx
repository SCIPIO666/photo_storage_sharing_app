// src/pages/Uploads.jsx
import { useState } from 'react';
import axios from '../config/axiosConfig'; // Use your configured instance

export default function Uploads() {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (files.length === 0) {
            alert('Please select files to upload');
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('photos', files[i]);
        }

        // Add optional metadata
        formData.append('title', 'My Photo Upload');

        setUploading(true);

        try {
            const token = localStorage.getItem('token');
            console.log('Token exists:', !!token);
            if (token) {
                console.log('Token preview:', token.substring(0, 20) + '...');
            }
            
            const response = await axios.post('/file', formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress({ global: percentCompleted });
                    console.log(`Upload progress: ${percentCompleted}%`);
                },
                headers: {
                    // Don't set Content-Type - let browser set it with boundary
                }
            });
            
            console.log('Upload response:', response.data);
            alert(`${response.data.files?.length || 0} photo(s) uploaded successfully!`);
            
            // Clear files after successful upload
            setFiles([]);
            setUploadProgress({});
            
        } catch (err) {
            console.error('Upload error:', err);
            console.error('Error response:', err.response?.data);
            
            let errorMessage = 'Upload failed';
            if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            alert(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-10 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-center">
            <h2 className="text-xl font-semibold mb-4">Upload Your Media</h2>
            
            {uploading && (
                <div className="mb-4">
                    <div className="bg-blue-200 rounded-full h-2 mb-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress.global || 0}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-600">{uploadProgress.global || 0}% uploaded</p>
                </div>
            )}
            
            <form onSubmit={handleUpload}>
                <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={e => setFiles(Array.from(e.target.files))} 
                    className="mb-6 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={uploading}
                />
                
                {files.length > 0 && (
                    <div className="mb-4 text-sm text-gray-600">
                        Selected {files.length} file(s)
                    </div>
                )}
                
                <button 
                    type="submit" 
                    className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={uploading || files.length === 0}
                >
                    {uploading ? 'Uploading...' : 'Start Upload'}
                </button>
            </form>
        </div>
    );
}