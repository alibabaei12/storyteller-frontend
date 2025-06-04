import React from "react";
import "../../styles/StoryCreation.css";

const settings = [
  {
    id: "cultivation",
    name: "Cultivation World",
    description:
      "A world where practitioners seek immortality through martial arts and spiritual cultivation",
    icon: "🧘",
  },
  {
    id: "fantasy",
    name: "Fantasy Realm",
    description:
      "A magical world with mythical creatures, enchanted forests, and ancient mysteries",
    icon: "🧙",
  },
  {
    id: "academy",
    name: "Magical Academy",
    description:
      "A school where students learn to control their magical abilities and unlock their potential",
    icon: "🏫",
  },
  {
    id: "scifi",
    name: "Sci-Fi Future",
    description:
      "A futuristic world with advanced technology, space travel, and new frontiers",
    icon: "🚀",
  },
  {
    id: "apocalypse",
    name: "Apocalypse Survival",
    description:
      "A world in ruins where survivors must adapt to new dangers and harsh conditions",
    icon: "☢️",
  },
  {
    id: "gamelike",
    name: "Game-like World",
    description:
      "A world with RPG mechanics like levels, skills, and quests that characters can interact with",
    icon: "🎮",
  },
  {
    id: "modern",
    name: "Modern Adventure",
    description:
      "Contemporary setting with hidden secrets, mysterious organizations, or supernatural elements",
    icon: "🏙️",
  },
];

const SettingSelect = ({ setting, updateFormData, nextStep }) => {
  const handleSettingSelect = (settingId) => {
    updateFormData({ setting: settingId });
  };

  const handleContinue = () => {
    if (!setting) {
      alert("Please select a story setting");
      return;
    }
    nextStep();
  };

  return (
    <div className="creation-step">
      <h3 className="step-title">Choose Your Story Setting</h3>
      <p className="step-description">
        The setting defines the world your character will explore. Each setting
        offers unique experiences and adventures.
      </p>

      <div className="settings-grid">
        {settings.map((item) => (
          <div
            key={item.id}
            className={`setting-card ${setting === item.id ? "selected" : ""}`}
            onClick={() => handleSettingSelect(item.id)}
          >
            <div className="setting-icon">{item.icon}</div>
            <h4 className="setting-name">{item.name}</h4>
            <p className="setting-description">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="step-navigation">
        <div className="spacer"></div> {/* Empty div to maintain spacing */}
        <button type="button" className="btn primary" onClick={handleContinue}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SettingSelect;
