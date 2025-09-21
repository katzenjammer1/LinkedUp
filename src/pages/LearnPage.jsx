import React from 'react';
import './LearnPage.css';

const LearnPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Cid",
      role: "Full Stack Developer",
      bio: "I love cats :D",
      avatar: "DC",
      skills: ["React", "Node.js", "Database Design", "Python", "C#", "C++", "HTML/CSS"]
    },
    {
      id: 2,
      name: "Tanvi Thomare",
      role: "Lead UI/UX",
      bio: "Second year at SJSU, bringing frontend dev skills to thetable. Experience in HTML/CSS, Java, C/C++. Just recently learned React ",
      avatar: "TT",
      skills: ["HTML/CSS", "Java", "C", "C++", "Figma"]
    },
    {
      id: 3,
      name: "Phillip Le",
      role: "Backend Developer",
      bio: "First time hacker, second year at SJSU. He knew nothing about web dev, and he still doesn’t, but now understands how much he needs to learn! Experience in Java and C/C++.",
      avatar: "PL",
      skills: ["Java", "C", "C++"]
    }
  ];

  return (
    <div className="learn-page-container">
      <div className="learn-content">
        {/* Header Section */}
        <div className="learn-header">
          <h1 className="learn-title">
            Meet <span className="learn-title-highlight">Our Team</span>
          </h1>
          <p className="learn-subtitle">
            We're a passionate group of developers dedicated to helping people build meaningful connections and friendships in their local communities.
          </p>
        </div>

        {/* Team Grid */}
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-avatar">
                {member.avatar}
              </div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-bio">{member.bio}</p>
              <div className="team-skills">
                {member.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="team-mission">
          <h2 className="mission-title">Our Mission</h2>
          <p className="mission-text">
            LinkedUp is a way to be able to make friends in new cities. You have many dating apps these days targeting the crowds for making friends but they are known for their matchmaking rather than matching with friends. LinkedUp allows users to be able to match with a larger group of friends and attend events together. Whether you hit it off or not, LinkedUp will help you find your community. 
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;