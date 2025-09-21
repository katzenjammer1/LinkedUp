import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../lib/userService";
import { findMatches } from "../lib/matchingService";
import Stack from "../components/Stack/Stack";

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;

      try {
        // Load current user's profile
        const result = await getUserProfile(user.uid);
        if (result.success) {
          setProfile(result.data);

          // Find matches (skip location for now)
          const matchResult = await findMatches(user, result.data, null);
          if (matchResult.success) {
            setMatches(matchResult.data.slice(0, 5)); // top 5 matches
          }
        }
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  if (loading) return <p>Loading dashboard...</p>;
  if (!profile) return <p>No profile found. Please set up your profile.</p>;

  // Convert matches to {id, img} for Stack
  console.log("Matches:", matches);
  const matchImages = matches.map((m) => ({
    id: m.id,
    img: m.photoURL || "https://placehold.co/200x200?text=No+Photo",
    name: m.name || "Unknown",
    bio: m.bio || "",
    age: m.age,
    interests: m.interests || [],
    preferredActivities: m.preferredActivities || [],
  }));

  return (
   <div className="dashboard">
  <h1>Welcome back, {profile.name || "Friend"}!</h1>

  {/* Current User Info */}
  <section className="user-profile">
    <h2>Your Profile</h2>
    <div className="profile-card">
      <img
        src={profile.photoURL || "https://placehold.co/100x100?text=No+Photo"}
        alt={profile.name || "Profile Photo"}
        className="profile-photo"
      />
      <div className="profile-info">
        <p><strong>Name:</strong> {profile.name || "Unknown"}</p>
        {profile.age && <p><strong>Age:</strong> {profile.age}</p>}
        {profile.bio && <p><strong>Bio:</strong> {profile.bio}</p>}
        {profile.interests?.length > 0 && (
          <p><strong>Interests:</strong> {profile.interests.join(", ")}</p>
        )}
        {profile.preferredActivities?.length > 0 && (
          <p><strong>Preferred Activities:</strong> {profile.preferredActivities.join(", ")}</p>
        )}
      </div>
    </div>
  </section>

  {/* Matches */}
  <section>
    <h2>Your Top Matches</h2>
    {matches.length > 0 ? (
      <Stack
        randomRotation={true}
        sensitivity={180}
        sendToBackOnClick={true}
        cardDimensions={{ width: 200, height: 200 }}
        cardsData={matchImages}
      />
    ) : (
      <p>No matches found. Try updating your preferences!</p>
    )}
  </section>
</div>
  );
}
