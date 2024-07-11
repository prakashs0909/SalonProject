// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check local storage or session storage for user data on mount
    const storedUser = JSON.parse(localStorage.getItem('user')); // Adjust as per your storage strategy

    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data in local storage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove user data from local storage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
