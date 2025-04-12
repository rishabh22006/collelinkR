
import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import './index.css'
import { Toaster } from "sonner";
import { initializeStorage } from './utils/setupStorage';

// Initialize storage buckets
initializeStorage().catch(console.error);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Toaster position="bottom-right" />
  </React.StrictMode>
);
