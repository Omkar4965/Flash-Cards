"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the shape of the user context state
interface UserContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
}

// Create the context with default values
const UserContext = createContext<UserContextType>({
  userId: null,
  setUserId: () => {},
});

// Create a provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(() => {
    // Initialize userId from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('userId') || null;
      } catch (error) {
        console.error('Failed to retrieve userId from localStorage', error);
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (userId !== null) {
      // Persist userId to localStorage whenever it changes
      localStorage.setItem('userId', userId);
    }
  }, [userId]);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
