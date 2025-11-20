# Personal Cloud Storage + Python Executor Frontend

A modern React frontend for the Personalized Cloud Storage and Python Execution backend built with FastAPI. This application provides a user-friendly interface for file uploads, cloud storage management, and Python code execution.

## 🚀 Features

### 📁 File Management
- **File Upload**: Upload files to cloud storage (AWS S3 or local demo)
- **File Listing**: View all files for a specific user
- **File Download**: Download files from cloud storage
- **User-specific Storage**: Organize files by user ID

### 🐍 Python Code Execution
- **Live Code Editor**: Write and execute Python code in real-time
- **Example Templates**: Quick-start with pre-built code examples
- **Output Display**: View execution results and error messages
- **Security Warnings**: Built-in notices about code execution safety

### 🎨 Modern UI/UX
- **Tabbed Interface**: Clean navigation between features
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Feedback**: Loading states and success/error messages
- **Beautiful Styling**: Modern gradient design with smooth animations

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with gradients and animations
- **ES6+** - Modern JavaScript features

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:5173` to view the application.

## 🔧 Configuration

### API Configuration
The frontend is configured to connect to the backend at `http://127.0.0.1:8000`. To change this:

1. Open `src/api/cloudApi.js`
2. Update the `API_BASE_URL` constant:
   ```javascript
   const API_BASE_URL = 'https://your-backend-domain.com';
   ```

## 📖 Usage Guide

### 1. File Upload
1. Navigate to the "📤 Upload Files" tab
2. Enter your User ID (any string identifier)
3. Select a file from your computer
4. Click "📤 Upload File"
5. Wait for confirmation message

### 2. View Files
1. Go to "📁 My Files" tab
2. Enter a User ID in the search box
3. Click "🔄 Refresh" or the input will auto-search
4. View your uploaded files in a grid layout
5. Click "⬇️ Download" to download any file

### 3. Python Code Execution
1. Switch to "🐍 Python Executor" tab
2. Choose from example templates or write custom code
3. Click "▶️ Run Code" to execute
4. View results in the output section
5. **⚠️ Warning**: Only run trusted code in demo environments!

## 🔌 API Integration

The frontend integrates with these backend endpoints:

| Feature | Method | Endpoint | Description |
|---------|--------|----------|-------------|
| Upload | `POST` | `/upload` | Upload file with user_id |
| List Files | `GET` | `/files/{user_id}` | Get all files for user |
| Download | `GET` | `/download/{file_id}` | Get file download info |
| Execute Python | `POST` | `/run` | Run Python code |

## 🎯 Component Architecture

```
src/
├── api/
│   └── cloudApi.js          # API service layer
├── components/
│   ├── FileUpload.jsx       # File upload component
│   ├── FileList.jsx         # File listing component
│   └── PythonExecutor.jsx   # Python code execution
├── App.jsx                  # Main app component
├── App.css                  # Global styles
└── main.jsx                 # React entry point
```

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🔒 Security Considerations

### Python Code Execution
- **Demo Environment Only**: The Python executor is for demonstration purposes
- **No Production Use**: Never deploy with Python execution in production without proper sandboxing
- **Untrusted Code**: Users are warned not to run untrusted code
- **Backend Security**: Ensure your backend has proper security measures

## 🔄 Backend Integration

This frontend is designed to work with the FastAPI backend that includes:
- **File Storage**: AWS S3 integration with local fallback
- **Demo Database**: JSON-based storage for development
- **Python Execution**: Live code execution (demo only)
- **CORS Support**: Cross-origin requests enabled

### Backend Setup Required
Make sure your backend is running on `http://127.0.0.1:8000` with these endpoints available:
- `POST /upload` - File upload
- `GET /files/{user_id}` - List files
- `GET /download/{file_id}` - Download file
- `POST /run` - Execute Python code

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure backend is running on `http://127.0.0.1:8000`
   - Check CORS configuration in backend
   - Verify network connectivity

2. **File Upload Fails**
   - Check file size limits
   - Ensure backend has write permissions
   - Verify S3 configuration (if using AWS)

3. **Python Execution Errors**
   - Backend security restrictions
   - Invalid Python syntax
   - Missing Python packages on backend

---

**⚠️ Security Notice**: This application includes Python code execution features intended for demonstration purposes only. Do not deploy to production without proper security measures and sandboxing.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
