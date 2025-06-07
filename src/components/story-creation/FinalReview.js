import React from "react";
import "../../styles/StoryCreation.css";

// Helper function to get readable names for settings
const getSettingName = (settingId) => {
  const settingMap = {
    cultivation: "Cultivation World",
    fantasy: "Fantasy Realm",
    academy: "Magical Academy",
    scifi: "Sci-Fi Future",
    apocalypse: "Apocalypse Survival",
    gamelike: "Game-like World",
    modern: "Modern Adventure",
  };
  return settingMap[settingId] || settingId;
};

// Helper function to get readable names for character origins
const getOriginName = (originId) => {
  const originMap = {
    normal: "Ordinary Person",
    hidden: "Hidden Potential",
    gifted: "Natural Talent",
    underdog: "Underdog",
    mysterious: "Mysterious Past",
    reincarnated: "Reincarnated",
  };
  return originMap[originId] || originId;
};

// Helper function to get readable names for tones
const getToneName = (toneId) => {
  const toneMap = {
    romantic: "Romance",
    mystery: "Mystery",
    adventure: "Adventure",
    thriller: "Thriller",
    comedy: "Comedy",
    drama: "Drama",
    horror: "Horror",
    "slice-of-life": "Slice of Life",
    epic: "Epic Fantasy",
    philosophical: "Deep & Thoughtful",
  };
  return toneMap[toneId] || toneId;
};

// Helper function to get readable names for gender
const getGenderName = (genderId) => {
  const genderMap = {
    male: "Male",
    female: "Female",
    "non-binary": "Non-binary",
    unspecified: "Unspecified",
  };
  return genderMap[genderId] || genderId;
};

// Helper function to get readable names for language complexity
const getLanguageComplexityName = (complexityId) => {
  const complexityMap = {
    simple: "Simple & Clear",
    moderate: "Moderate",
    complex: "Literary",
  };
  return complexityMap[complexityId] || complexityId;
};

const FinalReview = ({ formData, prevStep, handleSubmit, loading }) => {
  return (
    <div className="creation-step">
      <h3 className="step-title">Review Your Story</h3>
      <p className="step-description">
        Review your selections before creating your interactive story.
      </p>

      <div className="review-card">
        <div className="review-section">
          <h4>Character</h4>
          <p>
            <strong>Name:</strong> {formData.character_name}
          </p>
          <p>
            <strong>Gender:</strong> {getGenderName(formData.character_gender)}
          </p>
          <p>
            <strong>Background:</strong>{" "}
            {getOriginName(formData.character_origin)}
          </p>
        </div>

        <div className="review-section">
          <h4>Setting</h4>
          <p>{getSettingName(formData.setting)}</p>
        </div>

        <div className="review-section">
          <h4>Story Style</h4>
          <p>
            <strong>Genre:</strong> {getToneName(formData.tone)}
          </p>
          <p>
            <strong>Language:</strong>{" "}
            {getLanguageComplexityName(formData.language_complexity)}
          </p>
        </div>
      </div>

      <div className="review-message">
        <p>
          The AI will generate a unique interactive story based on your
          selections. You'll be able to make choices that shape the narrative
          and affect your character's journey.
        </p>
        <p className="infinite-note">
          <strong>Note:</strong> All stories now use Arc-based progression and
          can continue indefinitely based on your choices!
        </p>
      </div>

      <div className="step-navigation">
        <button className="btn secondary" onClick={prevStep} disabled={loading}>
          Back
        </button>
        <button
          className="btn primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating Story..." : "Begin Your Adventure"}
        </button>
      </div>

      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Creating your unique story...</p>
        </div>
      )}
    </div>
  );
};

export default FinalReview;
