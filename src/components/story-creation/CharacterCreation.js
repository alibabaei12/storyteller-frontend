import React, { useState, useEffect } from "react";
import "../../styles/StoryCreation.css";

const characterOrigins = [
  {
    id: "normal",
    name: "Ordinary Person",
    description:
      "A regular person with no special background, relying on wit and determination",
    icon: "👤",
  },
  {
    id: "hidden",
    name: "Hidden Potential",
    description:
      "Someone with latent abilities that have yet to be discovered or unlocked",
    icon: "✨",
  },
  {
    id: "gifted",
    name: "Natural Talent",
    description:
      "Born with natural aptitude and quick to learn new skills and abilities",
    icon: "🌟",
  },
  {
    id: "underdog",
    name: "Underdog",
    description:
      "Starting at a disadvantage but with the determination to overcome all obstacles",
    icon: "🦮",
  },
  {
    id: "mysterious",
    name: "Mysterious Past",
    description:
      "Someone with an enigmatic history that slowly unravels throughout the story",
    icon: "❓",
  },
  {
    id: "reincarnated",
    name: "Reincarnated",
    description: "Reborn with memories or knowledge from a previous life",
    icon: "🔄",
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
