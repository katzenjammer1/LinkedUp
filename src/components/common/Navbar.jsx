import React, { useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PillNav from '../../PillNav';
import { useAuth } from "../../context/AuthContext";
import { logOut } from "../../lib/authService";
import './Navbar.css'; 

const Navbar = () => {
    const location = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (location.pathname === '/logout' && user) {
            handleLogout();
        }
    }, [location.pathname, user]);
    // Create navigation items based on auth state
    const createNavItems = () => {
        const baseItems = [
            { label: 'Home', href: '/' }, // This will be the logo link
            { label: 'Learn', href: '/learn' },
        ];
        
        if (user) {
            baseItems.push(
                { label: "Dashboard", href: "/dashboard" },
                { label: "Logout", href: "/logout"}
            );
        } else {
            baseItems.push(
                { label: "Login", href: "/login" },
                { label: "Sign Up", href: "/signup" }
            );
        }
        
        return baseItems;
    };

    const handleLogout = async (e) => {
        e?.preventDefault();
        try {
            await logOut();
            navigate("/");
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const logoSrc = "/LinkedUp.png"; 
    
    return (
        <div className='page-navigation'>
            <PillNav
                logo={logoSrc}
                logoAlt="Company Logo"
                items={createNavItems()}
                activeHref={location.pathname}
                className="custom-nav"
                ease="power2.easeOut"
                baseColor="#000000"
                pillColor="#ffffff"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#000000"
                onMobileMenuClick={() => {
                    // Handle mobile menu interactions if needed
                }}
            />
        </div>
    );
};

export default Navbar;