import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { backendurl } from "../backendurl.js";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = Cookies.get('token');
    const user = Cookies.get('user');
    const role=Cookies.get('role')

    // if (token && userData && role) {
    //   const user = JSON.parse(userData);
      
    //   setAuthData({ user, token,role });
    //   axios.defaults.headers.common['Authorization'] = token;
    // }
    return token ? { loggedIn: true, token, user, role } : null;
  });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
      const fetchPosts = async () => {
          try {
              const response = await axios.get("https://backend.algouni.online/api/post/all", { withCredentials: true });
              setPosts(response.data);
          } catch (err) {
              console.error("Error fetching posts:", err);
          }
      };

      fetchPosts();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
        try {
            const response = await axios.get(`${backendurl}/auth`, { withCredentials: true });
            setAuth({ loggedIn: true, token: response.data.token,user:response.data.user,  role: response.data.role });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", response.data.user);
            localStorage.setItem("role", response.data.role);
        } catch (err) {
            setAuth(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");
        }
    };

    checkAuth();
}, []);
    const createPost = async (title, content) => {
      try {
          const response = await axios.post(`${backendurl}api/auth/profile/post/create`, { title, content }, { withCredentials: true });
          setPosts([...posts, response.data]);
      } catch (err) {
          console.error("Error creating post:", err);
      }
  };
  const login = async (username, password) => {
    try {
        const response = await axios.post(`${backendurl}/auth/login`, { username, password }, { withCredentials: true });
        setAuth({ loggedIn: true, token: response.data.token,user: response.data.user, role: response.data.role });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", response.data.user);
        localStorage.setItem("role", response.data.role);
    } catch (err) {
        console.error("Error logging in:", err);
    }
};
  
const logout = async () => {
  // await axios.post(`${backendurl}/auth/logout`, {}, { withCredentials: true });
  // setAuth(false);
  Cookies.remove('token');
  Cookies.remove('user');
  Cookies.remove('role')
  setAuth(null);
  delete axios.defaults.headers.common['Authorization'];
};
  // const logout = () => {
  //   Cookies.remove('token');
  //   Cookies.remove('user');
  //   Cookies.remove('role')
  //   setAuthData(null);
  //   delete axios.defaults.headers.common['Authorization'];
  // };

  // return (
  //   <AuthContext.Provider value={{ authData, login, logout }}>
  //     {children}
  //   </AuthContext.Provider>
  // );
  return <AuthContext.Provider value={{ auth, setAuth, login, logout, createPost, posts }}>{children}</AuthContext.Provider>;
};


