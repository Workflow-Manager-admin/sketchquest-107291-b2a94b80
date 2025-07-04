import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Crown } from "lucide-react";
import { motion } from "framer-motion";

// PUBLIC_INTERFACE
export default function Header() {
  const { pathname } = useLocation();

  // Array of animal mascots (emoji for playful effect)
  const animalMascots = [
    { emoji: "🦎", label: "Lizard" }, // central mascot (main brand)
    { emoji: "🐱", label: "Cat" },
    { emoji: "🦉", label: "Owl" },
    { emoji: "🐰", label: "Rabbit" },
    { emoji: "🦊", label: "Fox" },
    // Could expand with SVGs instead, but emoji look universally playful and stay on-brand.
  ];

  return (
    <header
      className="flex flex-col sm:flex-row items-center justify-between w-full px-4 sm:px-8 py-4 drop-shadow-md rounded-b-2xl z-20"
      style={{
        background: "var(--header-gradient)",
        minHeight: 74,
        borderBottom: "2.7px solid var(--border-color)"
      }}
    >
      <div className="flex flex-col items-center sm:flex-row sm:gap-8 gap-2 w-full sm:w-auto">
        <Link to="/dashboard" style={{ textDecoration: "none" }}>
          {/* Stable: no wavy, no motion special effect */}
          <div className="flex items-center gap-3 cursor-pointer select-none">
            <span
              style={{
                fontFamily: "'Bungee', cursive",
                color: "#4E73DF",
                fontSize: 29,
                letterSpacing: "1.1px",
                filter: "drop-shadow(0px 3px 10px #c3dafb88)"
              }}
            >
              <span
                role="img"
                aria-label="paint"
                style={{
                  fontSize: 28,
                  marginRight: 4,
                  verticalAlign: "middle"
                }}
              >🎨</span>{" "}
              SketchQuest
            </span>
            {/* Center mascot, stable, no animation */}
            <span
              className="mascot-logo shadow-sm"
              style={{
                marginLeft: "12px",
                width: 38, height: 38,
                display: "inline-block", verticalAlign: "middle", lineHeight: 1
              }}
            >
              <span role="img" aria-label="lizard mascot" style={{ fontSize: 27 }}>🦎</span>
            </span>
          </div>
        </Link>
        {/* Animal mascot cluster, visually under the logo (or beside for desktop) */}
        <div
          className="flex flex-row gap-0.5 mt-0.5 sm:mt-0 sm:ml-4"
          style={{
            // tightly pack, relative placement grouped to logo
          }}
        >
          {animalMascots.slice(1).map((animal, i) => (
            <span
              key={animal.label}
              className="mascot-logo"
              style={{
                width: 36,
                height: 36,
                marginLeft: i > 0 ?  "-0.6em" : "0", // overlap a bit for playful cluster
                marginRight: "0.05em",
                border: "3.2px solid #fff",
                background: "linear-gradient(136deg,#ffe385 55%,#e4f0ff 90%)",
                boxShadow: "0 1.5px 8px #b3e1fb22"
              }}
              aria-label={animal.label}
              title={animal.label}
            >
              <span style={{ fontSize: 25, userSelect: "none" }}>{animal.emoji}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 mt-3 sm:mt-0">
        <Link
          to="/dashboard"
          className={
            "px-3 py-1.5 rounded-full text-lg transition-all" +
            (pathname === "/dashboard"
              ? " font-bold text-[var(--text-secondary)] bg-white/80 shadow-sm"
              : " hover:text-blue-500 hover:bg-white/60")
          }
          style={{ fontFamily: "Fredoka, Nunito, Bungee, sans-serif", }}
        >
          Dashboard
        </Link>
        <Link
          to="/leaderboard"
          className={
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-lg transition-all" +
            (pathname === "/leaderboard"
              ? " font-bold text-indigo-700 bg-white/90 shadow"
              : " hover:text-indigo-700 hover:bg-white/70")
          }
          style={{ fontFamily: "Fredoka, Nunito, Bungee, sans-serif", }}
        >
          <Crown size={20} color="#FFB800" /> Leaderboard
        </Link>
      </div>
    </header>
  );
}
