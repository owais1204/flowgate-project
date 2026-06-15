import {
  createContext,
  useContext,
  useState
} from 'react';

import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {

    const savedUser = localStorage.getItem('user');

    return savedUser ? JSON.parse(savedUser) : null;
  });

  // LOGIN
  const login = async (email, password) => {

    try {

      const response = await authApi.login(email, password);

      console.log("LOGIN RESPONSE:", response.data);

      const data = response.data;

      const userData = {
        token: data.token,
        userId: data.userId || data.userid,
        name: data.name,
        email: data.email,
        role: data.role || 'USER',
      };

      // SAVE USER
      localStorage.setItem('user', JSON.stringify(userData));

      // SAVE SEPARATELY FOR API INTERCEPTOR
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userId', userData.userId);

      setUser(userData);

      return userData;

    } catch (error) {

      console.error('LOGIN ERROR:', error);

      throw error;
    }
  };

  // LOGOUT
  const logout = () => {

    localStorage.clear();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);