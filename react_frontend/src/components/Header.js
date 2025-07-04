import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Crown } from "lucide-react";
import { motion } from "framer-motion";

// PUBLIC_INTERFACE
/**
 * SketchQuest Header
 * - The 'SketchQuest' text and its container are COMPLETELY STATIC: NO animation, motion, animation-related classes, transition styles, or inheritance.
 * - ONLY animal mascot icons ("owl", "fox", etc, not the lizard in center) are animated/floating via motion.div and anim-float-header class.
 * - Code comments clarify and enforce this requirement!
 */
export default function Header() {
  const { pathname } = useLocation();

  // Define animal mascots (excluding the central mascot/lizard)
  const animalMascots = [
    { emoji: "🦉", label: "Owl" },
    { emoji: "🦊", label: "Fox" },
    { emoji: "🐰", label: "Rabbit" },
    { emoji: "🐱", label: "Cat" },
  ];

  // Framer Motion floating animation variants for mascots.
  // Only animal mascot icons use these; SketchQuest text or parent never uses any motion or animation.
  const floatVariants = [
    {
      animate: {
        y: [0, -15, 0, 8, 0],
        transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
      },
    },
    {
      animate: {
        y: [0, 12, 0, -14, 0],
        transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
      },
    },
    {
      animate: {
        y: [0, 10, -7, 0, 8, 0],
        transition: { duration: 2.7, repeat: Infinity, ease: "easeInOut" },
      },
    },
    {
      animate: {
        y: [0, -8, 6, 0, -10, 0],
        transition: { duration: 3.0, repeat: Infinity, ease: "easeInOut" },
      },
    },
  ];

  // All animation, motion.div, motion-pop, .wavy, or transition classes are applied ONLY to mascot icons, never beyond!
  return (
    <header
      className="flex flex-col sm:flex-row items-center justify-between w-full px-4 sm:px-8 py-4 drop-shadow-md rounded-b-2xl z-20"
      style={{
        background: "var(--header-gradient)",
        minHeight: 74,
        borderBottom: "2.7px solid var(--border-color)",
      }}
      // Absolutely NO animation/transition prop (enforced!) on header or its child containers.
    >
      <div className="flex flex-col items-center sm:flex-row sm:gap-8 gap-2 w-full sm:w-auto">
        {/* Brand & logo block */}
        <Link to="/dashboard" style={{ textDecoration: "none" }}>
          <div className="flex flex-col items-center relative select-none">
            {/* TOP mascot row: only icons are animated, never the container */}
            <div className="flex flex-row gap-1 items-end mb-2">
              {/* Animated animal mascot icon 1 */}
              <motion.div
                className="mascot-logo anim-float-header"
                style={{
                  width: 35,
                  height: 35,
                  marginRight: "-4px",
                  border: "3px solid #fff",
                  background: "linear-gradient(136deg,#ffe385 50%,#e4f0ff 95%)",
                  boxShadow: "0 1.5px 7px #b3e1fb22",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
                aria-label={animalMascots[0].label}
                title={animalMascots[0].label}
                initial={false}
                animate={floatVariants[0].animate}
              >
                <span style={{ fontSize: 24, userSelect: "none" }}>{animalMascots[0].emoji}</span>
              </motion.div>
              {/* Animated animal mascot icon 2 */}
              <motion.div
                className="mascot-logo anim-float-header"
                style={{
                  width: 35,
                  height: 35,
                  marginLeft: "-6px",
                  border: "3px solid #fff",
                  background: "linear-gradient(136deg,#ffe385 50%,#e4f0ff 95%)",
                  boxShadow: "0 1.5px 7px #b3e1fb22",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
                aria-label={animalMascots[1].label}
                title={animalMascots[1].label}
                initial={false}
                animate={floatVariants[1].animate}
              >
                <span style={{ fontSize: 24, userSelect: "none" }}>{animalMascots[1].emoji}</span>
              </motion.div>
            </div>

            {/* ---------------- FULLY STATIC BRAND AREA! ----------------- */}
            {/* NEVER add:
                - animation, motion.div, motion-pop, .wavy,
                - animation/transition/filter (except drop-shadow for highlight)
                - animated keyframes, inheritance, or motion on children!
              EXCLUSIVELY static styles and markup below:
            */}
            <div
              style={{
                fontFamily: "'Bungee', cursive",
                color: "#4E73DF",
                fontSize: 29,
                letterSpacing: "1.1px",
                filter: "drop-shadow(0px 3px 10px #c3dafb88)", // highlight only, not animation
                display: "flex",
                alignItems: "center",
                zIndex: 10,
                background: "none",
                fontWeight: 600
              }}
              data-testid="header-title"
              id="sketchquest-title-container"
              // NEVER add animation, transition, or motion here or below!
            >
              <span
                role="img"
                aria-label="paint"
                style={{
                  fontSize: 28,
                  marginRight: 4,
                  verticalAlign: "middle",
                  background: "none",
                  color: "inherit"
                  // 100% static
                }}
              >
                🎨
              </span>
              {/* --- STATIC brand text, never animated! --- */}
              <span
                id="sketchquest-title-text"
                style={{
                  userSelect: "none",
                  marginRight: 6,
                  background: "none",
                  color: "inherit",
                  fontWeight: 600,
                  fontFamily: "'Bungee', cursive",
                  letterSpacing: "1.1px"
                  // Must stay static!
                }}
              >
                SketchQuest
              </span>
              {/* Central mascot (static lizard - should not bounce, float, or animate) */}
              <span
                className="mascot-logo shadow-sm"
                style={{
                  marginLeft: "12px",
                  width: 38,
                  height: 38,
                  display: "inline-block",
                  verticalAlign: "middle",
                  lineHeight: 1,
                  background: "linear-gradient(132deg, #ffe385 40%, #4e73df 90%)",
                  filter: "none",
                  boxShadow: "0 2px 12px #fbbf2430",
                  border: "3.5px solid #fff"
                }}
                aria-label="lizard mascot"
                // Absolutely NO animation, keyframes, or wiggle!
              >
                <span
                  role="img"
                  aria-label="lizard mascot"
                  style={{
                    fontSize: 27,
                    background: "none"
                    // 100% static
                  }}
                >🦎</span>
              </span>
            </div>
            {/* ---------------------------------------------------------- */}

            {/* BOTTOM mascot row: only icons are animated, not container */}
            <div className="flex flex-row gap-1 items-start mt-2">
              {/* Animated animal mascot icon 3 */}
              <motion.div
                className="mascot-logo anim-float-header"
                style={{
                  width: 35,
                  height: 35,
                  marginRight: "-4px",
                  border: "3px solid #fff",
                  background: "linear-gradient(135deg, #ffe385 54%, #e4f0ff 89%)",
                  boxShadow: "0 2px 8px #b3e1fb22",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
                aria-label={animalMascots[2].label}
                title={animalMascots[2].label}
                initial={false}
                animate={floatVariants[2].animate}
              >
                <span style={{ fontSize: 24, userSelect: "none" }}>{animalMascots[2].emoji}</span>
              </motion.div>
              {/* Animated animal mascot icon 4 */}
              <motion.div
                className="mascot-logo anim-float-header"
                style={{
                  width: 35,
                  height: 35,
                  marginLeft: "-6px",
                  border: "3px solid #fff",
                  background: "linear-gradient(135deg, #ffe385 54%, #e4f0ff 89%)",
                  boxShadow: "0 2px 8px #b3e1fb22",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
                aria-label={animalMascots[3].label}
                title={animalMascots[3].label}
                initial={false}
                animate={floatVariants[3].animate}
              >
                <span style={{ fontSize: 24, userSelect: "none" }}>{animalMascots[3].emoji}</span>
              </motion.div>
            </div>
          </div>
        </Link>
      </div>
      {/* NAV LINKS */}
      <div className="flex items-center gap-4 mt-3 sm:mt-0">
        <Link
          to="/dashboard"
          className={
            "px-3 py-1.5 rounded-full text-lg transition-all" +
            (pathname === "/dashboard"
              ? " font-bold text-[var(--text-secondary)] bg-white/80 shadow-sm"
              : " hover:text-blue-500 hover:bg-white/60")
          }
          style={{ fontFamily: "Fredoka, Nunito, Bungee, sans-serif" }}
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
          style={{ fontFamily: "Fredoka, Nunito, Bungee, sans-serif" }}
        >
          <Crown size={20} color="#FFB800" /> Leaderboard
        </Link>
      </div>
    </header>
  );
}
