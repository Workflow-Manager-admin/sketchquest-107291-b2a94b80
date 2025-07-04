import React, { createContext, useContext, useEffect, useState } from "react";
import { signInAnon, signOutUser, onAuthChange, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * User shape: { uid, username (anon), creationTime (ms) }
 */
export const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  // Persist username in Firestore for leaderboard etc.
  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      setUserLoaded(true);
      if (firebaseUser) {
        // Look up or create user profile with username attached
        const userDoc = doc(db, "users", firebaseUser.uid);
        let userSnap = await getDoc(userDoc);
        let userData = userSnap.exists() ? userSnap.data() : null;
        // If missing username, assign one (anon-XXXX)
        if (!userData || !userData.username) {
          const anonName = "anon-" + Math.floor(1000 + Math.random() * 9000);
          await setDoc(userDoc, {
            uid: firebaseUser.uid,
            username: anonName,
            creationTime: firebaseUser.metadata?.creationTime || "",
            score: 0,
          }, { merge: true });
          userData = { uid: firebaseUser.uid, username: anonName };
        }
        setUser({ uid: firebaseUser.uid, ...userData });
      } else {
        setUser(null);
      }
    });
    return () => unsub && unsub();
  }, []);
  return <AppContext.Provider value={{
    user, setUser, userLoaded, setUserLoaded,
    signInAnon, signOutUser,
  }}>{children}</AppContext.Provider>
}

// PUBLIC_INTERFACE
export function useAppContext() {
  return useContext(AppContext);
}
