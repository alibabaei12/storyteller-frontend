// API service for StoryTeller

const API_BASE_URL = "/api";

// Helper to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `HTTP error ${response.status}`);
  }
  return response.json();
};

// API methods
export const apiService = {
  // Check API status
  checkStatus: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/status`);
      return handleResponse(response);
    } catch (error) {
      console.error("API Status Error:", error);
      throw new Error("Failed to connect to StoryTeller API server");
    }
  },

  // Get all stories
  getStories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stories`);
      return handleResponse(response);
    } catch (error) {
      console.error("Get Stories Error:", error);
      throw new Error("Failed to retrieve stories");
    }
  },

  // Get a specific story
  getStory: async (storyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stories/${storyId}`);
      return handleResponse(response);
    } catch (error) {
      console.error("Get Story Error:", error);
      throw new Error("Failed to retrieve story");
    }
  },

  // Delete a story
  deleteStory: async (storyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stories/${storyId}`, {
        method: "DELETE",
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Delete Story Error:", error);
      throw new Error("Failed to delete story");
    }
  },

  // Create a new story
  createStory: async (storyParams) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storyParams),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Create Story Error:", error);
      throw new Error("Failed to create story");
    }
  },

  // Make a choice in a story
  makeChoice: async (storyId, choiceId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/stories/${storyId}/choices/${choiceId}`,
        {
          method: "POST",
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Make Choice Error:", error);
      throw new Error("Failed to make choice");
    }
  },
};
