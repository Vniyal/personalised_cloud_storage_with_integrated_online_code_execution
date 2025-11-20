import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Upload file to cloud storage
export const uploadFile = async (userId, file) => {
  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("file", file);

  const response = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// List all files for a user
export const listFiles = async (userId) => {
  const response = await api.get(`/files/${userId}`);
  return response.data.files;
};

// Get file download information
export const downloadFile = async (fileId) => {
  const response = await api.get(`/download/${fileId}`);
  return response.data;
};

// Run Python code
export const runPythonCode = async (code) => {
  const formData = new FormData();
  formData.append("code", code);

  const response = await api.post("/run", formData);
  return response.data;
};