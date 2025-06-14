import React, { useState, useEffect } from "react";
import "../../styles/StoryCreation.css";

const characterOrigins = [
  {
    id: "weak",
    name: "Weak/Underdog",
    description:
      "Starting with minimal talent, often mocked but destined to rise through determination",
    icon: "🌱",
  },
  {
    id: "normal",
    name: "Normal/Average",
    description:
      "Typical abilities and steady progress - a relatable character with balanced potential",
    icon: "🙂",
  },
  {
    id: "hidden",
    name: "Hidden Power",
    description:
      "Concealing true abilities or possessing secret techniques unknown to others",
    icon: "🎭",
  },
  {
    id: "reincarnated",
    name: "Reincarnated",
    description:
      "Retaining memories and knowledge from a previous life in this world",
    icon: "🔄",
  },
  {
    id: "genius",
    name: "Genius/Prodigy",
    description:
      "Exceptional talent and rapid advancement that astounds peers and masters",
    icon: "⭐",
  },
  {
    id: "fallen",
    name: "Fallen/Disgraced",
    description:
      "Once powerful but now reduced to lowest levels due to tragedy or betrayal",
    icon: "💔",
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
