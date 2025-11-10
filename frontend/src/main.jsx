import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 1. Import the router
import { CartProvider } from './context/CartContext'; // 3. Import the provider

import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Wrap your entire App in BrowserRouter */}
    <BrowserRouter>
      {/* 4. Wrap with CartProvider so the whole app can access the cart */}
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)