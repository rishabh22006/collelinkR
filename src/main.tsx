import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import './index.css'
import { Toaster } from "sonner";
import { ensureStorageBuckets } from './utils/setupStorage';

// Initialize storage buckets
ensureStorageBuckets().catch(console.error);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Toaster position="bottom-right" />
  </React.StrictMode>
);
