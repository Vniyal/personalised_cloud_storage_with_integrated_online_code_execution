import { useState, useEffect } from 'react';
import { listFiles, downloadFile } from '../api/cloudApi';

const FileList = ({ userId, refreshTrigger }) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [downloadingFiles, setDownloadingFiles] = useState(new Set());

  // Fetch files for the user
  const fetchFiles = async (userIdToFetch) => {
    if (!userIdToFetch) {
      setFiles([]);
      setMessage('');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const userFiles = await listFiles(userIdToFetch);
      setFiles(userFiles);
      setMessage(userFiles.length === 0 ? 'No files found for this user' : '');
    } catch (error) {
      console.error('Failed to fetch files:', error);
      setMessage(`❌ Failed to fetch files: ${error.response?.data?.error || error.message}`);
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file download
  const handleDownload = async (fileId, fileName) => {
    setDownloadingFiles(prev => new Set([...prev, fileId]));

    try {
      const fileInfo = await downloadFile(fileId);
      
      if (fileInfo.s3_url && fileInfo.s3_url !== 'demo_local_file') {
        // For real S3 files, open the URL
        window.open(fileInfo.s3_url, '_blank');
      } else {
        setMessage(`📁 File info: ${fileInfo.file_name} (Demo mode - no actual download)`);
      }
    } catch (error) {
      console.error('Download failed:', error);
      setMessage(`❌ Download failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  // Effect to fetch files when userId changes or refresh is triggered
  useEffect(() => {
    fetchFiles(userId);
  }, [userId, refreshTrigger]);

  return (
    <div className="file-list-container">
      <h2>📋 Your Files</h2>
      
      <div className="file-list-header">
        <input
          type="text"
          placeholder="Enter User ID to view files"
          value={userId || ''}
          onChange={(e) => fetchFiles(e.target.value)}
          className="user-id-input"
        />
        <button
          onClick={() => fetchFiles(userId)}
          disabled={isLoading || !userId}
          className="refresh-btn"
        >
          {isLoading ? '⏳ Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('❌') ? 'error' : 'info'}`}>
          {message}
        </div>
      )}

      {files.length > 0 && (
        <div className="files-grid">
          {files.map((file) => (
            <div key={file.file_id} className="file-item">
              <div className="file-info">
                <h3 className="file-name">{file.file_name}</h3>
                <p className="file-id">ID: {file.file_id}</p>
                <p className="file-storage">
                  Storage: {file.s3_url === 'demo_local_file' ? '💻 Local Demo' : '☁️ S3 Cloud'}
                </p>
              </div>
              <button
                onClick={() => handleDownload(file.file_id, file.file_name)}
                disabled={downloadingFiles.has(file.file_id)}
                className="download-btn"
              >
                {downloadingFiles.has(file.file_id) ? '⏳ Downloading...' : '⬇️ Download'}
              </button>
            </div>
          ))}
        </div>
      )}

      {!isLoading && files.length === 0 && userId && (
        <div className="empty-state">
          <p>🗃️ No files found for user "{userId}"</p>
          <p>Upload some files to see them here!</p>
        </div>
      )}
    </div>
  );
};

export default FileList;