# 🚀 Demo Instructions

This guide will help you test the Personal Cloud Storage + Python Executor frontend application.

## Prerequisites

### 1. Backend Setup (Required)
Before testing the frontend, you need the FastAPI backend running. Based on your provided backend code:

1. **Install Python dependencies**:
   ```bash
   pip install fastapi uvicorn boto3 python-multipart python-dotenv
   ```

2. **Create the backend files**:
   - Create `main.py` with your FastAPI backend code
   - Create `requirements.txt` with the dependencies
   - Create `.env` file for AWS credentials (optional for demo mode)

3. **Start the backend**:
   ```bash
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

### 2. Frontend Setup
1. **Install dependencies** (already done if following README):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:5173
   ```

## 🎯 Testing Scenarios

### Scenario 1: Backend Connection Test
1. **Open the application** in your browser
2. **Check the backend status** at the top of the page:
   - ✅ Green = Backend connected and ready
   - ❌ Red = Backend not running or not accessible
   - ⏳ Orange = Checking connection

### Scenario 2: File Upload and Management
1. **Navigate to "📤 Upload Files" tab**
2. **Enter a User ID**: `demo-user-1`
3. **Select a small test file** (e.g., a text file or small image)
4. **Click "📤 Upload File"**
5. **Wait for success message** showing the file ID
6. **Switch to "📁 My Files" tab**
7. **Enter the same User ID**: `demo-user-1`
8. **Verify the file appears** in the files grid
9. **Click "⬇️ Download"** to test file download

### Scenario 3: Python Code Execution
1. **Navigate to "🐍 Python Executor" tab**
2. **Try the default code** (should print "Hello, World!")
3. **Click "▶️ Run Code"**
4. **Verify output appears** in the output section
5. **Test example templates**:
   - Click "Basic Math" and run the code
   - Try "List Operations" example
   - Test "Dictionary Example"

### Scenario 4: Error Handling
1. **Test file upload without User ID** (should show error)
2. **Test Python code with syntax error**:
   ```python
   print("Missing quote)
   ```
3. **Test file list with non-existent User ID** (should show empty state)

## 📊 Expected Results

### File Upload Success
```
✅ File uploaded successfully! File ID: [uuid-string]
```

### File List Display
```
Files should appear in a grid layout showing:
- File name
- File ID
- Storage location (Local Demo or S3 Cloud)
- Download button
```

### Python Execution Success
```json
{
  "output": "Hello, World!"
}
```

### Python Math Example Output
```json
{
  "result": 15,
  "a": 10,
  "b": 5
}
```

## 🐛 Common Issues & Solutions

### Backend Not Running
**Problem**: Red status showing "Backend not running"
**Solution**: 
1. Ensure FastAPI backend is running on port 8000
2. Check terminal for backend errors
3. Verify no other service is using port 8000

### CORS Errors
**Problem**: Network errors when making API calls
**Solution**: Ensure your FastAPI backend includes CORS middleware:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### File Upload Fails
**Problem**: Upload returns error
**Solution**:
1. Check backend logs for errors
2. Ensure `temp_uploads` directory exists
3. Verify file size is reasonable (< 10MB for demo)

### Python Execution Fails
**Problem**: Python code execution returns errors
**Solution**:
1. Check backend has Python execution enabled
2. Verify no security restrictions blocking `exec()`
3. Use simple Python code without imports

## 🎯 Demo Scenarios for Different Users

### For Developers
- Test API integration by opening browser dev tools
- Inspect network requests and responses
- Test error handling with invalid inputs
- Experiment with different file types

### For End Users
- Focus on the UI/UX experience
- Test file upload and download workflows
- Try different Python code examples
- Test on mobile devices for responsiveness

### For Stakeholders
- Demonstrate complete file management workflow
- Show Python code execution capabilities
- Highlight security warnings and considerations
- Explain the technology stack and architecture

## 📈 Next Steps After Demo

1. **Security**: Add proper authentication and input validation
2. **Features**: Add file previews, sharing, and advanced Python packages
3. **Deployment**: Deploy to cloud platforms with proper security
4. **Monitoring**: Add error tracking and performance monitoring

## 🔒 Security Reminders

- **Demo Environment Only**: This setup is for demonstration purposes
- **No Production Use**: Never deploy Python execution without proper sandboxing
- **Local Testing**: Keep file uploads small and temporary
- **Code Review**: Only run trusted Python code

---

**Happy Testing! 🎉** 

If you encounter any issues during the demo, check the browser console and backend logs for detailed error messages.