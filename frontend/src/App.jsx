import { useState } from 'react'
import FileUpload from './components/FileUpload'
import FileList from './components/FileList'
import PythonExecutor from './components/PythonExecutor'
import BackendStatus from './components/BackendStatus'
import './App.css'

function App() {
  const [currentUserId, setCurrentUserId] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [activeTab, setActiveTab] = useState('upload')

  // Handle successful upload to refresh file list
  const handleUploadSuccess = (userId) => {
    setCurrentUserId(userId)
    setRefreshTrigger(prev => prev + 1)
    // Optionally switch to file list tab after upload
    setActiveTab('files')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>☁️ Personal Cloud Storage + 🐍 Python Executor</h1>
        <p>Upload files, manage your cloud storage, and execute Python code</p>
        <BackendStatus />
      </header>

      <nav className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload Files
        </button>
        <button 
          className={`tab-btn ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => setActiveTab('files')}
        >
          📁 My Files
        </button>
        <button 
          className={`tab-btn ${activeTab === 'python' ? 'active' : ''}`}
          onClick={() => setActiveTab('python')}
        >
          🐍 Python Executor
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'upload' && (
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        )}
        
        {activeTab === 'files' && (
          <FileList 
            userId={currentUserId} 
            refreshTrigger={refreshTrigger}
          />
        )}
        
        {activeTab === 'python' && (
          <PythonExecutor />
        )}
      </main>

      <footer className="app-footer">
        <p>🚀 Built with React + Vite | Backend: FastAPI + AWS S3</p>
        <p>📡 API Base URL: <code>http://127.0.0.1:8000</code></p>
      </footer>
    </div>
  )
}

export default App
