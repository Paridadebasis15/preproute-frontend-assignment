import { createContext, useContext, useMemo, useReducer } from 'react';
import { loginApi } from '../api/authApi';
import { getToken, getUser, setToken, setUser, clearToken, clearUser } from '../utils/token';

const AuthContext = createContext(null);

const initialState = { token: getToken(), user: getUser(), loading: false, error: '' };

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START': return { ...state, loading: true, error: '' };
    case 'LOGIN_SUCCESS': return { ...state, loading: false, token: action.payload.token, user: action.payload.user, error: '' };
    case 'LOGIN_ERROR': return { ...state, loading: false, error: action.payload };
    case 'LOGOUT': return { ...state, token: null, user: {}, error: '' };
    default: return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (payload) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await loginApi(payload);
      const token = response?.data?.token;
      const user = response?.data?.user || { name: 'Alex Wando', role: 'Admin' };
      if (!token) throw new Error('Token missing in login response');
      setToken(token);
      setUser(user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
      return response;
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error?.message || 'Login failed' });
      throw error;
    }
  };

  const logout = () => {
    clearToken(); clearUser();
    dispatch({ type: 'LOGOUT' });
  };

  const value = useMemo(() => ({ ...state, isAuthenticated: Boolean(state.token), login, logout }), [state]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
