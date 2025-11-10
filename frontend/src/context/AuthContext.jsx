// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

// Create the context
const AuthContext = createContext(null);

// Helper function to set token
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Create the provider component
export const AuthProvider = ({ children }) => {
  // ⭐️ 1. LOAD THE FULL USER OBJECT FROM STORAGE (WITH A FIX)
  const [user, setUser] = useState(() => {
    // ⭐️ FIX: Add a try...catch block to prevent a crash from bad data
    try {
      const savedUser = localStorage.getItem('user');
      
      // Check for null OR the literal string "undefined"
      if (!savedUser || savedUser === 'undefined') {
        return null;
      }
      
      // If we get here, it's a real string, so try to parse it
      return JSON.parse(savedUser);

    } catch (error) {
      // This will catch any invalid JSON (e.g., "undefined")
      console.error("Failed to parse user from localStorage on init:", error);
      localStorage.removeItem('user'); // Clear the bad data
      return null;
    }
  });
  
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true); // Your App.jsx depends on this

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          const decoded = jwtDecode(storedToken);
          
          if (decoded.exp * 1000 < Date.now()) {
            logout();
          } else {
            setToken(storedToken);
            setAuthToken(storedToken);
            
            // Re-check user from storage (already loaded, but good practice)
            const savedUser = localStorage.getItem('user');
            if (savedUser && savedUser !== 'undefined') {
              setUser(JSON.parse(savedUser));
            } else if (user) {
              // User is already in state from useState, we're good
            } else {
              // No user in state or storage, but we have a token.
              // This is an inconsistent state, so log out.
              logout();
            }
          }
        }
      } catch (e) {
        console.error("Invalid token on load", e);
        logout();
      }
      setLoading(false);
    };
    
    loadUser();
  }, []); // Removed 'user' dependency to prevent re-loops

  const login = (userData, userToken) => {
    // Prevent saving "undefined" if login fails
    if (!userData || !userToken) {
      console.error("Login call failed, not saving undefined user/token");
      return; 
    }
    
    localStorage.setItem('user', JSON.stringify(userData)); // Save the whole object
    setAuthToken(userToken); // Save the token
    
    setUser(userData); // Set the full user object in state
    setToken(userToken);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Also remove the token
    setAuthToken(null);
    setUser(null);
    setToken(null);
  };

  // ⭐️ FIX: Your App.jsx needs this to be true while loading
  if (loading) {
     return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create the custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};