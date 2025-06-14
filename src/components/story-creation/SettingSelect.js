import React from "react";
import "../../styles/StoryCreation.css";

const mangaGenres = [
  {
    id: "cultivation_world",
    name: "Cultivation Progression",
    description:
      "Start as a weak disciple and discover hidden masters, ancient techniques, and grow stronger through trials",
    icon: "🧘",
    tags: ["Weak to Strong", "Hidden Master", "Martial Arts"],
  },
  {
    id: "fantasy_adventure",
    name: "Fantasy Adventure",
    description:
      "Epic quests in magical worlds, discover ancient powers, face legendary creatures, and forge your destiny",
    icon: "⚔️",
    tags: ["Magic", "Quests", "Hero's Journey"],
  },
  {
    id: "academy_magic",
    name: "Magic Academy",
    description:
      "Rise through academy ranks, master magical arts, compete with rivals, and uncover school secrets",
    icon: "🏰",
    tags: ["School Life", "Magic", "Rivalries"],
  },
  // More genres will be added later
];

const SettingSelect = ({ setting, manga_genre, updateFormData, nextStep }) => {
  const handleGenreSelect = (genreId) => {
    // Map manga genre back to compatible setting for backend
    const genreMapping = {
      cultivation_world: "cultivation",
      fantasy_adventure: "fantasy",
      academy_magic: "academy",
    };

    updateFormData({
      setting: genreMapping[genreId] || "cultivation",
      manga_genre: genreId,
      tone: "shonen", // Default for manga
      character_origin: "weak", // Default for progression stories
    });
  };

  const handleContinue = () => {
    if (!manga_genre) {
      alert("Please select a manga genre");
      return;
    }
    nextStep();
  };

  // Get currently selected manga genre
  const selectedGenre = mangaGenres.find((genre) => genre.id === manga_genre);

  return (
    <div className="creation-step">
      <h3 className="step-title">Choose Your Manga Genre</h3>
      <p className="step-description">
        Select the type of progression story you want to experience. Each genre
        offers unique growth paths and adventures.
      </p>

      <div className="settings-grid">
        {mangaGenres.map((genre) => (
          <div
            key={genre.id}
            className={`setting-card ${
              selectedGenre?.id === genre.id ? "selected" : ""
            }`}
            data-genre={genre.id}
            onClick={() => handleGenreSelect(genre.id)}
          >
            <div className="setting-icon">{genre.icon}</div>
            <h4 className="setting-name">{genre.name}</h4>
            <p className="setting-description">{genre.description}</p>
            <div className="genre-tags">
              {genre.tags.map((tag, index) => (
                <span key={index} className="genre-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="manga-coming-soon">
        <p className="coming-soon-text">
          📚 More manga genres coming soon: Reincarnation Revenge, Apocalypse
          Survival, Game World, and more!
        </p>
      </div>

      <div className="step-navigation">
        <div className="spacer"></div>
        <button type="button" className="btn primary" onClick={handleContinue}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SettingSelect;
