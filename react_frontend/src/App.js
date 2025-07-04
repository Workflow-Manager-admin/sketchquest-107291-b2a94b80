import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { signInAnon, signOutUser, onAuthChange, db, auth } from "./firebase";
import { User, AppContextProvider, useAppContext } from "./context/AppContext";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import DrawingPage from "./components/DrawingPage";
import Leaderboard from "./components/Leaderboard";
import Header from "./components/Header";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";
import "./tailwind.output.css";

// PUBLIC_INTERFACE
function App() {
  // Persist theme in localStorage
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <AppContextProvider>
      <Router>
        <div className="App relative bg-[var(--bg-primary)] min-h-screen transition-colors">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <Header />
          <main className="container mx-auto px-2 pb-12 pt-6">
            <AnimatePresence mode="wait">
              <Suspense fallback={<div className="text-lg text-center mt-20">Loading...</div>}>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/drawing/:docId" element={
                    <RequireAuth redirectTo="/login">
                      <DrawingPage />
                    </RequireAuth>
                  } />
                  <Route path="/dashboard" element={
                    <RequireAuth redirectTo="/login">
                      <Dashboard />
                    </RequireAuth>
                  } />
                  <Route path="/leaderboard" element={
                    <RequireAuth redirectTo="/login">
                      <Leaderboard />
                    </RequireAuth>
                  } />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Suspense>
            </AnimatePresence>
          </main>
        </div>
      </Router>
    </AppContextProvider>
  );
}

// PUBLIC_INTERFACE
function RequireAuth({ children, redirectTo }) {
  const { userLoaded, user } = useAppContext();
  if (!userLoaded) return <div className="text-center pt-32 text-xl">Loading...</div>;
  return user ? children : <Navigate to={redirectTo} />;
}

export default App;
