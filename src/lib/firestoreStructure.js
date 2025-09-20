/*
1. USERS COLLECTION: /users/{userId}
{
  id: "userId1",
  name: "cid",
  email: "cid@example.com",
  photoURL: "https://cid",
  age: 23,
  bio: "I love my gf <3",
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
*/
// Helper functions for database operations
export const COLLECTIONS = {
  USERS: "users",
  GROUPS: "groups",
  ACTIVITIES: "activities",
  MESSAGES: "messages",
};
