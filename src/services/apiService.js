// API service for StoryTeller
import { auth } from "../firebase/config";

// For production, use the environment variable
// For local development, use localhost with correct port
// For the deployed backend use this as fallback
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5001/api"
    : "https://storyteller-backend-liry.onrender.com/api");

console.log("Using API URL:", API_BASE_URL);

// Helper to get auth token
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      console.log("Getting auth token for user:", user.email);
      const token = await user.getIdToken(true); // Force refresh token
      console.log(
        "Token retrieved successfully (first 20 chars):",
        token.substring(0, 20)
      );
      return token;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  } else {
    console.log("No current user found when requesting token");
  }
  return null;
};

// Helper to create fetch options with authentication
const createFetchOptions = async (method = "GET", body = null) => {
  const options = {
    method,
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  // Add auth token if available
  const token = await getAuthToken();
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
    console.log("Added Authorization header with token");
  } else {
    console.warn("No auth token available for request");
  }

  // Add user ID header for usage tracking
  if (auth.currentUser) {
    options.headers["X-User-ID"] = auth.currentUser.uid;
    console.log("Added X-User-ID header:", auth.currentUser.uid);
  }

  // Add body if provided
  if (body) {
    options.body = JSON.stringify(body);
  }

  console.log("Request options prepared:", {
    method: options.method,
    headers: Object.keys(options.headers),
    hasBody: !!options.body,
  });

  return options;
};

// Helper to handle API responses
const handleResponse = async (response) => {
  console.log("API response received:", {
    status: response.status,
    ok: response.ok,
    statusText: response.statusText,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error("API error response:", errorData);

    // Special handling for usage limit errors (HTTP 429)
    if (response.status === 429) {
      throw new Error(
        errorData?.message ||
          "You've reached your daily story continuation limit. Please try again tomorrow."
      );
    }

    // Special handling for authentication errors
    if (response.status === 401) {
      throw new Error(
        errorData?.error || "Authentication required. Please sign in."
      );
    }

    throw new Error(errorData?.error || `HTTP error ${response.status}`);
  }
  return response.json();
};

// API methods
export const apiService = {
  // Check API status
  checkStatus: async () => {
    try {
      const options = await createFetchOptions();
      console.log("Checking API status...");
      const response = await fetch(`${API_BASE_URL}/status`, options);
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
      const options = await createFetchOptions();
      console.log("Getting all stories...");
      const response = await fetch(`${API_BASE_URL}/stories`, options);
      return handleResponse(response);
    } catch (error) {
      console.error("Get Stories Error:", error);
      throw new Error(`Failed to retrieve stories: ${error.message}`);
    }
  },

  // Get a specific story
  getStory: async (storyId) => {
    try {
      const options = await createFetchOptions();
      console.log(`Getting story ${storyId}...`);
      const response = await fetch(
        `${API_BASE_URL}/stories/${storyId}`,
        options
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
      const options = await createFetchOptions("DELETE");
      console.log(`Deleting story ${storyId}...`);
      const response = await fetch(
        `${API_BASE_URL}/stories/${storyId}`,
        options
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Delete Story Error:", error);
      throw new Error(`Failed to delete story: ${error.message}`);
    }
  },

  // Create a new story
  createStory: async (storyParams) => {
    try {
      console.log("Creating new story with params:", storyParams);
      const options = await createFetchOptions("POST", storyParams);
      const response = await fetch(`${API_BASE_URL}/stories`, options);
      return handleResponse(response);
    } catch (error) {
      console.error("Create Story Error:", error);
      throw new Error(`Failed to create story: ${error.message}`);
    }
  },

  // Make a choice in a story
  makeChoice: async (storyId, choiceId) => {
    try {
      console.log(`Making choice ${choiceId} in story ${storyId}...`);
      const options = await createFetchOptions("POST");
      const response = await fetch(
        `${API_BASE_URL}/stories/${storyId}/choices/${choiceId}`,
        options
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Make Choice Error:", error);
      throw error; // Throw the error instead of returning it
    }
  },

  // Get user usage statistics
  getUserUsage: async () => {
    try {
      const options = await createFetchOptions();
      console.log("Getting user usage statistics...");
      const response = await fetch(`${API_BASE_URL}/usage`, options);
      return handleResponse(response);
    } catch (error) {
      console.error("Get Usage Error:", error);
      throw new Error(`Failed to get usage statistics: ${error.message}`);
    }
  },
};
