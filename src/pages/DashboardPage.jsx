import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../lib/userService";
import { findMatches } from "../lib/matchingService";
import Stack from "../components/Stack/Stack";
import { motion, AnimatePresence } from "framer-motion";
import ChatsSection from "../components/ChatSection";
import "./Dashboard.css";

// Helper to get or create one-on-one chat
import { getOrCreateChat } from "../lib/chatService";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [activeChats, setActiveChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  // Dummy recommended places
  const recommendedPlaces = [
    { id: 1, name: "Coffee & Code Café", category: "Café", rating: 4.8, image: "https://placehold.co/300x200/8B4513/FFFFFF?text=Coffee+Cafe", description: "Perfect spot for remote work and meeting new people" },
    { id: 2, name: "Sunset Park", category: "Outdoor", rating: 4.6, image: "https://placehold.co/300x200/228B22/FFFFFF?text=Sunset+Park", description: "Great for outdoor activities and group fitness" },
    { id: 3, name: "Tech Hub Coworking", category: "Workspace", rating: 4.9, image: "https://placehold.co/300x200/4169E1/FFFFFF?text=Tech+Hub", description: "Network with like-minded professionals" },
    { id: 4, name: "Community Art Center", category: "Arts", rating: 4.7, image: "https://placehold.co/300x200/9370DB/FFFFFF?text=Art+Center", description: "Creative workshops and artistic community" }
  ];

  // Load user profile and matches
  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;
      try {
        const result = await getUserProfile(user.uid);
        if (result.success) {
          setProfile(result.data);
          const matchResult = await findMatches(user, result.data, null);
          if (matchResult.success) {
            setMatches(matchResult.data.slice(0, 5));
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

  const handleEditProfile = () => navigate("/setup-profile");
  const handleSetupProfile = () => navigate("/setup-profile");

  // Start one-on-one chat with a match
  const handleChatClick = async (match) => {
    if (!user) return;

    const chatId = await getOrCreateChat(user.uid, match.id, match.name);

    setActiveChats(prev => {
      if (!prev.some(c => c.id === chatId)) {
        return [...prev, { id: chatId, name: match.name }];
      }
      return prev;
    });

    setActiveChat({ id: chatId, name: match.name });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="dashboard-error">
        <h2>Profile Setup Required</h2>
        <p>Please set up your profile to get started.</p>
        <button className="setup-profile-btn" onClick={handleSetupProfile}>
          Set Up Profile
        </button>
      </div>
    );
  }

  const matchImages = matches.map(m => ({
    id: m.id,
    img: m.photoURL || "https://placehold.co/200x200/FF6B6B/FFFFFF?text=No+Photo",
    name: m.name || "Unknown",
    bio: m.bio || "",
    age: m.age,
    interests: m.interests || [],
    preferredActivities: m.preferredActivities || [],
  }));

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        {/* Profile Section */}
        <section className="dashboard-card profile-card">
          <div className="card-header">
            <h2>Your Profile</h2>
            <button className="edit-btn" onClick={handleEditProfile}>Edit</button>
          </div>
          <div className="profile-content">
            <div className="profile-avatar">
              <img src={profile.photoURL || "https://placehold.co/80x80/4ECDC4/FFFFFF?text=👤"} alt="Profile" className="avatar-img" />
            </div>
            <div className="profile-details">
              <h3>{profile.name || "Unknown"}</h3>
              {profile.age && <p>Age: {profile.age}</p>}
              {profile.bio && <p>"{profile.bio}"</p>}
              {profile.interests?.length > 0 && (
                <div className="profile-tags">
                  <span>Interests:</span>
                  <div className="tags">
                    {profile.interests.slice(0, 3).map((i, idx) => <span key={idx} className="tag">{i}</span>)}
                    {profile.interests.length > 3 && <span className="tag tag-more">+{profile.interests.length - 3} more</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Matches Section */}
        <section className="dashboard-card matches-card">
          <div className="card-header">
            <h2>Your Matches</h2>
            <span className="match-count">{matches.length} found</span>
          </div>
          <div className="matches-content">
            {matches.length > 0 ? (
              <Stack
                randomRotation
                sensitivity={180}
                sendToBackOnClick
                cardDimensions={{ width: 180, height: 220 }}
                cardsData={matchImages}
                onSelectCard={setSelectedCard}
              />
            ) : (
              <div className="no-matches">
                <p>No matches found yet.</p>
                <button onClick={handleEditProfile}>Update Preferences</button>
              </div>
            )}
          </div>
        </section>

        {/* Chats Section */}
        <section className="dashboard-card chats-card">
          <ChatsSection user={user} chats={activeChats} />
        </section>

        {/* Recommended Places */}
        <section className="dashboard-card places-card">
          <div className="card-header">
            <h2>Recommended Places</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="places-grid">
          {recommendedPlaces.map(place => (
            <div key={place.id} className="place-item">
              <img src={place.image} alt={place.name} className="place-image" />
              <div className="place-info">
                <h4>{place.name}</h4>
                <p className="place-category">{place.category}</p>
                <p className="place-rating">Rating: {place.rating}</p>
                <p className="place-description">{place.description}</p>
              </div>
            </div>
          ))}
        </div>
        </section>
      </div>

      {/* Global Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div className="modal-overlay" onClick={() => setSelectedCard(null)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-card" onClick={e => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}>
              <img src={selectedCard.img} alt={selectedCard.name} className="modal-img" />
              <h2>{selectedCard.name}</h2>
              <p>{selectedCard.bio || "No bio available"}</p>
              <p>Age: {selectedCard.age || "N/A"}</p>
              {selectedCard.interests.length > 0 && <p>Interests: {selectedCard.interests.join(', ')}</p>}
              {selectedCard.preferredActivities.length > 0 && <p>Activities: {selectedCard.preferredActivities.join(', ')}</p>}
              <div className="modal-actions">
                <button onClick={() => handleChatClick(selectedCard)}>Chat</button>
                <button onClick={() => setSelectedCard(null)}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
