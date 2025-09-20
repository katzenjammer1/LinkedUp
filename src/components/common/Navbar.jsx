import React from 'react';
import { Link, useLocation} from 'react-router-dom';

const Navbar = () => {
    const isActive = (path) =>  location.pathname === path;

    return (
        <div>
            <h1>
                Logo
            </h1>
            <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/features"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/features') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Features
              </Link>
              <Link
              to="/login"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/login')
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/signup')
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Sign Up
            </Link>
        </div>
    )
};

export default Navbar;
