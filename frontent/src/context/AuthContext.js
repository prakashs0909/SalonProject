import React, { createContext, useState, useEffect } from 'react';

// Create a new context object
const AuthContext = createContext();

// Define a provider component for managing authentication state
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // On component mount, check local storage for user data
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Method to set the user data and store it in local storage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Method to clear user data and remove it from local storage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Provide the user state, login and logout methods to child components
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context and provider for use in other components
export { AuthContext, AuthProvider };
