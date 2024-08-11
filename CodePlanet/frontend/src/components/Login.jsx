import React, { useState } from 'react';
import loginimage from '../login2.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/authProvider';
// import {loginContext } from '../providers/loginProvider';
import { useContext } from 'react';
import {toast} from 'sonner'
import {backendurl} from '../backendurl.js';
import Header from './Header.jsx';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverResponse, setServerResponse] = useState('');
  // const  {auth}  = useContext(AuthContext);
  // const  {login}  = useContext(loginContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } 
    if (!password) {
      newErrors.password = 'Password is required';
    } 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        console.log("${backendurl}/auth/login");
        const response = await axios.post(`${backendurl}/auth/login`, { email, password });
        // console.log(response.data);
        console.log(response.data.user._id);
        const user_id = response.data.user._id;
        if (response.data.success === false) {
          setServerResponse('Invalid credentials');
          toast.error("Invalid credentials");
          return;
        }
  
        const { user, token, role } = response.data;
        console.log("login page after succ login");
        console.log(role);
        console.log(user);
  
        


       
   
        const expiration = new Date();
        expiration.setTime(expiration.getTime() + (24 * 60 * 60 * 1000)); 
        
        Cookies.set('token', token, { expires: expiration });
        Cookies.set('user', JSON.stringify(user), { expires: expiration });
        Cookies.set('role',role,{expires:expiration})
        setAuth({ user, token,role });
        console.log(Cookies.get('role'));
          
        axios.defaults.headers.common['Authorization'] = token;

        
        toast.success('Login successful');
  
        if (role === 'admin') {
          navigate("/admin");
        } else {
          // navigate("/");
          navigate("/profile");
        }
      } catch (error) {
        console.error('Login error:', error);
        if (error.response && error.response.data && error.response.data.message) {
          setServerResponse(error.response.data.message);
          toast.error(error.response.data.message);
        } else {
          setServerResponse('An error occurred. Please try again.');
          toast.error('An error occurred. Please try again.');
        }
      }
      setLoading(false);
    }
  };
  
  
  return (
    <>
    <Header />
    <div className="min-h-screen flex items-center justify-center mx-auto px-6 py-20  bg-yellow-100">
      <div className="bg-white shadow-lg rounded-lg flex overflow-hidden max-w-4xl w-full">
        <div className="hidden md:block w-1/2">
          <img src={loginimage} alt="Login" className="object-cover w-full h-full" />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Login</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3 border rounded-lg ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-1 focus:ring-blue-300`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 border rounded-lg ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-1 focus:ring-blue-300`}
              />
              {errors.password && <p className="text-red-500 text-semibold mt-1">{errors.password}</p>}
            </div>
            {serverResponse && <p className="font-semibold text-red-500">{serverResponse}</p>}
            <button
              type="submit"
              className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Login
            </button>
          </form>
          {loading && <p className="mt-4 text-center font-semibold text-gray-500">Loading...</p>}
          <p className="text-left text-sm mt-2">
            Don't have an account?{" "}
            <Link to={"/signup"} className="text-red-600 underline">
              Signup
            </Link>
          </p>
        
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;