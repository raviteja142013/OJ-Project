import Header from './Header';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signupimage from '../signup.png';
import axios from 'axios';
import { toast } from 'sonner';
import { backendurl } from '../backendurl';
import { Link } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const validateForm = () => {
  const newErrors = {};
  if (!username) {
    newErrors.username = 'Username is required';
  }
  if (!email) {
    newErrors.email = 'Email is required';
  } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
    newErrors.email = 'Enter a valid email address';
  }
  if (!password) {
    newErrors.password = 'Password is required';
  } else if (password.length < 4) {
    newErrors.password = 'Password must be at least 4 characters';
  } else if (!/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
    newErrors.password = 'Password must have at least 1 special character';
  }
  if (!confirmPassword) {
    newErrors.confirmPassword = 'Confirm password is required';
  } else if (password !== confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }
  // if (!contact) {
  //   newErrors.contact = 'Contact number is required';
  // } else if (!/^\d{10}$/.test(contact)) {
  //   newErrors.contact = 'Contact number must contain 10 digits';
  // }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (validateForm()) {
    setLoading(true);
    axios.post(`${backendurl}/auth/signup`, { username, email, password, contact })
      .then((res) => {
        if (res.status === 200) {
          toast.success('User registered successfully');
          setErrors({});
          setUsername('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setContact('');
          navigate('/login');
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          toast.error(err.response.data.message);
          const newErrors = {};
          if (err.response.data.message.includes('Username')) {
            newErrors.username = err.response.data.message;
          }
          if (err.response.data.message.includes('Email')) {
            newErrors.email = err.response.data.message;
          }
          if (err.response.data.message.includes('Contact number')) {
            newErrors.contact = err.response.data.message;
          }
          setErrors(newErrors);
        } else {
          console.error('Error:', err);
        }
        setLoading(false);
      });
  }
};


  return (
  <>
    <Header />
    <div className="min-h-screen flex items-center justify-center mx-auto px-6 py-20 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg flex overflow-hidden max-w-4xl w-full">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Sign Up</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 font-semibold">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-3 border rounded-lg  ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-1 focus:ring-blue-300`}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3 border rounded-lg  ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-1 focus:ring-blue-300`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 border rounded-lg  ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-1 focus:ring-blue-300`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full p-3 border rounded-lg  ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-1 focus:ring-blue-300`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="contact" className="block text-gray-700 font-semibold">
                Contact Number
              </label>
              <input
                type="text"
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className={`w-full p-3 border rounded-lg  ${
                  errors.contact ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-1 focus:ring-blue-300`}
              />
              {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Sign Up
            </button>
          </form>
          {/* {loading && <p className="mt-4 text-center font-semibold text-gray-500">Loading...</p>} */}
          <p className="text-left text-sm mt-2">
            Already have an account?{" "}
            <Link to={"/login"} className="text-red-600 underline">
              Login
            </Link>
          </p>
        </div>
        <div className="hidden md:block w-1/2">
          <img src={signupimage} alt="Signup" className="object-contain w-full h-full" />
        </div>
      </div>
    </div>
  </>
);
}
export default Signup;