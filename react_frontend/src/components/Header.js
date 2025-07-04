import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Crown } from "lucide-react";
import { motion } from "framer-motion";

// PUBLIC_INTERFACE
/**
 * SketchQuest Header
 * - The 'SketchQuest' text and main mascot/logo are completely static (no animation classes or animated components, no animation CSS, and no animated inline style on text or its parents).
 * - Only animal mascots/icons (not logo or text) float gently using framer-motion for a playful, dynamic effect.
 * - CSS selectors and animation logic are tightly scoped/isolated to avoid accidental leaking.
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

  // Framer Motion floating animation variants for each mascot
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

  // Only mascot icons are motion-wrapped. Absolutely NO motion, animation, or animation-related class on or above the SketchQuest text or its direct container.
  return (
    <header
      className="flex flex-col sm:flex-row items-center justify-between w-full px-4 sm:px-8 py-4 drop-shadow-md rounded-b-2xl z-20"
      style={{
        background: "var(--header-gradient)",
        minHeight: 74,
        borderBottom: "2.7px solid var(--border-color)",
      }}
      // absolutely no animation/transition prop
    >
      <div className="flex flex-col items-center sm:flex-row sm:gap-8 gap-2 w-full sm:w-auto">
        {/* Brand & logo block */}
        <Link to="/dashboard" style={{ textDecoration: "none" }}>
          <div className="flex flex-col items-center relative select-none">
            {/* Top mascots (animated) */}
            <div className="flex flex-row gap-1 items-end mb-2">
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

            {/* --- STATIC: SketchQuest logo/title & mascot --- */}
            <div
              // Absolutely NO classes which could have animation, and only static visual styles
              style={{
                fontFamily: "'Bungee', cursive",
                color: "#4E73DF",
                fontSize: 29,
                letterSpacing: "1.1px",
                filter: "drop-shadow(0px 3px 10px #c3dafb88)",
                display: "flex",
                alignItems: "center",
                zIndex: 10,
                // No animation/transition
                // No className to avoid accidental inheritance
              }}
              data-testid="header-title"
              id="sketchquest-title-container"
            >
              <span
                role="img"
                aria-label="paint"
                style={{
                  fontSize: 28,
                  marginRight: 4,
                  verticalAlign: "middle",
                  // No animation, transition, or filter styles or className
                }}
              >
                🎨
              </span>
              {/* Absolutely NO animation, className, or side effect on the text */}
              <span
                id="sketchquest-title-text"
                style={{
                  userSelect: "none",
                  marginRight: 6,
                  // Remove ALL animation, transition, filter, className styles
                }}
              >
                SketchQuest
              </span>
              {/* Central mascot (static, NOT floating/NOT animated) */}
              <span
                className="mascot-logo shadow-sm"
                style={{
                  marginLeft: "12px",
                  width: 38,
                  height: 38,
                  display: "inline-block",
                  verticalAlign: "middle",
                  lineHeight: 1,
                  // No animation, filter, or transition styles or className additions
                }}
                aria-label="lizard mascot"
              >
                <span
                  role="img"
                  aria-label="lizard mascot"
                  style={{ fontSize: 27 }}
                >🦎</span>
              </span>
            </div>
            {/* Bottom mascots (animated) */}
            <div className="flex flex-row gap-1 items-start mt-2">
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
