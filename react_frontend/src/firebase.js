import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase configuration is stored in environment variables for security.
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

/** Auth and Firestore singletons */
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * PUBLIC_INTERFACE
 * Sign in anonymously. Returns a user credential or throws error.
 */
export function signInAnon() {
  return signInAnonymously(auth);
}

/**
 * PUBLIC_INTERFACE
 * Sign out current user.
 */
export function signOutUser() {
  return signOut(auth);
}

/**
 * PUBLIC_INTERFACE
 * Listen to authentication state changes.
 * @param {function} callback - Receives Firebase User or null
 */
export function onAuthChange(callback) {
  onAuthStateChanged(auth, callback);
}
