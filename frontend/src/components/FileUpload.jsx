import { useState } from 'react';
import { uploadFile } from '../api/cloudApi';

const FileUpload = ({ onUploadSuccess }) => {
  const [userId, setUserId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage('');
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    
    if (!userId || !selectedFile) {
      setMessage('Please enter a user ID and select a file');
      return;
    }

    setIsUploading(true);
    setMessage('');

    try {
      const result = await uploadFile(userId, selectedFile);
      setMessage(`✅ File uploaded successfully! File ID: ${result.file_id}`);
      setSelectedFile(null);
      // Reset the file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      
      // Notify parent component of successful upload
      if (onUploadSuccess) {
        onUploadSuccess(userId);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage(`❌ Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>📁 Upload File</h2>
      <form onSubmit={handleUpload} className="upload-form">
        <div className="form-group">
          <label htmlFor="user-id">User ID:</label>
          <input
            id="user-id"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your user ID"
            disabled={isUploading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="file-input">Select File:</label>
          <input
            id="file-input"
            type="file"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isUploading || !userId || !selectedFile}
          className="upload-btn"
        >
          {isUploading ? '⏳ Uploading...' : '📤 Upload File'}
        </button>
      </form>
      
      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default FileUpload;