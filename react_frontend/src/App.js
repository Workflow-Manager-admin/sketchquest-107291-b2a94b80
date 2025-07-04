import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Main App component for SketchQuest frontend.
 * Renders a basic placeholder UI to ensure the preview loads.
 */
function App() {
  return (
    <div className="App" style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#FAFFFB" }}>
      <div>
        <h1 style={{ fontFamily: "Quicksand, sans-serif", color: "#4F8EFF" }}>SketchQuest</h1>
        <p style={{ color: "#555", marginTop: 10 }}>Frontend loaded successfully! Replace this with your app UI.</p>
      </div>
    </div>
  );
}

export default App;
