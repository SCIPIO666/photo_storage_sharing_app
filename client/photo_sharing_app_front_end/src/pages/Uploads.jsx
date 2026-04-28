import { useState } from 'react';
import axios from 'axios';

export default function Uploads() {
  const [files, setFiles] = useState([]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/file', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Photos uploaded successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-10 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-center">
      <h2 className="text-xl font-semibold mb-4">Upload Your Media</h2>
      <form onSubmit={handleUpload}>
        <input type="file" multiple onChange={e => setFiles(e.target.files)} className="mb-6 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:scale-105 transition-transform">Start Upload</button>
      </form>
    </div>
  );
}