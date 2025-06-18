// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import './App.css';
import axios from 'axios';
import ToasterProvider from './components/ToasterProvider';
import { HelmetProvider } from 'react-helmet-async';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

createRoot(document.getElementById('root')).render(
  <>
    <ToasterProvider />
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </>
);
