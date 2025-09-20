// setting up the firebase auth service
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const GoogleProvider = new GoogleAuthProvider();

// sign up with email and password
export const signUp = async (email, password, userData) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredentials.user;

    // update user profile
    await updateProfile(user, {
      displayName: userData.name,
      photoURL: userData.photoURL || null,
    });

    // create user document in our dn :D
    await createUserDocument(user.uid, {
      name: userData.name,
      email: user.email,
      ...userData,
    });

    return { success: true, user };
  } catch (error) {
    console.error("Error signing up", error);
    return { success: false, error: error.message };
  }
};

// sign in with email and password
export const signIn = async (email, password) => {
  try {
    const userCredientials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredientials.user };
  } catch (error) {
    console.error("Error signing in :c :", error);
    return { success: false, error: error.message };
  }
};

// Sign in with google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, GoogleProvider);
    const user = result.user;

    // check if the user document exists, if not we create it :D
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await createUserDocument(user.uid, {
        name: user.displayName,
        email: user.photoURL,
        // default values
        interests: [],
        bio: "",
        location: null,
        age: null,
      });
    }
    return { success: true, user };
  } catch (error) {
    console.error("Error with Google sign in:", error);
    return { sucess: false, error: error.message };
  }
};

// sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false, error: error.message };
  }
};

// create user document in our db
export const createUserDocument = async (userId, userData) => {
  try {
    await setDoc(doc(db, "users", userId), {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,

      // Default values
      interest: userData.interests || [],
      preferredActivities: userData.preferredActivities || [],
      availableDays: userData.availableDays || [],
      ageRange: userData.ageRange || { min: 18, max: 65 },
      maxDistance: userData.maxDistance || 25,
      bio: userData.bio || "",
      location: userData.location || null,
      age: userData.age || null,

      // chat related stuff (maybe we immplement idk yet)
      currentGroups: [],
      totalGroups: 0,
    });
  } catch (error) {
    console.error("Error creating user document:", error);
    throw error;
  }
};
