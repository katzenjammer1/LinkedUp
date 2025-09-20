// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { getUserProfile } from "../lib/userService";

const DashboardPage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError("No user logged in");
        setLoading(false);
        return;
      }

      const result = await getUserProfile(user.uid);
      if (result.sucess) { // note your function returns 'sucess' typo
        setUserProfile(result.data);
      } else {
        setError(result.error || "Failed to fetch profile");
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      {userProfile ? (
        <div>
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
