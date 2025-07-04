import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Crown } from "lucide-react";
import { motion } from "framer-motion";

// PUBLIC_INTERFACE
export default function Header() {
  const { pathname } = useLocation();
  return (
    <header
      className="flex flex-row items-center justify-between w-full px-4 sm:px-8 py-4 drop-shadow-md rounded-b-2xl z-20"
      style={{
        background: "var(--header-gradient)",
        minHeight: 74,
        borderBottom: "2.7px solid var(--border-color)",
      }}
    >
      <Link to="/dashboard" style={{ textDecoration: "none" }}>
        <motion.div
          className="flex items-center gap-3 cursor-pointer select-none"
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.17 }}
        >
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
              className="wavy"
              style={{
                fontSize: 28,
                marginRight: 4,
                verticalAlign: "middle"
              }}
            >🎨</span>{" "}
            SketchQuest
          </span>
          <span
            className="mascot-logo wavy shadow-sm"
            style={{ marginLeft: "12px", width: 36, height: 36, display: "inline-block", verticalAlign: "middle", lineHeight: 1 }}
          >
            <span role="img" aria-label="mascot" style={{ fontSize: 27 }}>🦎</span>
          </span>
        </motion.div>
      </Link>
      <div className="flex items-center gap-4">
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
