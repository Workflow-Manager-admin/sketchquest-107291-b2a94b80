import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";

export default function Dashboard() {
  const { user } = useAppContext();
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topDrawing, setTopDrawing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "drawings"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      let arr = [];
      snap.forEach(doc => arr.push({ id: doc.id, ...doc.data() }));
      setDrawings(arr);
      // Find top drawing by score
      if (arr.length > 0) {
        setTopDrawing([...arr].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <>
      <section>
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center pb-4">
            <div className="font-bungee text-3xl pb-2 tracking-wide text-[var(--text-secondary)] drop-shadow" style={{textShadow: '0 2px 4px #cce6ff'}}>
              <span role="img" aria-label="magnifier">🔎</span> Community Drawings
            </div>
            <button
              className="mt-3 md:mt-0 flex items-center gap-2 px-5 py-2.5 font-bold bg-[var(--button-bg)] text-[var(--button-text)] rounded-full shadow-lg hover:shadow-xl hover:bg-[var(--button-hover)] transition-all text-lg border-2 border-[var(--border-color)]"
              style={{ boxShadow: '0 2px 12px 0 rgba(77,116,255,0.12)' }}
              onClick={() => navigate('/drawing/new')}
            >
              <PlusCircle size={22} /> Add Your Drawing!
            </button>
          </div>
          {topDrawing && (
            <div className="bg-[var(--sketch-yellow)] rounded-2xl py-3 px-4 mb-4 drop-shadow-lg flex items-center gap-2 border-l-8 border-[var(--primary)]" style={{boxShadow: '0 4px 18px 0 #ffe38544'}}>
              <span className="font-bold text-violet-900 text-lg">🏆 Top Drawing:</span>
              <img
                src={topDrawing.dataUrl}
                alt="Top Drawing"
                className="w-14 h-14 object-contain rounded-lg border-[3px] border-[var(--primary)] shadow"
                style={{ background: "var(--draw-bg)" }}
              />
              <span className="ml-2 font-bungee">{topDrawing.prompt || "—"}</span>
              <span className="ml-8 text-green-700 font-extrabold text-lg">
                {topDrawing.score ?? 0} pts
              </span>
            </div>
          )}
        </motion.div>
      </section>
      <section>
        {loading ? (
          <div className="text-center text-lg py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {drawings.map(draw =>
              <DrawingCard key={draw.id} drawing={draw} onClick={() => navigate(`/drawing/${draw.id}`)} />
            )}
          </div>
        )}
      </section>
    </>
  )
}

function DrawingCard({ drawing, onClick }) {
  return (
    <motion.div
      className="rounded-2xl shadow-lg bg-white p-4 flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-[4px] hover:shadow-xl transition-all border-2 border-[var(--border-color)]"
      whileHover={{ scale: 1.045 }}
      onClick={onClick}
      style={{ boxShadow: '0 4px 18px 0 rgba(79,142,255,0.12)' }}
    >
      <img
        src={drawing.dataUrl}
        alt="Drawing"
        className="w-32 h-32 object-contain rounded-xl mb-2 border-2 border-[var(--primary)]"
        style={{ background: "var(--draw-bg)", transition: "box-shadow 0.2s" }}
      />
      <div className="font-bungee font-bold text-xl text-[var(--primary)]">{drawing.prompt ? drawing.prompt : "Guess the Drawing!"}</div>
      <div className="text-xs text-gray-700 font-mono">by <span className="font-semibold text-indigo-600">{drawing.drawingUsername || "anon"}</span></div>
      <div className="font-mono text-green-700 text-md py-0.5">{drawing.score ?? 0} pts</div>
    </motion.div>
  )
}
