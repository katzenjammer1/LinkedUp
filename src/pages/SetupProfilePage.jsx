// src/pages/SetupProfilePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { updateUserProfile } from "../lib/userService";

const SetupProfilePage = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [age, setAge] = useState("");
  const [minAge, setMinAge] = useState(18); // fixed at 18
  const [maxAge, setMaxAge] = useState(30);
  const [availableDays, setAvailableDays] = useState([]);
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(25);
  const [preferredActivities, setPreferredActivities] = useState("");
  const [message, setMessage] = useState("");

  const toggleDay = (day) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage("No user logged in.");
      return;
    }

    const updates = {
      age: parseInt(age),
      ageRange: { min: minAge, max: parseInt(maxAge) },
      availableDays,
      bio,
      interests: interests.split(",").map((i) => i.trim()),
      location,
      maxDistance: parseInt(radius),
      preferredActivities: preferredActivities
        .split(",")
        .map((a) => a.trim()),
    };

    const result = await updateUserProfile(user.uid, updates);

    if (result.success) {
      setMessage("Profile saved successfully!");
      // redirect to dashboard 
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500); // small delay
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  return (
    <div>
      <h1>Setup Profile</h1>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Age:</label>
          <input
            type="number"
            value={age}
            min="18"
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Age Range</label>
          <div>
            <span>Min:</span>
            <input
            type="number"
            value={maxAge}
            min="18"
            onChange={(e) => setMaxAge(e.target.value)}
            required
            />
            <span>Max:</span>
            <input
            type="number"
            value={maxAge}
            min="18"
            onChange={(e) => setMaxAge(e.target.value)}
            required
          />
          <span> → {minAge} - {maxAge}</span>
          </div>
        </div>

        <div>
          <label>Available Days:</label>
          <div>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <label key={day} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  checked={availableDays.includes(day)}
                  onChange={() => toggleDay(day)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label>Bio:</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div>
          <label>Interests (comma separated):</label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>

        <div>
          <label>Preferred Activities (comma separated):</label>
          <input
            type="text"
            value={preferredActivities}
            onChange={(e) => setPreferredActivities(e.target.value)}
          />
        </div>

        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <label>Radius (miles):</label>
          <input
            type="number"
            value={radius}
            min="1"
            onChange={(e) => setRadius(e.target.value)}
          />
        </div>

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default SetupProfilePage;
