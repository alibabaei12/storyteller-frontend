import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(
        "Failed to sign in: " + (err.message || "Please check your credentials")
      );
      console.error(err);
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError("Failed to sign in with Google: " + err.message);
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to StoryTeller</h2>

        {error && <div className="auth-error">{error}</div>}

        {/* Social Sign-In Options */}
        <div className="social-auth">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="social-auth-button google-auth"
          >
            <span className="social-icon">🌐</span>
            Continue with Google
          </button>
        </div>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Logging in..." : "Login with Email"}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
