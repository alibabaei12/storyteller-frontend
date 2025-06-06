import React from "react";
import "../../styles/StoryCreation.css";

const tones = [
  {
    id: "romantic",
    name: "Romance",
    description: "Sweet love stories, relationships, and emotional connections",
    icon: "💕",
  },
  {
    id: "mystery",
    name: "Mystery",
    description:
      "Intriguing puzzles, secrets to uncover, and surprising revelations",
    icon: "🔍",
  },
  {
    id: "adventure",
    name: "Adventure",
    description: "Exciting journeys, exploration, and thrilling quests",
    icon: "🗺️",
  },
  {
    id: "shonen",
    name: "Shonen",
    description: "Weak to strong progression, training, and overcoming limits",
    icon: "⚡",
  },
  {
    id: "thriller",
    name: "Thriller",
    description:
      "Heart-pounding suspense, danger, and edge-of-your-seat action",
    icon: "🔥",
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
    id: "horror",
    name: "Horror",
    description: "Scary and supernatural, with dark atmosphere and chills",
    icon: "👻",
  },
  {
    id: "slice-of-life",
    name: "Slice of Life",
    description: "Realistic everyday stories focusing on ordinary moments",
    icon: "☕",
  },
  {
    id: "epic",
    name: "Epic Fantasy",
    description: "Grand heroic tales with larger-than-life adventures",
    icon: "⚔️",
  },
  {
    id: "philosophical",
    name: "Deep & Thoughtful",
    description: "Contemplative stories exploring life's big questions",
    icon: "🤔",
  },
];

const storyLengths = [
  {
    id: "short",
    name: "Quick Adventure",
    description: "A focused story that can be completed in 5-8 turns",
    icon: "📏",
  },
  {
    id: "medium",
    name: "Standard Tale",
    description: "A balanced story experience lasting 10-15 turns",
    icon: "📏📏",
  },
  {
    id: "long",
    name: "Long Epic",
    description: "An extensive tale that can extend to 20+ turns",
    icon: "📏📏📏",
  },
  {
    id: "infinite",
    name: "Infinite Adventure",
    description: "A never-ending story that continues as long as you wish",
    icon: "♾️",
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
  storyLength,
  languageComplexity,
  updateFormData,
  nextStep,
  prevStep,
}) => {
  const handleToneSelect = (toneId) => {
    updateFormData({ tone: toneId });
  };

  const handleLengthSelect = (lengthId) => {
    updateFormData({ story_length: lengthId });
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

      <h4 className="section-title">Select Story Length</h4>
      <div className="length-options">
        {storyLengths.map((item) => (
          <div
            key={item.id}
            className={`length-option ${
              storyLength === item.id ? "selected" : ""
            }`}
            onClick={() => handleLengthSelect(item.id)}
          >
            <div className="length-icon">{item.icon}</div>
            <div className="length-info">
              <h4 className="length-name">{item.name}</h4>
              <p className="length-description">{item.description}</p>
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
