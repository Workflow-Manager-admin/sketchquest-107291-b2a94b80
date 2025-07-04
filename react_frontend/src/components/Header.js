import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Crown } from "lucide-react";
import { motion } from "framer-motion";

// PUBLIC_INTERFACE
/**
 * SketchQuest Header
 * - The 'SketchQuest' text (and central mascot) remains completely static (no animation or effect).
 * - The animal mascot icons/emoji (except the central lizard) gently float/bob using framer-motion for a playful effect.
 * - Layout remains playful and balanced.
 */
export default function Header() {
  const { pathname } = useLocation();

  // Mascot emojis (except .[0]=center lizard)
  const animalMascots = [
    { emoji: "🦎", label: "Lizard" }, // central (brand)
    { emoji: "🐱", label: "Cat" },
    { emoji: "🦉", label: "Owl" },
    { emoji: "🐰", label: "Rabbit" },
    { emoji: "🦊", label: "Fox" },
  ];

  // Floating/bobbing animation for mascots (framer-motion variants)
  // Each animal gets an offset phase for a more organic cluster movement.
  const floatVariants = [
    { // Cat
      animate: {
        y: [0, -14, 0, 8, 0],
        x: [0, 3, 5, 2, 0],
        rotate: [0, 4, -4, 3, 0],
        transition: {
          duration: 3.0,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
    { // Owl
      animate: {
        y: [0, 12, 6, 0, -8, 0],
        x: [0, -3, 2, 7, 0, -4, 0],
        rotate: [0, -5, 6, -2, 0],
        transition: {
          duration: 3.4,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
    { // Rabbit
      animate: {
        y: [0, -10, 2, 14, 0],
        x: [0, 1, 5, -3, 0],
        rotate: [0, 7, -3, 0],
        transition: {
          duration: 2.7,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
    { // Fox
      animate: {
        y: [0, 10, -7, 0, 4, 0],
        x: [0, -3, 0, 3, 0],
        rotate: [0, -2, 7, 0, -3],
        transition: {
          duration: 3.3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
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
          {/* -- LOGO CLUSTER -- */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none relative">
            {/* Playful floating emojis (beside/above/below) */}
            {/* Above/left mascots cluster */}
            <div className="flex flex-row gap-0.5 items-end h-full mr-2 sm:mr-0 mt-[1px]">
              {[0, 1].map(i =>
                i === 0 ? null : (
                  // animalMascots[1] = Cat, etc
                  <motion.span
                    key={animalMascots[i].label}
                    className="mascot-logo"
                    style={{
                      width: 35,
                      height: 35,
                      marginLeft: i > 1 ? "-0.55em" : "0",
                      marginRight: "0.04em",
                      border: "3px solid #fff",
                      background:
                        "linear-gradient(136deg,#ffe385 50%,#e4f0ff 95%)",
                      boxShadow: "0 1.5px 7px #b3e1fb22",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-label={animalMascots[i].label}
                    title={animalMascots[i].label}
                    initial={false}
                    animate={floatVariants[i - 1].animate}
                  >
                    <span style={{ fontSize: 25, userSelect: "none" }}>
                      {animalMascots[i].emoji}
                    </span>
                  </motion.span>
                )
              )}
            </div>
            {/* -- Static Main Logo Text + Center mascot -- */}
            <span
              style={{
                fontFamily: "'Bungee', cursive",
                color: "#4E73DF",
                fontSize: 29,
                letterSpacing: "1.1px",
                filter: "drop-shadow(0px 3px 10px #c3dafb88)",
                display: "flex",
                alignItems: "center",
                zIndex: 10,
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
              {/* Central mascot (static) */}
              <span
                className="mascot-logo shadow-sm"
                style={{
                  marginLeft: "12px",
                  width: 38, height: 38,
                  display: "inline-block",
                  verticalAlign: "middle",
                  lineHeight: 1
                }}
              >
                <span role="img" aria-label="lizard mascot" style={{ fontSize: 27 }}>🦎</span>
              </span>
            </span>
            {/* Below/right mascots cluster */}
            <div className="flex flex-row gap-0.5 items-start h-full ml-2 sm:ml-0">
              {[2, 3, 4].map((i, idx) => (
                <motion.span
                  key={animalMascots[i].label}
                  className="mascot-logo"
                  style={{
                    width: 34,
                    height: 34,
                    marginLeft: idx !== 0 ? "-0.63em" : "0.09em",
                    marginRight: "0.06em",
                    border: "3px solid #fff",
                    background:
                      "linear-gradient(135deg, #ffe385 54%, #e4f0ff 89%)",
                    boxShadow: "0 2px 8px #b3e1fb22",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label={animalMascots[i].label}
                  title={animalMascots[i].label}
                  initial={false}
                  animate={floatVariants[i - 1].animate}
                >
                  <span style={{ fontSize: 24, userSelect: "none" }}>
                    {animalMascots[i].emoji}
                  </span>
                </motion.span>
              ))}
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
