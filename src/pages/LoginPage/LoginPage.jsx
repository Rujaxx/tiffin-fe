import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";


const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Replace this with a login API call and save token so that user can be redirected to admin page and use it for further API calls
    const loginApiCall = async () => {
      const response = await fetch("https://tiffin-be.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Save token to local storage
      return data;
    };

    // // Mock API call
    // function mockApiResponse() {
    //       return new Promise((resolve, reject) => {
    //           setTimeout(() => {
    //               if (username === "admin" && password === "password123") {
    //                   resolve({ success: true });
    //               } else {
    //                   reject({ success: false, message: "Invalid username or password" });
    //               }
    //           }, 1000);
    //       });
    //   }

    try {
        const response = await loginApiCall();
        // const response = await mockApiResponse(); // Use this line for testing without a real API call
      if (response) {
        navigate("/dashboard"); // Redirect to the admin table page
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
