import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";

// Prompts for spin wheel
const PROMPTS = ["Cat", "Dog", "Lizard", "Elephant", "Parrot", "Snake", "Rabbit", "Dolphin", "Frog", "Tiger", "Giraffe", "Panda", "Swan", "Peacock"];

export default function DrawingPage() {
  const { docId } = useParams();
  const { user } = useAppContext();
  const [drawingData, setDrawingData] = useState(null);
  const [mode, setMode] = useState(docId === "new" ? "draw" : "guess");
  const [guessText, setGuessText] = useState("");
  const [guessMsg, setGuessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const nav = useNavigate();

  // For new drawing: prompt chosen, timer, canvas state
  const [chosenPrompt, setChosenPrompt] = useState("");
  const [timer, setTimer] = useState(45);
  const [drawingUrl, setDrawingUrl] = useState("");
  const [canvasReady, setCanvasReady] = useState(false);
  const canvasRef = useRef();

  // Load existing drawing if guessing
  useEffect(() => {
    if (mode === "guess") {
      setLoading(true);
      getDoc(doc(db, "drawings", docId)).then(snap => {
        if (snap.exists()) {
          setDrawingData(snap.data());
          setWrongGuesses(snap.data().wrongGuesses || []);
        }
        setLoading(false);
      });
    }
  }, [docId, mode]);

  // Drawing Canvas Timer for new drawings
  useEffect(() => {
    if (mode === "draw" && chosenPrompt && timer > 0 && canvasReady) {
      const ivl = setInterval(() => setTimer((t) => t > 0 ? t - 1 : 0), 1000);
      return () => clearInterval(ivl);
    }
  }, [mode, chosenPrompt, timer, canvasReady]);

  // Drawing handlers
  function randomPrompt() {
    setChosenPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
    setTimer(45);
    setDrawingUrl("");
    setCanvasReady(false);
  }

  function handleCanvasDraw(e) {
    const canvas = canvasRef.current;
    if (!canvas || timer <= 0) return;
    const ctx = canvas.getContext("2d");
    let drawing = false;
    function getXY(evt) {
      const rect = canvas.getBoundingClientRect();
      if (evt.touches) evt = evt.touches[0];
      return {
        x: (evt.clientX - rect.left) * (canvas.width / rect.width),
        y: (evt.clientY - rect.top) * (canvas.height / rect.height)
      };
    }
    function start(evt) {
      drawing = true;
      ctx.beginPath();
      const { x, y } = getXY(evt);
      ctx.moveTo(x, y);
    }
    function draw(evt) {
      if (!drawing) return;
      evt.preventDefault();
      const { x, y } = getXY(evt);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#212121";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.stroke();
    }
    function stop(evt) {
      drawing = false;
      ctx.closePath();
    }
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stop);
    // Touch
    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stop);
    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stop);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stop);
    }
  }

  useEffect(() => {
    if (mode === "draw" && chosenPrompt && timer > 0) {
      setCanvasReady(true);
      handleCanvasDraw({ target: canvasRef.current });
    }
  }, [mode, chosenPrompt, timer]);

  function handleSaveDrawing() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    setDrawingUrl(dataUrl);
    // Upload to Firestore
    setDoc(doc(db, "drawings", Date.now().toString()), {
      dataUrl,
      prompt: chosenPrompt,
      drawingUsername: user?.username || "anon",
      createdAt: Date.now(),
      wrongGuesses: [],
      correctUser: "",
      score: 0,
      uid: user?.uid
    }).then(() => {
      nav("/dashboard");
    });
  }

  // Guessing flow
  async function handleGuess(e) {
    e.preventDefault();
    if (!guessText.trim()) return;
    setLoading(true);
    const docRef = doc(db, "drawings", docId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      setLoading(false); setGuessMsg("Drawing not found."); return;
    }
    const data = snap.data();
    const answer = (data.prompt || "").trim().toLowerCase();
    if (guessText.trim().toLowerCase() === answer) {
      // Correct! Update drawing, add to user's score, mark correctUser
      await updateDoc(docRef, {
        score: (data.score ?? 0) + 10,
        correctUser: user?.username || "anon"
      });
      setGuessMsg("🎉 Correct! You earned 10 points.");
      setTimeout(() => nav("/dashboard"), 1500);
    } else {
      await updateDoc(docRef, {
        wrongGuesses: arrayUnion({ who: user?.username, text: guessText })
      });
      setGuessMsg("❌ Wrong guess. Try again!");
      setWrongGuesses(guesses => [...guesses, { who: user?.username, text: guessText }]);
    }
    setLoading(false);
    setGuessText("");
  }

  // Render depending on mode
  if (mode === "draw") {
    return (
      <motion.div
        className="flex flex-col items-center mt-6 gap-2"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      >
        <div className="font-bungee text-lg">Spin for a Prompt</div>
        {!chosenPrompt ? (
          <button
            onClick={randomPrompt}
            className="px-6 py-2 bg-blue-500 rounded-xl font-bold text-white"
          >
            Spin the Wheel
          </button>
        ) : (
          <>
            <div className="font-bold text-indigo-700 text-xl mb-2">Prompt: {chosenPrompt}</div>
            <div className="font-mono text-gray-500">
              Timer: <span className={timer < 10 ? "text-red-500 font-bold" : ""}>{timer}s</span>
            </div>
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              className="border-2 border-gray-300 rounded-xl drop-shadow mb-2"
              style={{ background: "#fff", touchAction: "none" }}
            />
            <button
              className="mt-2 px-5 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700"
              onClick={handleSaveDrawing}
              disabled={timer > 0}
            >
              {timer > 0 ? "Finish Drawing to Submit" : "Submit Drawing"}
            </button>
          </>
        )}
      </motion.div>
    );
  }

  // GUESS mode
  return (
    <motion.div
      className="flex flex-col items-center mt-6 gap-5"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    >
      <div className="font-bungee text-xl">Guess the Drawing!</div>
      {loading || !drawingData ? (
        <div className="text-lg py-20">Loading...</div>
      ) : (
        <>
          <img
            src={drawingData.dataUrl}
            alt="Guess Drawing"
            className="w-56 h-56 object-contain rounded-xl border bg-white drop-shadow"
          />
          <form onSubmit={handleGuess} className="flex items-center gap-3">
            <input
              className="rounded-xl border px-4 py-2 font-xl"
              type="text"
              placeholder="Your guess!"
              value={guessText}
              disabled={loading}
              onChange={e => setGuessText(e.target.value)}
              maxLength={24}
              required
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold"
              type="submit"
              disabled={loading}
            >
              Guess!
            </button>
          </form>
          {guessMsg && <div className={`text-md font-semibold ${guessMsg.startsWith('🎉') ? "text-green-600" : "text-red-500"}`}>{guessMsg}</div>}
          <div className="w-full max-w-xs mt-3">
            <div className="font-bold mb-1 text-gray-700">Wrong Guesses:</div>
            <ul className="flex flex-col gap-1">
              {wrongGuesses.map((g, idx) =>
                <li key={idx} className="text-xs text-gray-500">
                  {g?.who ?? "anon"}: <span className="font-mono">{g?.text}</span>
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </motion.div>
  );
}
