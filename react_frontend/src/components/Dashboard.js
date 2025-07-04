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
            <div className="font-bungee text-2xl pb-2">
              🔎 Community Drawings
            </div>
            <button
              className="mt-3 md:mt-0 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:shadow-xl hover:bg-blue-600 transition"
              onClick={() => navigate('/drawing/new')}
            >
              <PlusCircle size={20} />
              Add Your Drawing!
            </button>
          </div>
          {topDrawing && (
            <div className="bg-indigo-100 rounded-xl p-3 mb-4 drop-shadow flex items-center gap-2">
              <span className="font-bold text-indigo-900">🏆 Top Drawing:</span>
              <img
                src={topDrawing.dataUrl}
                alt="Top Drawing"
                className="w-14 h-14 object-contain rounded-lg border"
              />
              <span className="ml-2">{topDrawing.prompt || "—"}</span>
              <span className="ml-8 text-green-600 font-bold">
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
      className="rounded-xl shadow-md bg-white p-3 flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 transition-all"
      whileHover={{ scale: 1.04 }}
      onClick={onClick}
    >
      <img
        src={drawing.dataUrl}
        alt="Drawing"
        className="w-28 h-28 object-contain rounded-md mb-2 border"
        style={{ background: "#fcfaf6" }}
      />
      <div className="font-bold text-lg">{drawing.prompt ? drawing.prompt : "Guess the Drawing!"}</div>
      <div className="text-xs text-gray-500">by <span className="font-semibold">{drawing.drawingUsername || "anon"}</span></div>
      <div className="font-mono text-green-700">{drawing.score ?? 0} pts</div>
    </motion.div>
  )
}
