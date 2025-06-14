import React from "react";
import "../../styles/StoryCreation.css";

const tones = [
  {
    id: "shonen",
    name: "Shonen",
    description: "Weak to strong progression, training, and overcoming limits",
    icon: "⚡",
  },
  {
    id: "adventure",
    name: "Adventure",
    description: "Exciting journeys, exploration, and thrilling quests",
    icon: "🗺️",
  },
  {
    id: "mystery",
    name: "Mystery",
    description:
      "Intriguing puzzles, secrets to uncover, and surprising revelations",
    icon: "🔍",
  },
  {
    id: "romantic",
    name: "Romance",
    description: "Sweet love stories, relationships, and emotional connections",
    icon: "💕",
  },
  {
    id: "comedy",
    name: "Comedy",
    description: "Light-hearted fun, humor, and amusing situations",
    icon: "😄",
  },
  {
    id: "drama",
    name: "Drama",
    description:
      "Deep emotions, character development, and meaningful conflicts",
    icon: "🎭",
  },
  {
    id: "thriller",
    name: "Thriller",
    description:
      "Heart-pounding suspense, danger, and edge-of-your-seat action",
    icon: "🔥",
  },
  {
    id: "epic",
    name: "Epic Fantasy",
    description: "Grand heroic tales with larger-than-life adventures",
    icon: "⚔️",
  },
];

const StoryTone = ({ setting, tone, updateFormData, nextStep, prevStep }) => {
  const handleToneSelect = (toneId) => {
    updateFormData({ tone: toneId });
  };

  return (
    <div className="creation-step">
      <h3 className="step-title">Story Style</h3>
      <p className="step-description">
        Choose the style and genre for your story.
      </p>

      <h4 className="section-title">Select a Style/Genre</h4>
      <div className="tone-grid">
        {tones.map((item) => (
          <div
            key={item.id}
            className={`tone-card ${tone === item.id ? "selected" : ""}`}
            onClick={() => handleToneSelect(item.id)}
          >
            <div className="tone-icon">{item.icon}</div>
            <h4 className="tone-name">{item.name}</h4>
            <p className="tone-description">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="step-navigation">
        <button type="button" className="btn secondary" onClick={prevStep}>
          Back
        </button>
        <button type="button" className="btn primary" onClick={nextStep}>
          Next
        </button>
      </div>
    </div>
  );
};

export default StoryTone;
