import React from "react";
import "../../styles/StoryCreation.css";

const settings = [
  {
    id: "modern",
    name: "Modern World",
    description:
      "Contemporary settings - cities, towns, everyday life with hidden secrets and mysteries",
    icon: "🏙️",
  },
  {
    id: "fantasy",
    name: "Fantasy Realm",
    description:
      "Magical worlds with wizards, dragons, enchanted forests, and mystical powers",
    icon: "🧙",
  },
  {
    id: "scifi",
    name: "Sci-Fi Future",
    description:
      "Futuristic worlds with advanced technology, space travel, and scientific wonders",
    icon: "🚀",
  },
  {
    id: "academy",
    name: "School & Academy",
    description:
      "Educational settings - high schools, universities, magical academies, boarding schools",
    icon: "🏫",
  },
  {
    id: "historical",
    name: "Historical Era",
    description:
      "Past time periods - medieval times, ancient civilizations, Victorian era, etc.",
    icon: "🏰",
  },
  {
    id: "gamelike",
    name: "Game World",
    description:
      "Video game-inspired reality with levels, skills, quests, and RPG mechanics",
    icon: "🎮",
  },
  {
    id: "cultivation",
    name: "Cultivation World",
    description:
      "Eastern fantasy realm where people seek immortality through martial arts and spiritual growth",
    icon: "🧘",
  },
  {
    id: "apocalypse",
    name: "Post-Apocalyptic",
    description:
      "Harsh worlds where civilization has collapsed and survival is everything",
    icon: "☢️",
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
