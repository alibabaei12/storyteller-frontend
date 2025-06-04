import React from "react";
import "../../styles/StoryCreation.css";

const tones = [
  {
    id: "optimistic",
    name: "Optimistic",
    description:
      "A hopeful journey where challenges are overcome with perseverance and positivity",
    icon: "😊",
  },
  {
    id: "tragic",
    name: "Tragic",
    description:
      "A bittersweet or sorrowful story where loss, sacrifice, or downfall play key roles",
    icon: "😔",
  },
  {
    id: "epic",
    name: "Epic",
    description:
      "A grand, larger-than-life adventure filled with heroism, trials, and major turning points",
    icon: "🏰",
  },
  {
    id: "thrilling",
    name: "Thrilling",
    description:
      "A fast-paced, edge-of-your-seat experience full of danger, twists, and suspense",
    icon: "⚡️",
  },
  {
    id: "mystery",
    name: "Mystery",
    description:
      "A story driven by secrets, hidden truths, and the uncovering of the unknown",
    icon: "🕵️‍♂️",
  },
  {
    id: "romantic",
    name: "Romantic",
    description:
      "A tale centered around relationships, love, and emotional connections",
    icon: "❤️",
  },
  {
    id: "dark",
    name: "Dark",
    description:
      "A grim, morally complex world where choices are hard and consequences are heavy",
    icon: "🌑",
  },
  {
    id: "whimsical",
    name: "Whimsical",
    description:
      "A playful, imaginative story filled with wonder, oddities, and a sense of magic",
    icon: "🎠",
  },
  {
    id: "gritty",
    name: "Gritty",
    description:
      "A realistic, tough world where survival and resilience are constantly tested",
    icon: "🛠️",
  },
  {
    id: "philosophical",
    name: "Philosophical",
    description:
      "A contemplative journey focusing on self-discovery, existential questions, and deep themes",
    icon: "🤔",
  },
];

const storyLengths = [
  {
    id: "short",
    name: "Short Story",
    description: "A brief adventure that can be completed in 5-8 turns",
    icon: "📏",
  },
  {
    id: "medium",
    name: "Medium Length",
    description: "A moderate journey that spans 10-15 turns",
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

// Define power systems by setting (keeping this for future reference but not using in UI)
const powerSystemsBySettings = {
  modern: [
    {
      id: "none",
      name: "No Special Powers",
      description: "A realistic story without supernatural elements",
    },
    {
      id: "hidden",
      name: "Hidden Abilities",
      description:
        "Subtle powers or extraordinary skills that aren't immediately apparent",
    },
  ],
  cultivation: [
    {
      id: "qi",
      name: "Qi Cultivation",
      description:
        "Internal energy that can be refined and used for martial arts",
    },
    {
      id: "spiritual",
      name: "Spiritual Power",
      description: "Connection to mystical forces and spiritual realms",
    },
    {
      id: "elemental",
      name: "Elemental Control",
      description:
        "Mastery over natural elements like fire, water, earth, or wind",
    },
  ],
  fantasy: [
    {
      id: "magic",
      name: "Magic",
      description: "Spells, enchantments, and magical abilities",
    },
    {
      id: "divine",
      name: "Divine Blessing",
      description: "Powers granted by gods or higher beings",
    },
    {
      id: "artifact",
      name: "Magical Artifacts",
      description: "Drawing power from enchanted items and ancient relics",
    },
  ],
  academy: [
    {
      id: "magic",
      name: "Magic",
      description: "Spells, enchantments, and magical abilities",
    },
    {
      id: "psychic",
      name: "Psychic Abilities",
      description: "Mental powers like telepathy, telekinesis, or clairvoyance",
    },
  ],
  scifi: [
    {
      id: "tech",
      name: "Advanced Technology",
      description:
        "High-tech gadgets, cybernetic enhancements, or AI companions",
    },
    {
      id: "psionic",
      name: "Psionic Powers",
      description: "Mental abilities evolved through human advancement",
    },
  ],
  apocalypse: [
    {
      id: "survival",
      name: "Survival Skills",
      description: "Practical abilities to survive in a harsh world",
    },
    {
      id: "mutation",
      name: "Mutations",
      description: "Evolved abilities due to apocalyptic changes",
    },
  ],
  gamelike: [
    {
      id: "levels",
      name: "Level System",
      description: "Growing stronger through gaining experience and levels",
    },
    {
      id: "skills",
      name: "Skill Acquisition",
      description: "Learning and mastering specific abilities and techniques",
    },
    {
      id: "class",
      name: "Character Class",
      description:
        "Specialized role with unique abilities and progression path",
    },
  ],
};

// Default fallback if setting doesn't match
const defaultPowerSystems = [
  {
    id: "none",
    name: "No Special Powers",
    description: "A story focused on natural human abilities",
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
