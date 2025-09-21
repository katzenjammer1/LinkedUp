import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PillNav from '../../PillNav';
import { useAuth } from "../../context/AuthContext";
import { logOut } from "../../lib/authService";

const Navbar = () => {
    const location = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // Create navigation items based on auth state
    const createNavItems = () => {
        const baseItems = [
            { label: 'Home', href: '/' }, 
            { label: 'Learn', href: '/learn' },
        ];
        
        if (user) {
            baseItems.push(
                { label: "Dashboard", href: "/dashboard" },
                { label: "Logout", href: "#", onClick: handleLogout }
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
        
                }}
            />
        </div>
    );
};

export default Navbar;