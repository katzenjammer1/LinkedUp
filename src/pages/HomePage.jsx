import React from 'react';
import { useNavigate } from 'react-router-dom';
import Features from '../components/common/Features';
import Footer from '../components/common/footer';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="homepage-container">
      <div className="pitch-section">
        <h1 className="pitch-title">
          <span className="pitch-highlight">New Friends</span> are just around the corner
        </h1>
        <p className="pitch-description">
          Choose your hobbies & free time, we'll match you with people nearby to hang out with.
        </p>
        <button className="get-started-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
      
      {/* You can add Features and Footer components here if needed */}
      {/* <Features /> */}
      {/* <Footer /> */}
    </div>
  );
};

export default HomePage;