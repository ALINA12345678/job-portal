import { StrictMode } from 'react'
// Helps identify potential problems by highlighting them in development mode

import { createRoot } from 'react-dom/client'
// New React 18 way to create the root where your app renders

import './index.css'
// Imports your global CSS styling

import App from './App.jsx'
// Imports the main App component

import './bootstrap.min.css'
// Imports Bootstrap styles for consistent UI design

import { BrowserRouter } from 'react-router-dom'
// Enables routing in your app (allows URL-based navigation)

createRoot(document.getElementById('root')).render(
  // Mounts the React app into the <div id="root"></div> in index.html

  <BrowserRouter>
    {/* Enables routing across your entire app */}

    <StrictMode>
      {/* Activates additional checks & warnings in development */}

      <App />
      {/* Renders the main App component */}
    </StrictMode>
  </BrowserRouter>
)
