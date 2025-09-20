// src/pages/SignUpPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../lib/authService";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage("Creating account...");

    // sign up with email and password
    const result = await signUp(email, password, {
      name,
      photoURL: null, // optional for now
    });

    if (result.success) {
      setMessage("Account created successfully!");
      // redirect to profile setup page
      navigate("/setup-profile");
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      {message && <p>{message}</p>}

      <form onSubmit={handleSignUp}>
        <div>
          <label>Name:</label>
          <br />
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Email:</label>
          <br />
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Password:</label>
          <br />
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;
