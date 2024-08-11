import { createContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ loggedIn: false });
  const login = async  (id) => {
    const response = await axios.post(`${backendurl}/auth/login`, { username, password }, { withCredentials: true });
    setAuth({ loggedIn: true, username });
  };}
// export default AuthContext;