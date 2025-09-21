// src/lib/firestoreStructure.js
// This file documents your Firestore database structure

/* 
FIRESTORE COLLECTIONS STRUCTURE:

1. USERS COLLECTION: /users/{userId}
{
  id: "userId123",
  name: "John Doe",
  email: "john@example.com",
  photoURL: "https://...",
  age: 25,
  bio: "Love hiking and coffee!",
  location: {
    latitude: 34.0522,
    longitude: -118.2437,
    city: "Los Angeles",
    state: "CA"
  },
  
  // Matching preferences
  interests: ["hiking", "coffee", "music", "art"],
  preferredActivities: ["outdoor", "food", "entertainment", "fitness"],
  availableDays: ["saturday", "sunday", "weekday_evening"],
  ageRange: { min: 21, max: 35 },
  maxDistance: 25, // miles
  
  // Account info
  isActive: true,
  createdAt: timestamp,
  updatedAt: timestamp,
  
  // Group tracking
  currentGroups: ["groupId1", "groupId2"],
  totalGroups: 5
}

2. GROUPS COLLECTION: /groups/{groupId}
{
  id: "groupId123",
  name: "Coffee Lovers Downtown",
  description: "Let's grab coffee this weekend!",
  activity: "coffee",
  location: {
    name: "Downtown LA",
    coordinates: { lat: 34.0522, lng: -118.2437 }
  },
  
  // Group details
  members: ["userId1", "userId2", "userId3"],
  maxMembers: 6,
  creatorId: "userId1",
  
  // Scheduling
  proposedDate: timestamp,
  confirmedDate: timestamp,
  status: "active", // "active", "scheduled", "completed", "cancelled"
  
  // Timestamps
  createdAt: timestamp,
  updatedAt: timestamp,
  expiresAt: timestamp, // Auto-delete old groups
  
  // Chat
  lastMessage: {
    text: "Looking forward to meeting everyone!",
    userId: "userId2",
    userName: "Jane",
    timestamp: timestamp
  },
  messageCount: 15
}

3. MESSAGES SUB-COLLECTION: /groups/{groupId}/messages/{messageId}
{
  id: "messageId123",
  text: "Hey everyone! Excited for coffee tomorrow",
  userId: "userId1",
  userName: "John Doe",
  userAvatar: "https://...",
  timestamp: timestamp,
  type: "text", // "text", "image", "location", "system"
  
  // Optional fields
  imageUrl: "https://...", // if type === "image"
  location: { lat: 34.0522, lng: -118.2437 }, // if type === "location"
  edited: false,
  editedAt: timestamp
}

4. ACTIVITIES COLLECTION: /activities/{activityId} (Optional - for suggested activities)
{
  id: "activityId123",
  name: "Griffith Observatory",
  category: "sightseeing",
  location: {
    name: "Griffith Observatory",
    address: "2800 E Observatory Rd, Los Angeles, CA",
    coordinates: { lat: 34.1184, lng: -118.3004 }
  },
  description: "Great views of LA and the Hollywood sign",
  rating: 4.5,
  priceRange: "free",
  tags: ["outdoor", "educational", "scenic"]
}

5. USER ACTIVITY HISTORY: /users/{userId}/activities/{activityId} (Optional)
{
  groupId: "groupId123",
  activityName: "Coffee at Blue Bottle",
  date: timestamp,
  rating: 5,
  review: "Great group, had a wonderful time!"
}
*/

// Helper functions for database operations
export const COLLECTIONS = {
  USERS: "users",
  GROUPS: "groups",
  ACTIVITIES: "activities",
  MESSAGES: "messages",
  CHATS: "chats",
};

export const GROUP_STATUS = {
  ACTIVE: "active",
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  LOCATION: "location",
  SYSTEM: "system",
};
