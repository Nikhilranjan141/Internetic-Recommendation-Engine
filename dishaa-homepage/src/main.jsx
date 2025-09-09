// main.jsx में केवल यह change करें
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ यह import जोड़ें
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <BrowserRouter> {/* ✅ App को BrowserRouter से wrap करें */}
      <App />
    </BrowserRouter>
  ,
);