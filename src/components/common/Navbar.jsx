import React from 'react';
import { Link, useNavigate, useLocation} from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { logOut } from "../../lib/authService";

const Navbar = () => {
    const isActive = (path) =>  location.pathname === path;
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logOut();
        navigate("/")
    };
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
            {user ? (
                <>
                    <Link to="/dashboard">Dashboard</Link> |{" "}
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link><Link to="/signup">Sign Up</Link>
                </>
            )}
        </div>
    )
};

export default Navbar;
