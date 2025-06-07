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

const languageComplexities = [
  {
    id: "simple",
    name: "Simple & Clear",
    description: "Easy to understand language, like manga or light novels",
    icon: "📖",
    example: "Perfect for non-native speakers or casual reading",
  },
  {
    id: "moderate",
    name: "Moderate",
    description: "Balanced language with some complex vocabulary",
    icon: "📚",
    example: "Like popular fantasy novels - accessible but engaging",
  },
  {
    id: "complex",
    name: "Literary",
    description: "Rich, sophisticated language with advanced vocabulary",
    icon: "📜",
    example: "Classic literature style - challenging but beautiful",
  },
];

const StoryTone = ({
  setting,
  tone,
  languageComplexity,
  updateFormData,
  nextStep,
  prevStep,
}) => {
  const handleToneSelect = (toneId) => {
    updateFormData({ tone: toneId });
  };

  const handleLanguageComplexitySelect = (complexityId) => {
    updateFormData({ language_complexity: complexityId });
  };

  return (
    <div className="creation-step">
      <h3 className="step-title">Story Style & Language</h3>
      <p className="step-description">
        Choose the genre, language complexity, and length of your story.
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

      <h4 className="section-title">Select Language Style</h4>
      <div className="length-options">
        {languageComplexities.map((item) => (
          <div
            key={item.id}
            className={`length-option ${
              languageComplexity === item.id ? "selected" : ""
            }`}
            onClick={() => handleLanguageComplexitySelect(item.id)}
          >
            <div className="length-icon">{item.icon}</div>
            <div className="length-info">
              <h4 className="length-name">{item.name}</h4>
              <p className="length-description">{item.description}</p>
              <p className="length-example">{item.example}</p>
            </div>
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
