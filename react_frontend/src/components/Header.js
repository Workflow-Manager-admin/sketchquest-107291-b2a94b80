import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Crown } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  const { pathname } = useLocation();
  return (
    <header className="flex flex-row items-center justify-between w-full px-4 sm:px-8 py-4 bg-white drop-shadow-md rounded-b-2xl" style={{background:'var(--bg-secondary)'}}>
      <Link to="/dashboard" style={{textDecoration:'none'}}>
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          initial={{ scale: 0.90 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.15 }}
        >
          <span style={{
            fontFamily: '"Bungee", cursive', color: "#4F8EFF",
            fontSize: 28, letterSpacing: "1px"
          }}>
            <span role="img" aria-label="paint">🎨</span> SketchQuest
          </span>
        </motion.div>
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/dashboard"
              className={pathname === "/dashboard" ? "font-bold text-[var(--text-secondary)]" : "hover:text-blue-500"}>
          Dashboard
        </Link>
        <Link to="/leaderboard"
              className={pathname === "/leaderboard" ? "font-bold text-indigo-700" : "hover:text-indigo-700 flex items-center gap-1"}>
          <Crown size={20} color="#FFB800" /> Leaderboard
        </Link>
      </div>
    </header>
  )
}
