import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/authProvider";
import { toast } from "sonner";
import Cookies from 'js-cookie';
const Header = () => {
  const authData = useContext(AuthContext);
  const isLoggedIn = authData !== null;
  const navigate = useNavigate();
  return (
    <nav className=" bg-white fixed shadow-md w-full h-16 px-2  md:px-4 z-50 ">
      {/* desktop */}
      <div className="container mx-auto px-6 py-4 flex justify-between">
        <Link to="/">
          <img
            src="https://th.bing.com/th/id/OIP.8Pd0LvvqJGO9zfIYOmHxMAAAAA?pid=ImgDet&w=195&h=242&c=7&dpr=1.6"
            alt="Home"
            className="h-8 w-10"
          />
        </Link>
        <Link to="/" className="text-xl font-bold">
          CodePlanet
        </Link>
        <ul className="flex space-x-20 ml-20">
          <li>
            {/* <Link
              to={"/"}
              className="text-base md:text-lg font-semibold hover:text-red-500 hover:text-lg"
            >
              Home
            </Link> */}
          </li>
          <li>
            <Link
              to={isLoggedIn ? "/ide" : "/login"}
              className="text-base md:text-lg hover:text-red-500 font-semibold"
            >
              Code
            </Link>
          </li>
          <li>
            <Link
              to={isLoggedIn ? "/problems" : "/login"}
              className="text-base md:text-lg hover:text-red-500 font-semibold"
            >
              Problems
            </Link>
          </li>
         
          <li>
            <Link
              to={isLoggedIn ? "/leaderboard" : "/login"}
              className="text-base md:text-lg hover:text-red-500 font-semibold"
            >
              Leaderboard
            </Link>
          </li>
        </ul>
        <div className="ml-auto flex space-x-12">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="text-base md:text-lg mr-4 hover:text-red-500 font-semibold"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-base md:text-lg hover:text-red-500 font-semibold"
              >
                Signup
              </Link>
            </>
          ) : (

            <>

              <Link
                to="/profile"
                className="text-base md:text-lg mr-4 hover:text-red-500 font-semibold"
              >
                Profile
              </Link>

              <Link to="/"
                className="text-base md:text-lg hover:text-red-500 font-semibold ">
                <button
                  onClick={() => {
                    // authData.logout();
                    Cookies.remove('token');
                    Cookies.remove('user');
                    Cookies.remove('role')
                    console.log("hello logout");
                    setAuth(null);
                    delete axios.defaults.headers.common['Authorization'];
                    localStorage.clear();
                    toast.success('You have successfully logged out');
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* mobile */}
    </nav>
  );
};

export default Header;
