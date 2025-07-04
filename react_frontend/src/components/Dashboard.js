import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { PlusCircle, Star } from "lucide-react";

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

  // Floating Action Button for "Add Drawing"
  function AddDrawingFAB() {
    return (
      <motion.button
        className="fab fixed"
        whileHover={{ rotate: -10, scale: 1.09 }}
        whileTap={{ scale: 0.91, rotate: 12 }}
        onClick={() => navigate("/drawing/new")}
        aria-label="Add Drawing"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.54, type: "spring" } }}
      >
        <PlusCircle size={32} style={{marginRight: '-3px', marginBottom: '-6px'}} /> 
      </motion.button>
    );
  }

  return (
    <>
      <section>
        <motion.div
          initial={{ opacity: 0, y: -35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.13, type: "spring", bounce: 0.7 }}
        >
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center pb-4">
            <div className="font-bungee text-3xl pb-2 tracking-wide text-[var(--text-secondary)] drop-shadow motion-pop flex gap-2 items-center">
              <span role="img" aria-label="magnifier" className="wavy text-2xl">🔎</span> 
              <span>Community Drawings</span>
            </div>
            <span className="hidden md:block">
              <AddDrawingFAB />
            </span>
            <button
              className="md:hidden mt-3 flex items-center gap-2 px-5 py-2.5 font-bold bg-gradient-to-r from-[var(--button-bg)] to-[var(--brand-purple)] text-[var(--button-text)] rounded-full shadow-lg hover:shadow-xl hover:bg-[var(--button-hover)] transition-all text-lg border-2 border-[var(--border-color)]"
              onClick={() => navigate('/drawing/new')}
              style={{ boxShadow: '0 2px 12px 0 rgba(77,116,255,0.13)' }}
            >
              <PlusCircle size={22} /> Add Drawing
            </button>
          </div>

          {topDrawing && (
            <motion.div
              className="bg-[var(--sketch-yellow)] rounded-2xl py-3 px-4 mb-4 drop-shadow-lg flex items-center gap-3 border-l-8 border-[var(--primary)] sticky-leaderboard"
              style={{ boxShadow: '0 4px 18px 0 #ffe38544'}}
              layout
              initial={{ scale: 0.95, opacity: 0, y: 28 }}
              animate={{ scale: 1.07, opacity: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.85, delay: 0.16 }}
            >
              <Star size={30} color="#ffbb11" className="mr-2 wavy" style={{filter:'drop-shadow(0 2px 7px #ffe385aa)'}} />
              <span className="font-bungee font-bold text-violet-900 text-lg motion-pop">Top Drawing:</span>
              <img
                src={topDrawing.dataUrl}
                alt="Top Drawing"
                className="w-14 h-14 object-contain rounded-2xl border-[3.8px] border-[var(--primary)] shadow-lg"
                style={{ background: "var(--draw-bg)" }}
              />
              <span className="ml-2 font-bungee tracking-wide">{topDrawing.prompt || "—"}</span>
              <span className="ml-6 text-green-700 font-extrabold text-lg flex items-center">
                <span role="img" aria-label="score">💎</span> {topDrawing.score ?? 0} pts
              </span>
              <motion.div
                className="mascot-logo wavy ml-auto"
                initial={{ scale: 0.7, x: 25, rotate: -12 }}
                animate={{ scale: 1, x: 0, rotate: 3 }}
                transition={{ delay: 0.24, type: "spring" }}
              >
                <span role="img" aria-label="mascot" style={{fontSize: 27}}>🦎</span>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </section>
      <section>
        {loading ? (
          <div className="text-center text-lg py-12 animate-pulse">Loading...</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 md:gap-6"
            initial="init"
            animate="enter"
            variants={{
              init: { opacity: 0, y: 25 },
              enter: { opacity: 1, y: 0, transition: { staggerChildren: 0.035, delayChildren: 0.18 }}
            }}
          >
            {drawings.map(draw =>
              <DrawingCard key={draw.id} drawing={draw} onClick={() => navigate(`/drawing/${draw.id}`)} />
            )}
          </motion.div>
        )}
        <span className="md:hidden">
          <AddDrawingFAB />
        </span>
      </section>
    </>
  )
}

function DrawingCard({ drawing, onClick }) {
  return (
    <motion.div
      className="sketch-card motion-pop cursor-pointer flex flex-col items-center gap-3 border-2 border-[var(--border-color)] hover:shadow-2xl hover:scale-[1.045] active:scale-[0.98] transition-all"
      whileHover={{ scale: 1.06, boxShadow: "0 9px 30px #4e73df23" }}
      whileTap={{ scale: 0.96, rotate: -3 }}
      onClick={onClick}
      style={{ background: "var(--card-gradient)", minHeight: 245 }}
    >
      <img
        src={drawing.dataUrl}
        alt="Drawing"
        className="w-32 h-32 object-contain rounded-xl mb-2 border-2 border-[var(--primary)] shadow"
        style={{ background: "var(--draw-bg)", transition: "box-shadow 0.2s" }}
      />
      <div className="font-bungee font-bold text-xl text-playful text-center text-shadow" style={{textShadow: '0 2px 4px #c3dafbbb'}}>
        {drawing.prompt ? drawing.prompt : "Guess the Drawing!"}
      </div>
      <div className="text-xs text-gray-700 font-mono">by <span className="font-semibold text-brand">{drawing.drawingUsername || "anon"}</span></div>
      <div className="font-bungee text-violet-600 text-md py-0.5">{drawing.score ?? 0} pts</div>
    </motion.div>
  )
}
