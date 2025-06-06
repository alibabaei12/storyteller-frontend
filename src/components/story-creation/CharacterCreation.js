import React, { useState, useEffect } from "react";
import "../../styles/StoryCreation.css";

const characterOrigins = [
  {
    id: "ordinary",
    name: "Everyday Hero",
    description:
      "A relatable person living a normal life, ready for extraordinary moments",
    icon: "🙂",
  },
  {
    id: "ambitious",
    name: "Ambitious Dreamer",
    description:
      "Someone with big goals and the drive to achieve them, no matter the obstacles",
    icon: "⭐",
  },
  {
    id: "caring",
    name: "Caring Soul",
    description:
      "A compassionate person who puts others first and brings people together",
    icon: "💖",
  },
  {
    id: "mysterious",
    name: "Mysterious Past",
    description:
      "Someone with secrets and a complex history that slowly unfolds",
    icon: "🎭",
  },
  {
    id: "reincarnated",
    name: "Reincarnated",
    description:
      "Someone reborn with memories or knowledge from a previous life",
    icon: "🔄",
  },
  {
    id: "rebellious",
    name: "Free Spirit",
    description:
      "An independent thinker who challenges rules and follows their own path",
    icon: "🦋",
  },
  {
    id: "intellectual",
    name: "Brilliant Mind",
    description:
      "A clever person who solves problems through wit, knowledge, and creativity",
    icon: "🧠",
  },
  {
    id: "underdog",
    name: "Rising Underdog",
    description:
      "Starting from humble beginnings with the heart to overcome any challenge",
    icon: "🌱",
  },
  {
    id: "charming",
    name: "Natural Charmer",
    description:
      "Someone with magnetic personality who easily connects with others",
    icon: "✨",
  },
];

const genderOptions = [
  {
    id: "male",
    name: "Male",
    icon: "♂️",
  },
  {
    id: "female",
    name: "Female",
    icon: "♀️",
  },
  {
    id: "non-binary",
    name: "Non-binary",
    icon: "⚧️",
  },
  {
    id: "unspecified",
    name: "Unspecified",
    icon: "➖",
  },
];

const CharacterCreation = ({
  characterName,
  characterOrigin,
  characterGender,
  updateFormData,
  nextStep,
  prevStep,
}) => {
  const [name, setName] = useState(characterName);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    // If name is provided in props, update local state
    if (characterName) {
      setName(characterName);
    }
  }, [characterName]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (e.target.value.trim()) {
      setNameError("");
    }
  };

  const handleOriginSelect = (originId) => {
    updateFormData({ character_origin: originId });
  };

  const handleGenderSelect = (genderId) => {
    updateFormData({ character_gender: genderId });
  };

  const handleContinue = () => {
    if (!name.trim()) {
      setNameError("Please enter a character name");
      return;
    }

    updateFormData({ character_name: name.trim() });
    nextStep();
  };

  return (
    <div className="creation-step">
      <h3 className="step-title">Create Your Character</h3>
      <p className="step-description">
        Name your character and choose their background. This will shape their
        journey and experiences.
      </p>

      <div className="character-name-section">
        <label htmlFor="character_name">Character Name</label>
        <input
          type="text"
          id="character_name"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter character name"
          className={nameError ? "input-error" : ""}
          autoFocus
        />
        {nameError && <div className="input-error-message">{nameError}</div>}
      </div>

      <h4 className="origin-title">Character Background</h4>
      <div className="origins-grid">
        {characterOrigins.map((origin) => (
          <div
            key={origin.id}
            className={`origin-card ${
              characterOrigin === origin.id ? "selected" : ""
            }`}
            onClick={() => handleOriginSelect(origin.id)}
          >
            <div className="origin-icon">{origin.icon}</div>
            <h4 className="origin-name">{origin.name}</h4>
            <p className="origin-description">{origin.description}</p>
          </div>
        ))}
      </div>

      <h4 className="gender-title">Character Gender</h4>
      <div className="gender-options">
        {genderOptions.map((gender) => (
          <div
            key={gender.id}
            className={`gender-option ${
              characterGender === gender.id ? "selected" : ""
            }`}
            onClick={() => handleGenderSelect(gender.id)}
          >
            <div className="gender-icon">{gender.icon}</div>
            <span className="gender-name">{gender.name}</span>
          </div>
        ))}
      </div>

      <div className="step-navigation">
        <button type="button" className="btn secondary" onClick={prevStep}>
          Back
        </button>
        <button type="button" className="btn primary" onClick={handleContinue}>
          Next
        </button>
      </div>
    </div>
  );
};

export default CharacterCreation;
