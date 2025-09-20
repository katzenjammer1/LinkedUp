// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { getUserProfile } from "../lib/userService";
import { onAuthStateChanged } from "firebase/auth";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setError("No user logged in");
        setLoading(false);
        return;
      }

      setUser(currentUser);

      const result = await getUserProfile(currentUser.uid);
      if (result.success) { // Fix the typo in your userService.js too
        setUserProfile(result.data);
      } else {
        setError(result.error || "Failed to fetch profile");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Get profile picture from either Firebase Auth or Firestore
  const profilePicURL = user?.photoURL || userProfile?.photoURL;

  return (
    <div>
      <h1>Dashboard</h1>
      {userProfile ? (
        <div>
          {/* Display Profile Picture */}
          {profilePicURL && (
            <div>
              <p><strong>Profile Picture:</strong></p>
              <img 
                src={profilePicURL} 
                alt="Profile" 
                width="150" 
                height="150"
              />
            </div>
          )}
          
          <p><strong>Name:</strong> {userProfile.name}</p>
          <p><strong>Email:</strong> {userProfile.email}</p>
          <p><strong>Age:</strong> {userProfile.age || "Not set"}</p>
          <p><strong>Bio:</strong> {userProfile.bio || "Not set"}</p>
          <p><strong>Interests:</strong> {userProfile.interests?.join(", ") || "None"}</p>
          <p><strong>Preferred Activities:</strong> {userProfile.preferredActivities?.join(", ") || "None"}</p>
          <p><strong>Available Days:</strong> {userProfile.availableDays?.join(", ") || "None"}</p>
          <p><strong>Age Range:</strong> {userProfile.ageRange?.min}-{userProfile.ageRange?.max}</p>
          <p><strong>Max Distance:</strong> {userProfile.maxDistance} miles</p>
          <p><strong>Location:</strong> {userProfile.location || "Not set"}</p>
        </div>
      ) : (
        <p>No profile data available</p>
      )}
    </div>
  );
};

export default DashboardPage;