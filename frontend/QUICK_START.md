# 🚀 Quick Start Guide

## Personal Cloud Storage + Python Executor Frontend

This folder contains everything you need to run the frontend application.

## 📁 **What's Included:**

### Essential Files:
- `package.json` - Dependencies and scripts
- `vite.config.js` - Build configuration
- `index.html` - Main HTML file
- `README.md` - Detailed documentation
- `DEMO.md` - Testing instructions

### Source Code:
```
src/
├── api/
│   └── cloudApi.js          # API integration layer
├── components/
│   ├── FileUpload.jsx       # File upload component
│   ├── FileList.jsx         # File listing component
│   ├── PythonExecutor.jsx   # Python code executor
│   └── BackendStatus.jsx    # Backend connectivity check
├── App.jsx                  # Main application
├── App.css                  # Complete styling
└── main.jsx                 # React entry point
```

## ⚡ **Quick Setup (3 Steps):**

1. **Open Terminal** in this folder:
   ```bash
   cd ~/Desktop/personal-cloud-frontend
   ```

2. **Install dependencies** (if node_modules not working):
   ```bash
   npm install
   ```

3. **Start the application**:
   ```bash
   npm run dev
   ```

4. **Open browser** and go to:
   ```
   http://localhost:5173
   ```

## 🎯 **Features Ready to Use:**

### ✅ File Management
- Upload files with user ID
- List and download files
- User-specific storage organization

### ✅ Python Code Execution
- Live code editor with examples
- Real-time execution and output
- Built-in code templates

### ✅ Modern UI/UX
- Beautiful gradient design
- Mobile-responsive layout
- Real-time backend status monitoring

## 🔧 **Backend Integration:**

The frontend expects a FastAPI backend running on:
```
http://127.0.0.1:8000
```

### Required Backend Endpoints:
- `POST /upload` - File uploads
- `GET /files/{user_id}` - List files
- `GET /download/{file_id}` - Download files
- `POST /run` - Execute Python code

## 📋 **Available Commands:**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🌟 **Next Steps:**

1. **Test without backend**: UI will show red status but interface works
2. **Set up backend**: Follow backend setup instructions
3. **Full demo**: Upload files and run Python code
4. **Customize**: Modify components and styling as needed

## 🆘 **Need Help?**

- Check `README.md` for detailed documentation
- See `DEMO.md` for testing scenarios
- Backend status indicator will guide you

---

**Ready to launch! 🎉** Your complete frontend is in this folder!