import React from 'react';
import { Link, useLocation} from 'react-router-dom';

const Navbar = () => {
    const isActive = (path) =>  location.pathname === path;

    return (
        <div>
            <h1>
                Logo
            </h1>
            <Link to="/">
                Home
            </Link>
            <Link to="/learn">
                Learn
            </Link>
            <Link to="/login">
                Login
            </Link>
            <Link to="/signup">
                Sign Up
            </Link>
        </div>
    )
};

export default Navbar;
