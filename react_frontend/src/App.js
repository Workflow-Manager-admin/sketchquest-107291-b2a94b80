import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { signInAnon, signOutUser, onAuthChange } from "./firebase";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Listen to auth state changes
  useEffect(() => {
    setLoading(true);
    const unsub = onAuthChange(currentUser => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // PUBLIC_INTERFACE
  const handleSignIn = () => {
    signInAnon().catch(e => alert("Sign-in failed: " + e.message));
  };

  // PUBLIC_INTERFACE
  const handleSignOut = () => {
    signOutUser().catch(e => alert("Sign-out failed: " + e.message));
  };

  return (
    <div className="App">
      <header className="App-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Current theme: <strong>{theme}</strong>
        </p>
        <hr style={{ width: "60%", opacity: 0.3, margin: "2rem auto" }} />
        <div style={{ marginBottom: 16 }}>
          <strong>Firebase Auth Example:</strong>
          <div>
            {loading ? (
              <span>Loading...</span>
            ) : user ? (
              <>Signed in as <b>{user.isAnonymous ? "Anonymous User" : user.uid}</b> &nbsp;
                <button style={{ marginLeft: 8 }} onClick={handleSignOut}>Sign out</button>
              </>
            ) : (
              <button onClick={handleSignIn}>Sign in Anonymously</button>
            )}
          </div>
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
export default App;
