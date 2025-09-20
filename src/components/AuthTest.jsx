// basic component to test the auth setup
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { signUp, signIn, signInWithGoogle, logOut } from "../lib/authService";
import { getUserProfile } from "../lib/userService";

const AuthTest = () => {
  // STATE MANAGEMENT
  // react hooks to manage component state (basically data that can change)
  // states to track if user is logged in
  const [user, setUser] = useState(null); // null = not logged in, object = user data
  const [loading, setLoading] = useState(true); // Shows loading while checking auth status
  const [userProfile, setUserProfile] = useState(null);  // User's profile data from Firestore database


  // Form states to track what user types in forms
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");

  // UI states (basically manages what the user can see)
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // true = signup mode, false = login mode

  // useEffect runs when component loads and sets up a listener
  useEffect(() => {
    // onAuthStateChanged listens for login/logout events
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // update states
      setUser(user);
      setLoading(false);

      // if the user is logged in, then get their profile
      if (user) {
        const profileResult = await getUserProfile(user.uid);
        if (profileResult.success) {
          setUserProfile(profileResult.data);
        }
      } else {
        // if user is logged out clear profile data
        setUserProfile(null);
      }
    });

    return unsubscribe;
  }, []);

  // signup function (basically handles creating new user accounts)
  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log('Sign up clicked!');
    console.log('Form data:', { email, name, age, bio, interests });
    setMessage("Creating account...");

    const userData = {
      name,
      age: parseInt(age) || null,
      bio,
      interests: interests
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i),
      preferredActivities: ["outdoor", "food"],
      availableDays: ["saturday", "sunday"],
      ageRange: { min: 18, max: 65 },
      maxDistance: 25,
    };

    // call our custom signUp function (we created in lib/authService)
    const result = await signUp(email, password, userData);

    // handle the results
    if (result.success) {
      setMessage("Account created successfully!");
      clearForm();
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  // sign in function 
  // handles user login with existing accounts
  const handleSignIn = async (e) => {
    e.preventDefault();
    setMessage("Signing in...");

    // calls our signin function (created in lib/authService)
    const result = await signIn(email, password);

    if (result.success) {
      setMessage("Signed in successfully!");
      clearForm();
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  // google sign in function handles the OAuth login popup :D
  const handleGoogleSignIn = async () => {
    setMessage("Signing in with Google...");

    const result = await signInWithGoogle();

    if (result.success) {
      setMessage("Signed in with Google successfully!");
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  // logout function
  const handleLogOut = async () => {
    setMessage("Signing out...");

    const result = await logOut();

    if (result.success) {
      setMessage("Signed out successfully!");
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  // Utliltiy functions 
  // clear input fields
  const clearForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setAge("");
    setBio("");
    setInterests("");
  };

  const clearMessage = () => {
    setMessage("");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Firebase Auth Test Page</h1>

      {message && (
        <div>
          {message}
          <button onClick={clearMessage}>Clear</button>
        </div>
      )}

      {user ? (
        <div>
          <h2>Welcome, {user.displayName || user.email}!</h2>

          <div>
            <h3>Basic login/signup test pagfe</h3>
            <p>UID: {user.uid}</p>
            <p>Email: {user.email}</p>
            <p>Display Name: {user.displayName}</p>
            <p>Photo URL: {user.photoURL}</p>
            <p>Email Verified: {user.emailVerified.toString()}</p>
          </div>

          {userProfile && (
            <div>
              <h3>Firestore User Profile:</h3>
              <p>Name: {userProfile.name}</p>
              <p>Age: {userProfile.age || "Not set"}</p>
              <p>Bio: {userProfile.bio || "No bio"}</p>
              <p>Interests: {userProfile.interests?.join(", ") || "None"}</p>
              <p>Preferred Activities: {userProfile.preferredActivities?.join(", ") || "None"}</p>
              <p>Available Days: {userProfile.availableDays?.join(", ") || "None"}</p>
              <p>Age Range: {userProfile.ageRange?.min}-{userProfile.ageRange?.max}</p>
              <p>Max Distance: {userProfile.maxDistance} miles</p>
              <p>Current Groups: {userProfile.currentGroups?.length || 0}</p>
              <p>Account Created: {userProfile.createdAt?.toDate?.()?.toLocaleDateString() || "Unknown"}</p>
            </div>
          )}

          <button onClick={handleLogOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <div>
            <button onClick={() => setIsSignUp(false)}>Sign In</button>
            <button onClick={() => setIsSignUp(true)}>Sign Up</button>
          </div>

          <div>
            <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>

            <div>
              <label>Email:</label>
              <br />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Password:</label>
              <br />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {isSignUp && (
              <>
                <div>
                  <label>Name:</label>
                  <br />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Age:</label>
                  <br />
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="18"
                    max="100"
                  />
                </div>

                <div>
                  <label>Bio:</label>
                  <br />
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows="3"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label>Interests (comma separated):</label>
                  <br />
                  <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="hiking, coffee, music, art"
                  />
                </div>
              </>
            )}

            <button onClick={isSignUp ? handleSignUp : handleSignIn}>
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </div>

          <div>
            <hr />
            <p>Or:</p>
            <button onClick={handleGoogleSignIn}>Sign In with Google</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthTest;