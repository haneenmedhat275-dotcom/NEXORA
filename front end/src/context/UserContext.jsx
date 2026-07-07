import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("nexora_current_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("nexora_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("nexora_current_user");
    }
  }, [user]);

  const getUsers = () => {
    try {
      const raw = localStorage.getItem("nexora_users");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem("nexora_users", JSON.stringify(users));
  };

  const signup = (userData) => {
    const users = getUsers();
    const exists = users.some((u) => u.email === userData.email);
    if (exists) return false;
    const username = userData.name.toLowerCase().replace(/\s+/g, '_');
    const newUser = { name: userData.name, email: userData.email, password: userData.password, username, resume: null };
    users.push(newUser);
    saveUsers(users);
    setUser(newUser);
    return true;
  };

  const login = (email, password) => {
    const users = getUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      const users = getUsers();
      const idx = users.findIndex((u) => u.email === prev.email);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        saveUsers(users);
      }
      return updated;
    });
  };

  const userExists = (email) => {
    const users = getUsers();
    return users.some((u) => u.email === email);
  };

  const saveInterviewResult = (result) => {
    localStorage.setItem("nexora_last_interview", JSON.stringify(result));
  };

  const getInterviewResult = () => {
    try {
      const raw = localStorage.getItem("nexora_last_interview");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const resetPassword = (email, newPassword) => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.email === email);
    if (idx !== -1) {
      users[idx].password = newPassword;
      saveUsers(users);
      return true;
    }
    return false;
  };

  return (
    <UserContext.Provider value={{ user, signup, login, logout, updateUser, resetPassword, userExists, saveInterviewResult, getInterviewResult }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
