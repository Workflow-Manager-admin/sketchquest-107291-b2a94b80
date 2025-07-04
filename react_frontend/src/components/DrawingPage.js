import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { useAppContext } from "../context/AppContext";
import { motion, useAnimation } from "framer-motion";
import { Sparkles, Timer, ThumbsUp, ThumbsDown } from "lucide-react";

// Spin wheel prompt pool - playful vibes!
const PROMPTS = [
  "Cat", "Dog", "Lizard", "Elephant", "Parrot", "Snake", "Rabbit", "Dolphin", "Frog",
  "Tiger", "Giraffe", "Panda", "Swan", "Peacock", "Chameleon", "Hamster", "Zebra", "Seal", "Koala"
];

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

  // For bouncy error/correct guess animation in guess mode
  const guessMsgAnim = useAnimation();

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
      guessMsgAnim.start({ y: [0, -16, 1], scale: [1, 1.12, 1], transition: { type: "spring", bounce: 0.8 } });
      setTimeout(() => nav("/dashboard"), 1550);
    } else {
      await updateDoc(docRef, {
        wrongGuesses: arrayUnion({ who: user?.username, text: guessText })
      });
      setGuessMsg("❌ Nope! Try again!");
      guessMsgAnim.start({ x: [-1, 10, -6, 1, 0], scale: [1, 1.03, 1, 1] });
      setWrongGuesses(guesses => [...guesses, { who: user?.username, text: guessText }]);
    }
    setLoading(false);
    setGuessText("");
  }

  // DRAW mode
  if (mode === "draw") {
    return (
      <motion.div
        className="flex flex-col items-center mt-6 gap-3"
        initial={{ opacity: 0, y: 10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", delay: 0.1 }}
      >
        <div className="font-bungee text-lg wavy">Spin for a Prompt</div>
        {!chosenPrompt ? (
          <motion.button
            onClick={randomPrompt}
            className="btn-animated font-bungee text-lg px-7 py-2 mb-2 motion-pop"
            initial={{ scale: 0.91, y: -6 }}
            animate={{ scale: 1, y: 0 }}
            whileTap={{ scale: 0.95, rotate: -6 }}
            whileHover={{ scale: 1.045, background: "var(--kavia-orange)" }}
            style={{
              background: "linear-gradient(90deg,#6366f1 60%,#fbbf24 100%)",
              color: "#fff"
            }}
          >
            <Sparkles size={23} className="mr-1" /> Spin the Wheel
          </motion.button>
        ) : (
          <>
            <div className="font-bold font-bungee text-indigo-700 text-xl mb-2">{`Prompt: ${chosenPrompt}`}</div>
            <div className="font-mono flex items-center text-lg gap-2">
              <Timer size={19} style={{marginRight:3}} />
              Timer:
              <span className={timer < 10 ? "text-red-500 font-bold animate-pulse" : "text-green-700 font-bold"}>
                {timer}s
              </span>
            </div>
            <div className="canvas-bg flex items-center justify-center p-3 rounded-2xl my-3 shadow"
                style={{minWidth:300, minHeight:300, border:"2.5px solid var(--border-color)"}}
              >
              <canvas
                ref={canvasRef}
                width={280}
                height={280}
                className="rounded-2xl border-2 border-[var(--input-border)] drop-shadow bg-white"
                style={{ background: "var(--draw-bg)", touchAction: "none"}}
              />
            </div>
            <button
              className={`btn-animated mt-2 px-7 py-2 font-bungee text-lg rounded-full transition-all ${timer > 0 ? "bg-gray-300 cursor-not-allowed opacity-55 animate-pulse" : "bg-green-500 hover:bg-green-600"}`}
              onClick={handleSaveDrawing}
              disabled={timer > 0}
              style={{
                boxShadow: timer > 0
                  ? "none"
                  : "0 2px 16px #a7f6b6bb",
                color: timer > 0 ? "#8d8d8d" : "#fff"
              }}
            >
              {timer > 0 ? "Finish Drawing to Submit" : <>Submit Drawing <ThumbsUp size={19} className="inline ml-1"/></>}
            </button>
          </>
        )}
      </motion.div>
    );
  }

  // GUESS mode
  return (
    <motion.div
      className="flex flex-col items-center mt-6 gap-6 sktq-guess"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, type: "spring" }}
    >
      <div className="font-bungee text-xl wavy flex gap-2 items-center">Guess the Drawing! <Sparkles size={21}/></div>
      {loading || !drawingData ? (
        <div className="text-lg py-20 animate-pulse">Loading...</div>
      ) : (
        <>
          <motion.img
            src={drawingData.dataUrl}
            alt="Guess Drawing"
            className="w-56 h-56 object-contain rounded-xl border bg-white drop-shadow-lg canvas-bg"
            initial={{ scale: 0.88, opacity: 0.65 }}
            animate={{ scale: 1, opacity: 1 }}
          />
          <form
            onSubmit={handleGuess}
            className="flex items-center gap-3 w-full max-w-xs"
            autoComplete="off"
          >
            <input
              className="rounded-xl border px-4 py-2 text-lg font-bungee focus:ring-2 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all placeholder:text-muted border-[var(--input-border)] bg-[var(--input-bg)]"
              type="text"
              placeholder="Your guess!"
              value={guessText}
              disabled={loading}
              onChange={e => setGuessText(e.target.value)}
              maxLength={24}
              required
              style={{ minWidth: 0, flex: 1 }}
            />
            <motion.button
              className="btn-animated px-4 py-2 font-bungee text-lg rounded-xl"
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.93 }}
              whileHover={{ scale: 1.06, background: "var(--kavia-orange)" }}
              style={{
                background: "linear-gradient(90deg,#4e73df 85%,#ff6b81 100%)",
                color: "#fff"
              }}
            >
              Guess!
            </motion.button>
          </form>
          {guessMsg && (
            <motion.div
              className={`text-md font-bold text-center mb-2 ${guessMsg.startsWith("🎉") ? "text-green-600" : "text-red-500"} drop-shadow motion-pop`}
              animate={guessMsgAnim}
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, bounce: 0.9 }}
            >
              {guessMsg}{" "}
              {guessMsg.startsWith("🎉") ? <ThumbsUp className="inline ml-1" color="#10B981" /> : <ThumbsDown className="inline ml-1" color="#ff6b81" />}
            </motion.div>
          )}
          <div className="w-full max-w-xs mt-3">
            <div className="font-bungee mb-1 text-muted text-center">Wrong Guesses:</div>
            <ul className="flex flex-col gap-1">
              {wrongGuesses.map((g, idx) =>
                <li key={idx} className="text-xs text-gray-500 motion-pop">
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
