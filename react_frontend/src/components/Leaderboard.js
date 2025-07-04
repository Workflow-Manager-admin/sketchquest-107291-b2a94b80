import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

/**
 * Animated, sticky, playful leaderboard card for SketchQuest
 */
export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("score", "desc"), limit(10));
    const unsub = onSnapshot(q, snap => {
      let arr = [];
      snap.forEach(doc => {
        arr.push(doc.data());
      });
      setUsers(arr);
    });
    return () => unsub();
  }, []);
  return (
    <motion.div
      className="max-w-md mx-auto pt-8 sticky-leaderboard"
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.26 }}
    >
      <div className="flex items-center justify-center gap-2 mb-3">
        <motion.div
          className="mascot-logo wavy scale-90 shadow"
          initial={{ rotate: -16, scale: 0.7 }}
          animate={{ rotate: 12, scale: 1 }}
          transition={{ delay: 0.18, stiffness: 210 }}
        ><span role="img" aria-label="mascot" style={{fontSize: 33}}>🦎</span></motion.div>
        <div className="font-bungee text-2xl text-center drop-shadow text-playful wavy">Leaderboard</div>
        <Sparkles style={{color:"var(--button-hover)"}} width="28" className="ml-1" />
      </div>
      <ol className="sketch-card shadow-md px-2 py-6 flex flex-col gap-2 bg-white/80 border-2 border-[var(--border-color)]">
        {users.length === 0
          ? <li className="text-gray-400 text-center py-3">No players yet</li>
          : users.map((u, idx) =>
            <motion.li
              key={u.uid}
              className="flex items-center gap-3 font-semibold px-2 motion-pop"
              initial={{ opacity: 0, x: -17 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.13 + idx * 0.06, type: "spring", duration: 0.5 }}
              style={idx < 3 ? { filter: "brightness(1.06) drop-shadow(0 2px 3px #ffe38595)" } : {}}
            >
              <span className="inline-block text-lg w-8 text-center">
                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : (
                  <span role="img" aria-label="rank">✨</span>
                )}
              </span>
              <span className="ml-1 font-bungee">{u.username || "anon"}</span>
              <span className="ml-auto font-bungee text-brand text-md flex items-center gap-1">
                <span role="img" aria-label="score">💎</span>
                {u.score ?? 0}
              </span>
            </motion.li>
          )}
      </ol>
    </motion.div>
  );
}
