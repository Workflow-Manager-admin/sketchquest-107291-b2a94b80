import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// PUBLIC_INTERFACE
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
      className="max-w-md mx-auto pt-8 sticky-leaderboard z-10"
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, type: "spring", bounce: 0.25 }}
    >
      <div className="flex items-center justify-center gap-2 mb-3">
        <motion.div
          className="mascot-logo wavy scale-90 shadow"
          initial={{ rotate: -16, scale: 0.7 }}
          animate={{ rotate: 10, scale: 1.13 }}
          transition={{ delay: 0.13, stiffness: 190 }}
        >
          <span role="img" aria-label="mascot" style={{ fontSize: 35 }}>🦎</span>
        </motion.div>
        <div className="font-bungee text-2xl text-center drop-shadow text-playful wavy">Leaderboard</div>
        <Sparkles style={{ color: "var(--button-hover)" }} width="27" className="ml-1" />
      </div>
      <ol className="sketch-card shadow-md px-2 py-6 flex flex-col gap-2 bg-white/90 border-2 border-[var(--border-color)]">
        {users.length === 0
          ? <li className="text-gray-400 text-center py-3">No players yet</li>
          : users.map((u, idx) =>
            <motion.li
              key={u.uid}
              className="flex items-center gap-3 font-semibold px-2 motion-pop"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + idx * 0.052, type: "spring", duration: 0.52 }}
              style={idx < 3 ? { filter: "brightness(1.1) drop-shadow(0 2px 6px #ffe385cc)" } : {}}
            >
              <span className="inline-block text-lg w-8 text-center">
                {idx === 0 ? <span>🥇</span> : idx === 1 ? <span>🥈</span> : idx === 2 ? <span>🥉</span> : (<span role="img" aria-label="rank">✨</span>)}
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
