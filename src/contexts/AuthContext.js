import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component to wrap the app and provide auth context
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Log in function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Log out function
  function logout() {
    return signOut(auth);
  }

  // Reset password function
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Update user profile (with error handling)
  async function updateProfile(userData) {
    if (!currentUser) return;

    try {
      const userRef = doc(db, "users", currentUser.uid);
      return updateDoc(userRef, {
        ...userData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.warn(
        "Firestore update failed (using local fallback):",
        error.message
      );
      // For development, we'll just log the error and continue
      // In production, you might want to handle this differently
    }
  }

  // Effect to handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          // Try to fetch or create user profile from Firestore
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            // User profile exists, set it
            setUserProfile(userSnap.data());
          } else {
            // Create new user profile
            const newUserData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || "",
              photoURL: user.photoURL || "",
              createdAt: new Date().toISOString(),
              storiesCreated: 0,
              storiesCompleted: 0,
              favoriteSettings: [],
            };

            await setDoc(userRef, newUserData);
            setUserProfile(newUserData);
          }
        } catch (error) {
          console.warn(
            "Firestore operation failed (using fallback profile):",
            error.message
          );
          // Create a basic profile without Firestore
          const fallbackProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
            createdAt: new Date().toISOString(),
            storiesCreated: 0,
            storiesCompleted: 0,
            favoriteSettings: [],
          };
          setUserProfile(fallbackProfile);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Context value with all auth functions and state
  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
