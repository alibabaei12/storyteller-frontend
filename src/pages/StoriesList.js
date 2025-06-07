import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import { auth } from "../firebase/config";
import "../styles/StoriesList.css";

const StoriesList = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  // Fetch stories on component mount
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await apiService.getStories();
        setStories(data);
      } catch (error) {
        console.error("Error fetching stories:", error);
        setError("Failed to load stories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Handle continuing a story
  const handleContinueStory = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  // Handle viewing story timeline
  const handleViewTimeline = (storyId) => {
    navigate(`/story/${storyId}/timeline`);
  };

  // Handle deleting a story
  const handleDeleteStory = async (storyId) => {
    if (!window.confirm("Are you sure you want to delete this story?")) {
      return;
    }

    try {
      setDeletingId(storyId);
      await apiService.deleteStory(storyId);
      setStories(stories.filter((story) => story.id !== storyId));
    } catch (error) {
      console.error("Error deleting story:", error);
      setError("Failed to delete story. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Format date from timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  // Share functions
  const openShareModal = (story) => {
    // Check if user is authenticated before allowing sharing
    if (!auth.currentUser) {
      alert("Please sign in to share your stories.");
      return;
    }
    setSelectedStory(story);
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setShareModalOpen(false);
    setSelectedStory(null);
  };

  const getShareUrl = async (storyId) => {
    try {
      // Generate share token for the story
      const response = await apiService.generateShareToken(storyId);
      return response.share_url;
    } catch (error) {
      console.error("Error generating share URL:", error);
      // Show error and don't return a fallback URL
      throw error;
    }
  };

  const getShareText = (story) => {
    return `🌟 Check out my ${story.setting} adventure as ${story.character_name} on @StoryTellerAI! Create your own interactive story where choices matter at`;
  };

  const shareToTwitter = async () => {
    if (!selectedStory) return;
    try {
      const url = await getShareUrl(selectedStory.id);
      const text = getShareText(selectedStory);
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, "_blank", "width=550,height=420");
      closeShareModal();
    } catch (error) {
      alert(`Failed to share to Twitter: ${error.message}`);
    }
  };

  const shareToReddit = async () => {
    if (!selectedStory) return;
    try {
      const url = await getShareUrl(selectedStory.id);
      const title = `${selectedStory.character_name}'s ${selectedStory.setting} Adventure - Interactive Story Experience`;
      const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(title)}`;
      window.open(redditUrl, "_blank");
      closeShareModal();
    } catch (error) {
      alert(`Failed to share to Reddit: ${error.message}`);
    }
  };

  const shareToInstagram = async () => {
    if (!selectedStory) return;
    try {
      const url = await getShareUrl(selectedStory.id);
      const instagramText = `🌟 Just created an epic ${selectedStory.setting} adventure as ${selectedStory.character_name}! ⚔️✨

Interactive storytelling where YOUR choices shape the story! 🎮📚

Create your own adventure: ${url}

#StoryTelling #InteractiveStory #Adventure #Gaming #ChoicesMatter`;

      try {
        await navigator.clipboard.writeText(instagramText);
        alert(
          "Instagram story text copied! Open Instagram and paste in your story."
        );
      } catch (err) {
        console.error("Failed to copy: ", err);
        const textArea = document.createElement("textarea");
        textArea.value = instagramText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert(
          "Instagram story text copied! Open Instagram and paste in your story."
        );
      }
      closeShareModal();
    } catch (error) {
      alert(`Failed to prepare Instagram share: ${error.message}`);
    }
  };

  const copyShareLink = async () => {
    if (!selectedStory) return;
    try {
      const url = await getShareUrl(selectedStory.id);

      // Try to copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert("Share link copied to clipboard!");
      } catch (copyErr) {
        // Fallback to older method for clipboard copy
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Share link copied to clipboard!");
      }
      closeShareModal();
    } catch (error) {
      alert(`Failed to generate share link: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="stories-list-page">
      <h2 className="page-title">Your Stories</h2>

      {error && <div className="error">{error}</div>}

      {stories.length === 0 ? (
        <div className="empty-state-enhanced">
          <div className="empty-icon">📚</div>
          <h3 className="empty-title">Your Story Collection Awaits!</h3>
          <p className="empty-description">
            Ready to embark on your first epic adventure? Create a unique
            character and watch as your choices shape an incredible story
            tailored just for you.
          </p>

          <div className="empty-features">
            <div className="feature-item">
              <span className="feature-emoji">🎭</span>
              <span>Create unique characters</span>
            </div>
            <div className="feature-item">
              <span className="feature-emoji">🌟</span>
              <span>Personalized storylines</span>
            </div>
            <div className="feature-item">
              <span className="feature-emoji">🔀</span>
              <span>Your choices matter</span>
            </div>
          </div>

          <div className="empty-actions">
            <button
              className="btn btn-accent btn-large"
              onClick={() => navigate("/new-story")}
            >
              ✨ Create Your First Story
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/")}>
              Learn More
            </button>
          </div>
        </div>
      ) : (
        <div className="stories-grid">
          {stories.map((story) => (
            <div key={story.id} className="card story-card">
              <h3 className="story-card-title">{story.title}</h3>

              <div className="story-card-details">
                <div className="story-card-info">
                  <p>
                    <strong>Character:</strong> {story.character_name}
                  </p>
                  <p>
                    <strong>Setting:</strong> {story.setting}
                  </p>
                  <p>
                    <strong>Tone:</strong> {story.tone}
                  </p>
                  {story.cultivation_stage &&
                    !["romance", "mystery", "horror", "slice-of-life"].includes(
                      story.setting
                    ) && (
                      <p>
                        <strong>Progress:</strong> {story.cultivation_stage}
                      </p>
                    )}
                  <p className="story-date">
                    Last updated: {formatDate(story.last_updated)}
                  </p>
                </div>
              </div>

              <div className="story-card-actions">
                <button
                  className="btn btn-continue"
                  onClick={() => handleContinueStory(story.id)}
                >
                  Continue
                </button>
                <button
                  className="btn btn-timeline"
                  onClick={() => handleViewTimeline(story.id)}
                >
                  📖 Timeline
                </button>
                <button
                  className="btn btn-share"
                  onClick={() => openShareModal(story)}
                  title="Share this story"
                >
                  🔗 Share
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDeleteStory(story.id)}
                  disabled={deletingId === story.id}
                >
                  {deletingId === story.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="page-actions">
        <button className="btn btn-back-home" onClick={() => navigate("/")}>
          Back to Home
        </button>
        <button
          className="btn btn-create-story"
          onClick={() => navigate("/new-story")}
        >
          Create New Story
        </button>
      </div>

      {/* Share Modal */}
      {shareModalOpen && selectedStory && (
        <div className="modal-overlay" onClick={closeShareModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share "{selectedStory.title}"</h3>
              <button className="modal-close" onClick={closeShareModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <p className="share-description">
                Share your {selectedStory.setting} adventure as{" "}
                {selectedStory.character_name}
              </p>

              <div className="share-options">
                <button
                  onClick={shareToTwitter}
                  className="share-option twitter-option"
                >
                  <span className="share-icon">𝕏</span>
                  <div className="share-details">
                    <span className="share-platform">X (Twitter)</span>
                    <span className="share-desc">Share with a tweet</span>
                  </div>
                </button>

                <button
                  onClick={shareToReddit}
                  className="share-option reddit-option"
                >
                  <span className="share-icon">📰</span>
                  <div className="share-details">
                    <span className="share-platform">Reddit</span>
                    <span className="share-desc">Post to a subreddit</span>
                  </div>
                </button>

                <button
                  onClick={shareToInstagram}
                  className="share-option instagram-option"
                >
                  <span className="share-icon">📷</span>
                  <div className="share-details">
                    <span className="share-platform">Instagram</span>
                    <span className="share-desc">Copy text for story</span>
                  </div>
                </button>

                <button
                  onClick={copyShareLink}
                  className="share-option link-option"
                >
                  <span className="share-icon">🔗</span>
                  <div className="share-details">
                    <span className="share-platform">Copy Link</span>
                    <span className="share-desc">Share anywhere</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesList;
