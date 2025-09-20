// get user

import {
  doc,
  updateDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "./firebase";
import { COLLECTIONS } from "./firestoreStructure";

// we can get user profile
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    if (userDoc.exists()) {
      return { sucess: true, data: { id: userDoc.id, ...userDoc.data() } };
    } else {
      return { sucess: false, error: "User is not found sowwies" };
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    return { sucess: false, error: error.message };
  }
};

// update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
      ...updates,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: error.message };
  }
};

// Update user location
export const updateUserLocation = async (userId, locationData) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
      location: locationData,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user location:", error);
    return { success: false, error: error.message };
  }
};

// Update user interests and preferences
export const updateUserPreferences = async (userId, preferences) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
      interests: preferences.interests || [],
      preferredActivities: preferences.preferredActivities || [],
      availableDays: preferences.availableDays || [],
      ageRange: preferences.ageRange || { min: 18, max: 65 },
      maxDistance: preferences.maxDistance || 25,
      bio: preferences.bio || "",
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return { success: false, error: error.message };
  }
};

// we might need this idk yet if we want to include chats
export const addUserToGroup = async (userId, groupId) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
      currentGroups: arrayUnion(groupId),
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error adding user to group:", error);
    return { success: false, error: error.message };
  }
};

// Remove user from a group (again might need it)
export const removeUserFromGroup = async (userId, groupId) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
      currentGroups: arrayRemove(groupId),
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error removing user from group:", error);
    return { success: false, error: error.message };
  }
};

// Get users for matching (basic version for now we can actaully make a an alg to beter match peopel)
export const getUsersForMatching = async (currentUserId, preferences) => {
  try {
    // Basic query - you can make this more sophisticated
    const usersQuery = query(
      collection(db, COLLECTIONS.USERS),
      where("isActive", "==", true)
    );

    const querySnapshot = await getDocs(usersQuery);
    const users = [];

    querySnapshot.forEach((doc) => {
      if (doc.id !== currentUserId) {
        users.push({ id: doc.id, ...doc.data() });
      }
    });

    return { success: true, data: users };
  } catch (error) {
    console.error("Error getting users for matching:", error);
    return { success: false, error: error.message };
  }
};

// Mark user as inactive
export const deactivateUser = async (userId) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
      isActive: false,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error deactivating user:", error);
    return { success: false, error: error.message };
  }
};
