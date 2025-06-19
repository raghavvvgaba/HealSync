import { createContext, useContext, useState, useEffect } from "react";

// Create context
const UserContext = createContext();

// Create provider
export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Load user from localStorage on first load
    const storedUser = localStorage.getItem("healsync-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("healsync-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("healsync-user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use user context
export function useUser() {
  return useContext(UserContext);
}
