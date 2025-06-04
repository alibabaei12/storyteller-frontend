import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import "../styles/NewStory.css";

const NewStory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    character_name: "",
    setting: "cultivation",
    tone: "adventure",
    character_origin: "normal",
    power_system: "qi",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.character_name.trim()) {
      setError("Please enter a character name");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const newStory = await apiService.createStory(formData);
      navigate(`/story/${newStory.id}`);
    } catch (error) {
      console.error("Error creating story:", error);
      setError("Failed to create story. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="new-story">
      <div className="card">
        <h2 className="page-title">Create New Story</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="story-form">
          <div className="form-group">
            <label htmlFor="character_name">Character Name</label>
            <input
              type="text"
              id="character_name"
              name="character_name"
              value={formData.character_name}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="setting">Setting</label>
            <select
              id="setting"
              name="setting"
              value={formData.setting}
              onChange={handleChange}
            >
              <option value="cultivation">Cultivation</option>
              <option value="gamelike">Game-like</option>
              <option value="academy">Academy</option>
              <option value="dungeon">Dungeon</option>
              <option value="apocalypse">Apocalypse</option>
              <option value="fantasy">Fantasy</option>
              <option value="scifi">Sci-Fi</option>
              <option value="modern">Modern</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="character_origin">Character Origin</label>
            <select
              id="character_origin"
              name="character_origin"
              value={formData.character_origin}
              onChange={handleChange}
            >
              <option value="normal">Normal</option>
              <option value="reincarnated">Reincarnated</option>
              <option value="weak">Weak</option>
              <option value="hidden">Hidden Talent</option>
              <option value="genius">Genius</option>
              <option value="fallen">Fallen Noble</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="power_system">Power System</label>
            <select
              id="power_system"
              name="power_system"
              value={formData.power_system}
              onChange={handleChange}
            >
              <option value="qi">Qi</option>
              <option value="levels">Levels</option>
              <option value="martial">Martial Arts</option>
              <option value="beast">Beast Companion</option>
              <option value="sword">Sword</option>
              <option value="pills">Pills & Alchemy</option>
              <option value="magic">Magic</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tone">Story Tone</label>
            <select
              id="tone"
              name="tone"
              value={formData.tone}
              onChange={handleChange}
            >
              <option value="adventure">Adventure</option>
              <option value="comedy">Comedy</option>
              <option value="serious">Serious</option>
              <option value="overpowered">Overpowered</option>
              <option value="underdog">Underdog</option>
              <option value="romance">Romance</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-accent" disabled={loading}>
              {loading ? "Creating Story..." : "Start Your Adventure"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => navigate("/")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>

        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Creating your story...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewStory;
