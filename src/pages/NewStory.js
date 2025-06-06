import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import "../styles/NewStory.css";

// Step components
import SettingSelect from "../components/story-creation/SettingSelect";
import CharacterCreation from "../components/story-creation/CharacterCreation";
import StoryTone from "../components/story-creation/StoryTone";
import FinalReview from "../components/story-creation/FinalReview";

const NewStory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    character_name: "",
    character_gender: "unspecified",
    setting: "",
    tone: "adventure",
    character_origin: "normal",
    story_length: "medium", // Default to medium length stories
    language_complexity: "simple", // Default to simple/accessible language
  });

  // Update form data
  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Navigate to next step
  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.character_name.trim()) {
      setError("Please enter a character name");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const newStory = await apiService.createStory(formData);
      navigate(`/story/${newStory.id}`);
    } catch (error) {
      console.error("Error creating story:", error);
      setError("Failed to create story. Please try again.");
      setLoading(false);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SettingSelect
            setting={formData.setting}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <CharacterCreation
            characterName={formData.character_name}
            characterOrigin={formData.character_origin}
            characterGender={formData.character_gender}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <StoryTone
            setting={formData.setting}
            tone={formData.tone}
            storyLength={formData.story_length}
            languageComplexity={formData.language_complexity}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <FinalReview
            formData={formData}
            updateFormData={updateFormData}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="new-story">
      <div className="card creation-card">
        <h2 className="page-title">Create Your Story</h2>

        {error && <div className="error">{error}</div>}

        <div className="progress-indicator">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
              <div className="step-number">1</div>
              <div className="step-label">Setting</div>
            </div>
            <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
              <div className="step-number">2</div>
              <div className="step-label">Character</div>
            </div>
            <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
              <div className="step-number">3</div>
              <div className="step-label">Style</div>
            </div>
            <div className={`step ${currentStep >= 4 ? "active" : ""}`}>
              <div className="step-number">4</div>
              <div className="step-label">Review</div>
            </div>
          </div>
        </div>

        <div className="step-content">{renderStep()}</div>

        <div className="creation-actions">
          <button
            type="button"
            className="btn"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewStory;
