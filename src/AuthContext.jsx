import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  isAuth: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('session');
    if (session) {
      setIsAuth(true);
      setUser(JSON.parse(session));
    }
  }, []);

  const login = (userData) => {
    setIsAuth(true);
    setUser(userData);
    localStorage.setItem('session', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuth(false);
    setUser(null);
    localStorage.removeItem('session');
  };

  return (
    <AuthContext.Provider value={{ isAuth, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
