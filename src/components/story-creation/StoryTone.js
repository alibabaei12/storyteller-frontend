import React from "react";
import "../../styles/StoryCreation.css";

const tones = [
  {
    id: "optimistic",
    name: "Optimistic",
    description:
      "Hopeful and uplifting, focusing on growth and positive outcomes",
    icon: "🌅",
  },
  {
    id: "tragic",
    name: "Tragic",
    description: "Bittersweet and sorrowful, exploring loss and sacrifice",
    icon: "💔",
  },
  {
    id: "epic",
    name: "Epic",
    description: "Grand and heroic, with larger-than-life challenges",
    icon: "⚔️",
  },
  {
    id: "thrilling",
    name: "Thrilling",
    description: "Fast-paced and exciting, full of danger and suspense",
    icon: "⚡",
  },
  {
    id: "mystery",
    name: "Mystery",
    description: "Intriguing and puzzling, driven by secrets and discovery",
    icon: "🔍",
  },
  {
    id: "romantic",
    name: "Romantic",
    description: "Focusing on relationships and emotional connections",
    icon: "💕",
  },
  {
    id: "dark",
    name: "Dark",
    description: "Grim and morally complex, exploring difficult choices",
    icon: "🌑",
  },
  {
    id: "whimsical",
    name: "Whimsical",
    description: "Playful and imaginative, filled with wonder and oddities",
    icon: "🎭",
  },
  {
    id: "gritty",
    name: "Gritty",
    description: "Realistic and tough, where survival is constantly tested",
    icon: "🏜️",
  },
  {
    id: "philosophical",
    name: "Philosophical",
    description: "Contemplative and deep, exploring existential questions",
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

const StoryTone = ({
  setting,
  tone,
  storyLength,
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

  return (
    <div className="creation-step">
      <h3 className="step-title">Story Style & Length</h3>
      <p className="step-description">
        Choose the emotional tone and length of your story.
      </p>

      <h4 className="section-title">Select a Tone</h4>
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
