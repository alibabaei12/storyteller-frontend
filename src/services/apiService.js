// API service for StoryTeller
import { auth } from "../firebase/config";

// Base URL for the backend server (without /api path)
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5001"
    : "https://storyteller-backend-liry.onrender.com");

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
const createFetchOptions = async (
  method = "GET",
  body = null,
  timeout = 30000
) => {
  const options = {
    method,
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(timeout), // 30 second timeout by default
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

// Helper to handle fetch with timeout and network errors
const fetchWithTimeout = async (url, options) => {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    console.error("Fetch error:", error);

    // Handle timeout errors
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      throw new Error(
        "Request timed out. Our AI might be generating a really amazing story! Please try again."
      );
    }

    // Handle network errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "Connection failed. Please check your internet connection and try again."
      );
    }

    // Re-throw other errors
    throw error;
  }
};

// Helper to handle API responses
const handleResponse = async (response) => {
  console.log("API response received:", {
    status: response.status,
    ok: response.ok,
    statusText: response.statusText,
  });

  if (!response.ok) {
    let errorData = null;
    try {
      const text = await response.text();
      errorData = text ? JSON.parse(text) : null;
    } catch (e) {
      console.warn("Could not parse error response as JSON:", e);
    }
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

    // AI Generation specific errors (HTTP 500/502/503)
    if (response.status >= 500) {
      const aiErrorMsg =
        "Our AI storyteller is temporarily overwhelmed. Please try again in a moment.";
      throw new Error(errorData?.error || aiErrorMsg);
    }

    // Rate limiting from OpenAI (HTTP 429 from upstream)
    if (
      response.status === 502 ||
      (errorData?.error && errorData.error.includes("rate"))
    ) {
      throw new Error(
        "Our AI is very busy right now. Please wait a moment and try again."
      );
    }

    // Network/timeout errors
    if (response.status === 408 || response.status === 504) {
      throw new Error(
        "The story is taking longer than usual to generate. Please try again."
      );
    }

    throw new Error(errorData?.error || `HTTP error ${response.status}`);
  }

  // Handle successful responses safely
  try {
    const text = await response.text();
    if (!text) {
      return {}; // Return empty object for empty responses
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("Could not parse response as JSON:", e);
    throw new Error("Invalid JSON response from server");
  }
};

// API methods
export const apiService = {
  // Check API status
  checkStatus: async () => {
    try {
      const options = await createFetchOptions();
      console.log("Checking API status...");
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/status`,
        options
      );
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
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/stories`,
        options
      );
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
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/stories/${storyId}`,
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
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/stories/${storyId}`,
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
      // Use 60 second timeout for initial story generation
      const options = await createFetchOptions("POST", storyParams, 60000);
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/stories`,
        options
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Create Story Error:", error);
      // Pass through the specific error message (especially for 429 limit errors)
      throw error;
    }
  },

  // Make a choice in a story
  makeChoice: async (storyId, choiceId) => {
    try {
      console.log(`Making choice ${choiceId} in story ${storyId}...`);
      // Use 60 second timeout for AI generation
      const options = await createFetchOptions("POST", null, 60000);
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/stories/${storyId}/choices/${choiceId}`,
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
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/usage`,
        options
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Get Usage Error:", error);
      throw new Error(`Failed to get usage statistics: ${error.message}`);
    }
  },

  // Generate share token for a story
  generateShareToken: async (storyId) => {
    try {
      const options = await createFetchOptions("POST");
      const url = `${API_BASE_URL}/api/stories/${storyId}/share`;
      console.log(`Generating share token for story ${storyId}...`);
      const response = await fetchWithTimeout(url, options);
      return handleResponse(response);
    } catch (error) {
      console.error("Generate Share Token Error:", error);
      throw new Error(`Failed to generate share token: ${error.message}`);
    }
  },
};
