import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import PillNav from '../../PillNav';
import { useAuth } from "../../context/AuthContext";
import { logOut } from "../../lib/authService";

const Navbar = () => {
    const isActive = (path) =>  location.pathname === path;
    const { user } = useAuth();
    const navigate = useNavigate();
    const Navitems=[
    { label: 'Home', href: '/' },
    { label: 'Learn', href: '/learn' },
  ];
  if (user) {
    Navitems.push({ label: "Logout", href: "/"})
  }else {
    Navitems.push({ label: "Login", href: "/login" });
  }
   if (user) {
    Navitems.push({ label: "Dashboard", href: "/dashboard" });
  }else {
    Navitems.push({ label: "Sign Up", href: "/signup" });
  }
    const handleLogout = async () => {
        await logOut();
        navigate("/")
    };
    return (
        <div className= 'page-navigation'>
            <PillNav
  logoAlt="Company Logo"
  items={Navitems}
  activeHref={isActive}
  className="custom-nav"
  ease="power2.easeOut"
  baseColor="#000000"
  pillColor="#ffffff"
  hoveredPillTextColor="#ffffff"
  pillTextColor="#000000"
/>
        </div>
    )
};

export default Navbar;
