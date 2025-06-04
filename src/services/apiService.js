// API service for StoryTeller

// For production, use the environment variable
// For local development, use localhost with correct port
// For the deployed backend use this as fallback
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5001/api"
    : "https://storyteller-backend-liry.onrender.com/api");

console.log("Using API URL:", API_BASE_URL);

// Helper to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    // Special handling for usage limit errors (HTTP 429)
    if (response.status === 429) {
      throw new Error(
        errorData?.message ||
          "You've reached your daily story continuation limit. Please try again tomorrow."
      );
    }

    throw new Error(errorData?.error || `HTTP error ${response.status}`);
  }
  return response.json();
};

// Common fetch options
const fetchOptions = {
  mode: "cors",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// API methods
export const apiService = {
  // Check API status
  checkStatus: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/status`, fetchOptions);
      return handleResponse(response);
    } catch (error) {
      console.error("API Status Error:", error);
      throw new Error(
        `Failed to connect to StoryTeller API server: ${error.message}`
      );
    }
  },

  // Get all stories
  getStories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stories`, fetchOptions);
      return handleResponse(response);
    } catch (error) {
      console.error("Get Stories Error:", error);
      throw new Error(`Failed to retrieve stories: ${error.message}`);
    }
  },

  // Get a specific story
  getStory: async (storyId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/stories/${storyId}`,
        fetchOptions
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Get Story Error:", error);
      throw new Error(`Failed to retrieve story: ${error.message}`);
    }
  },

  // Delete a story
  deleteStory: async (storyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stories/${storyId}`, {
        ...fetchOptions,
        method: "DELETE",
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Delete Story Error:", error);
      throw new Error(`Failed to delete story: ${error.message}`);
    }
  },

  // Create a new story
  createStory: async (storyParams) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stories`, {
        ...fetchOptions,
        method: "POST",
        body: JSON.stringify(storyParams),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Create Story Error:", error);
      throw new Error(`Failed to create story: ${error.message}`);
    }
  },

  // Make a choice in a story
  makeChoice: async (storyId, choiceId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/stories/${storyId}/choices/${choiceId}`,
        {
          ...fetchOptions,
          method: "POST",
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Make Choice Error:", error);
      return error; // Pass the error through instead of creating a generic one
    }
  },
};
