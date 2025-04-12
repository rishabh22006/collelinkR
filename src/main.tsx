
import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import './index.css'
import { Toaster } from "sonner";
import { initializeStorage } from './utils/setupStorage';
import { supabase } from './integrations/supabase/client';

// Initialize storage buckets
const initStorage = async () => {
  try {
    // First, try the client-side check
    const storageReady = await initializeStorage();
    
    if (!storageReady) {
      console.log("Attempting server-side storage initialization...");
      // If client-side check fails, call the edge function to set up buckets
      const { data, error } = await supabase.functions.invoke('initialize-storage');
      
      if (error) {
        console.error("Failed to initialize storage via edge function:", error);
      } else {
        console.log("Storage initialization results:", data);
      }
    }
  } catch (err) {
    console.error("Storage initialization error:", err);
    // Don't block app loading due to storage issues
  }
};

// Start storage initialization without blocking the app render
initStorage();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Toaster position="bottom-right" />
  </React.StrictMode>
);
