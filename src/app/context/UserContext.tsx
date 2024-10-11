"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the shape of the user context state
interface UserContextType {
  userId: string | null;
  setUserId: (id: string | null) => void; // Allow null as a valid state
}

// Create the context with default values
const UserContext = createContext<UserContextType>({
  userId: null,
  setUserId: () => {},
});

// Create a provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(() => {
    // Get userId from localStorage if available, only in the browser
    const storedUserId = localStorage.getItem('userId');
    return storedUserId || null;
  }); // Initialize as null

  // useEffect(() => {
  //   // Get userId from localStorage if available, only in the browser
  //   const storedUserId = localStorage.getItem('userId');
  //   setUserId(storedUserId || null);
  // }, []); // Only run once when the component mounts 

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
