import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";

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
      className="max-w-md mx-auto pt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="font-bungee text-2xl text-center mb-3">🏅 Leaderboard</div>
      <ol className="bg-white rounded-2xl shadow-md px-4 py-6 flex flex-col gap-3">
        {users.length === 0
          ? <li className="text-gray-400 text-center">No players yet</li>
          : users.map((u, idx) =>
            <li key={u.uid} className="flex items-center gap-2 font-semibold px-2">
              <span className="inline-block text-lg w-8 text-center">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}</span>
              <span className="ml-1">{u.username || "anon"}</span>
              <span className="ml-auto font-mono text-blue-700">{u.score ?? 0} pts</span>
            </li>
          )}
      </ol>
    </motion.div>
  );
}
