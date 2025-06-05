import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Replace these placeholders with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyD_RTZegpkirQD6BZUb_Az-kVR4Xku-Qa0",
  authDomain: "storyteller-6deea.firebaseapp.com",
  projectId: "storyteller-6deea",
  storageBucket: "storyteller-6deea.firebasestorage.app",
  messagingSenderId: "736671325834",
  appId: "1:736671325834:web:857b8999383ed31fc95773",
  // We don't need measurementId for auth
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
