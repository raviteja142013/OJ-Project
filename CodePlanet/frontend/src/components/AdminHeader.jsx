import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext } from '../providers/authProvider';
import { useContext } from 'react';
import Cookies from 'js-cookie';
const AdminHeader = () => {
  const navigate = useNavigate();
  const authData = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-gray-200">
      <div className="bg-gray-900 text-gray-100 w-60 py-8 px-4">
        <div className="text-3xl font-semibold text-white mt-3 mb-8">
          Admin Dashboard
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          <NavLink to="/admin">Home</NavLink>
          <NavLink to="/manageusers">Users</NavLink>
          <NavLink to="/allsubmissions">Submissions</NavLink>
          <NavLink to="/allquestions" className="text-white">
            Questions
          </NavLink>
          <NavLink to="/addproblem" className="text-white">
            Add Problem
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className="mt-8">
          <button
            onClick={() => {
              Cookies.remove('token');
              Cookies.remove('user');
              Cookies.remove('role')
              // setAuthData(null);
              // delete axios.defaults.headers.common['Authorization'];
              // authData.logout();
              toast.success('You have successfully logged out');
              navigate('/');
            }}
            className="block w-full py-2.5 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom NavLink component
const NavLink = ({ to, children, className }) => {
  return (
    <Link
      to={to}
      className={`block py-2.5 px-4 rounded-md hover:bg-gray-700 ${className}`}
    >
      {children}
    </Link>
  );
};

export default AdminHeader;
