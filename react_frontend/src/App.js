import React, { useEffect, useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, LogIn, Palette, UserPlus, Trophy, HomeIcon } from "lucide-react";
import "./App.css";
import "./index.css";
import "./tailwind.output.css"; // Tailwind output, must exist after build.

// Firebase
import {
  signInAnon,
  signOutUser,
  onAuthChange,
  db,
  auth,
} from "./firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  addDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// Theme & Fonts
const funFont = { fontFamily: "'Bungee', 'Fredoka', 'Nunito', 'Press Start 2P', cursive" };
const bodyFont = { fontFamily: "'Quicksand', 'Open Sans', Inter, Arial, sans-serif" };

// ---- UI Theme/Palette ----
const theme = {
  primary: "#4F8EFF", // vibrant blue
  secondary: "#fcf8ee", // pastel yellow background
  accent: "#ff6b81", // coral red (for accents/alerts)
  accent2: "#10b981", // mint green (positive)
  accent3: "#6366f1", // violet
  textBody: "#22223B",
  textHeading: "#151414",
  cardBg: "#FFFFFF",
  border: "#E7EAF6",
  shadow: "0 6px 24px 0 rgba(54,110,255,0.10)",
  radius: "1.5rem"
};

// ---- Auth Context ----
export const AuthContext = React.createContext({
  user: null,
  username: null,
  loading: false,
  setUser: () => {},
  setUsername: () => {},
});

// ---- Helper: Mascot Logo ----
function LogoMascot({ size = 70 }) {
  // Soft blue pencil with bird on top, SVG
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <ellipse cx="73" cy="21" rx="21" ry="15" fill="#AEE6FC" />
      <ellipse cx="25" cy="50" rx="19" ry="16" fill="#F2E8CF" />
      {/* Pencil body */}
      <rect x="50" y="30" width="13" height="50" rx="6" fill="#4F8EFF" />
      <rect x="50" y="75" width="13" height="5" rx="2.5" fill="#FFC93C" />
      <polygon points="50,80 56.5,95 63,80" fill="#C2935F" />
      {/* Bird - body */}
      <ellipse cx="56.5" cy="20" rx="9.5" ry="8" fill="#D5F0FF" />
      <ellipse cx="66" cy="16.5" rx="3.5" ry="5.5" fill="#FFAF45" />
      {/* Bird - eye */}
      <circle cx="58" cy="19" r="1.5" fill="#333" />
    </svg>
  );
}

// ---- Loading Overlay ----
function FullscreenLoading({ label = "Loading..." }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-75 flex flex-col items-center justify-center z-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="mb-4"
      >
        <Loader2 size={54} color={theme.primary} strokeWidth={2.2} />
      </motion.div>
      <span className="text-lg font-semibold" style={funFont}>{label}</span>
    </div>
  );
}

// ---- Username Set Modal ----
function UsernamePickerModal({ open, onSave, error }) {
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function handleSave() {
    if (!username.match(/^[a-zA-Z0-9_]{3,15}$/)) return onSave(username, "Must be 3-15 letters, numbers, _");
    setSaving(true);
    // Check uniqueness in Firestore ("usernames" collection, one doc per username)
    const found = await getDoc(doc(db, "usernames", username));
    setSaving(false);
    if (found.exists()) {
      onSave(username, "Username is taken!");
    } else {
      // Register username
      await setDoc(doc(db, "usernames", username), {
        created: serverTimestamp(),
        uid: auth.currentUser.uid,
      });
      onSave(username, null);
    }
  }
  
  return (
    <div className="fixed z-40 inset-0 flex items-center justify-center bg-slate-900 bg-opacity-50">
      <motion.div animate={{ scale: open ? 1 : 0.9 }} initial={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 shadow-2xl w-[380px] max-w-[94vw]">
        <div className="flex flex-col items-center gap-2">
          <LogoMascot size={48} />
          <h2 className="text-xl font-bold mb-1" style={funFont}>Choose a username</h2>
          <p className="mb-2 text-gray-500 text-sm">It must be unique and 3-15 characters.</p>
          <input
            style={bodyFont}
            className="border-2 rounded-xl px-4 py-2 w-full text-lg text-center focus:border-blue-500 bg-slate-100 mb-1"
            type="text"
            placeholder="Your SketchQuest name"
            maxLength={15}
            disabled={saving}
            autoFocus
            value={username}
            onChange={e => setUsername(e.target.value.replace(/[^\w]/g, ""))}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
          {error && <span className="text-red-500 font-semibold">{error}</span>}
          <button
            style={funFont}
            className="mt-2 px-4 py-2 rounded-full bg-blue-500 text-white font-bold drop-shadow hover:bg-blue-600 transition disabled:opacity-60"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "Checking..." : <><UserPlus className="inline mr-1" size={20}/>Set Username</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ---- Login Page ----
function LoginPage() {
  const { user, username, setUsername } = React.useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [unameError, setUnameError] = useState(null);

  useEffect(() => {
    // If user logs in, show username picker if not set.
    if (user && !username) setModalOpen(true);
  }, [user, username]);

  async function handleLogin() {
    try {
      await signInAnon();
      setModalOpen(true);
    } catch (e) {
      setUnameError(e.message);
    }
  }

  async function handleUsernameSet(u, err) {
    if (err) {
      setUnameError(err);
    } else {
      setUnameError(null);
      setUsername(u); // Set in context
      setModalOpen(false);
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.secondary }}>
      <header className="flex flex-row items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2 font-bold text-2xl text-blue-500" style={funFont}>
          <LogoMascot size={40} /> SketchQuest
        </span>
        <span className="ml-auto text-sm text-gray-900 font-semibold">v1.0</span>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center mt-[-10vh]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md px-9 py-10 flex flex-col items-center mb-4"
        >
          <LogoMascot size={72}/>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2" style={{ ...funFont, color: theme.primary }}>Welcome!</h1>
          <p className="text-lg mb-6 text-gray-600" style={bodyFont}>Draw. Guess. Become a legend.<br/>Jump in with a fun username & start playing!</p>
          <button
            className="mb-2 px-6 py-3 bg-blue-500 rounded-full shadow text-white text-lg font-bold hover:bg-blue-600 transition flex items-center"
            style={funFont}
            onClick={handleLogin}
          ><LogIn className="mr-2" size={22}/>Sign In & Play!</button>
        </motion.div>
      </main>
      <UsernamePickerModal open={modalOpen} onSave={handleUsernameSet} error={unameError}/>
      <p className="py-3 text-center text-xs text-gray-500">Built with ❤️ for the animal-guessing masters</p>
    </div>
  );
}

// ---- Floating Action Button ----
function FabAddDrawing({ onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05, boxShadow: "0 8px 32px #4F8EFF50" }}
      className="fixed bottom-8 right-7 z-30 w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-blue-600 transition"
      style={{ boxShadow: theme.shadow }}
      onClick={onClick}
      aria-label="Add Drawing"
    >
      <Palette size={32} />
    </motion.button>
  );
}

// ---- Dashboard Page ----
function DashboardPage() {
  const navigate = useNavigate();
  const { user, username } = React.useContext(AuthContext);

  // State for drawings, guesses, top drawing, modal, etc.
  const [drawings, setDrawings] = useState([]);
  const [top, setTop] = useState(null); // Top drawing
  const [guessing, setGuessing] = useState({}); // Per drawing input
  const [inputDisabled, setInputDisabled] = useState({});
  const [wrongGuesses, setWrongGuesses] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to drawings collection (real-time)
    const unsubDrawings = onSnapshot(query(collection(db, "drawings"), orderBy("created", "desc"), limit(32)), snapshot => {
      let arr = [];
      snapshot.forEach(doc => arr.push({ ...doc.data(), id: doc.id }));
      setDrawings(arr);
      setLoading(false);
    });
    // Top drawing (the one w/ most corrects)
    const unsubTop = onSnapshot(query(collection(db, "drawings"), orderBy("correctCount", "desc"), limit(1)), snapshot => {
      let topDoc = null;
      snapshot.forEach(doc => topDoc = { ...doc.data(), id: doc.id });
      setTop(topDoc);
    });
    // Leaderboard for guesses
    const unsubLB = onSnapshot(query(collection(db, "leaderboard"), orderBy("score", "desc"), limit(8)), snap => {
      let arr = [];
      snap.forEach(doc => arr.push(doc.data()));
      setLeaderboard(arr);
    });
    // Wrong guesses (nested, one per drawing)
    let unsubWrong = [];
    setDrawings(prev => {
      prev.forEach(drawing => {
        const unsub = onSnapshot(collection(db, "drawings", drawing.id, "wrongGuesses"), snap => {
          let wg = [];
          snap.forEach(doc => wg.push(doc.data().guess));
          setWrongGuesses(prevWG => ({ ...prevWG, [drawing.id]: wg }));
        });
        unsubWrong.push(unsub);
      });
      return prev;
    });

    // Cleanup
    return () => {
      unsubDrawings && unsubDrawings();
      unsubTop && unsubTop();
      unsubLB && unsubLB();
      unsubWrong.forEach(u => u && u());
    };
  }, []);

  async function handleGuess(drawingId) {
    if (inputDisabled[drawingId]) return;
    const guess = (guessing[drawingId] || "").trim();
    if (!guess) return;
    setInputDisabled(prev => ({ ...prev, [drawingId]: true }));
    // Fetch drawing
    const d = drawings.find(d => d.id === drawingId);
    if (!d) return;
    // Compare, allow only one guess per user/drawing (could check in Firestore for userGuesses)
    if ((d.correctGuesses || []).includes(username)) {
      // already correct guess, don't let input again
      setInputDisabled(prev => ({ ...prev, [drawingId]: true }));
      return;
    }
    if (guess.toLowerCase() === d.prompt.toLowerCase()) {
      // Correct!
      await updateDoc(doc(db, "drawings", drawingId), {
        correctGuesses: arrayUnion(username),
        correctCount: (d.correctCount || 0) + 1,
      });
      // Animate success
      window?.navigator?.vibrate && window.navigator.vibrate(140);
      setInputDisabled(prev => ({ ...prev, [drawingId]: true }));
      // Update leaderboard
      await updateDoc(doc(db, "leaderboard", username), {
        username,
        score: (leaderboard.find(l => l.username === username)?.score || 0) + 1
      }).catch(async () => {
        // If not present
        await setDoc(doc(db, "leaderboard", username), {
          username,
          score: 1,
        });
      });
    } else {
      // Wrong guess: log in subcollection "wrongGuesses"
      await addDoc(collection(db, "drawings", drawingId, "wrongGuesses"), {
        guess,
        user: username,
        timestamp: serverTimestamp(),
      });
      // UX: Shake, flash, highlight
      const el = document.getElementById(`input-${drawingId}`);
      if (el) {
        el.classList.add("animate-shake");
        setTimeout(() => el.classList.remove("animate-shake"), 550);
      }
      setInputDisabled(prev => ({ ...prev, [drawingId]: false }));
    }
    setGuessing(prev => ({ ...prev, [drawingId]: "" }));
  }

  if (!user || !username) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="min-h-screen bg-[#F7F9FF] flex flex-col" style={{ ...bodyFont, background: theme.secondary }}>
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 shadow-sm flex items-center px-6 py-3 mb-1 rounded-b-2xl" style={{ boxShadow: theme.shadow }}>
        <LogoMascot size={36} />
        <span className="ml-3 text-2xl font-extrabold tracking-tight text-blue-600" style={funFont}>SketchQuest</span>
        <span className="ml-auto flex items-center gap-2 text-gray-600">
          <UserPlus size={20}/>{username}
          <button
            className="ml-4 bg-slate-100 rounded-lg px-4 py-1 text-sm font-semibold hover:bg-slate-200 transition"
            onClick={() => { signOutUser(); window.location.href = "/"; }}
          >Sign Out</button>
        </span>
      </header>
      {/* Top Drawing Feature */}
      {top && (
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mx-auto w-full max-w-3xl p-4 my-2 rounded-2xl flex flex-row gap-5 items-center shadow"
          style={{ background: "#E3EFFD", border: "2px solid #B6DDFF" }}
        >
          <Trophy size={32} color={theme.primary} className="drop-shadow" />
          <img src={top.imgUrl} alt="Top drawing" style={{ width: 70, height: 70, borderRadius: 18, background: "#fff", border: "2px solid #C9DFFF" }}/>
          <div className="flex-grow flex flex-col">
            <span className="font-bold text-gray-900 text-lg" style={funFont}>Top Drawing</span>
            <span className="text-md mt-1" style={{ color: theme.textBody }}>Prompt: <b>{top.prompt}</b> by <b>{top.author}</b>
            <span className="ml-2 px-3 rounded-xl bg-green-100 text-blue-800 text-xs font-semibold">{top.correctCount} guessed right!</span></span>
          </div>
        </motion.div>
      )}
      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-row gap-8 px-4">
        {/* Drawings Grid */}
        <section className="flex-grow w-3/5 min-w-[320px]">
          <h2 className="mt-3 text-xl font-bold text-blue-700" style={funFont}>Guess these creatures!</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-3">
            {loading && (
              <div className="col-span-full text-gray-500 my-12 flex flex-col items-center">
                <Loader2 size={38} className="animate-spin" /><span>Loading drawings...</span>
              </div>
            )}
            {!loading && drawings.length === 0 && (
              <div className="col-span-full text-gray-400">No drawings yet. Add one!</div>
            )}
            {drawings.map(d => (
              <motion.div
                key={d.id}
                whileHover={{ scale: 1.03, boxShadow: "0 8px 24px #4F8EFF30" }}
                className="rounded-xl bg-white shadow-md p-3 flex flex-col items-center"
                style={{ border: "2px solid #ECF1FF" }}
              >
                <img src={d.imgUrl} alt="drawing" className="w-32 h-32 rounded-lg mb-2 border border-blue-100 bg-gray-50 drop-shadow" />
                <span className="text-gray-700 text-sm mb-1" style={bodyFont}>by <b>{d.author}</b></span>
                {/* Guess input */}
                {!d.correctGuesses?.includes(username) ? (
                  <div className="flex flex-col items-center w-full">
                    <input
                      id={`input-${d.id}`}
                      style={{...bodyFont, borderRadius: 10 }}
                      className="border-2 border-gray-300 px-3 py-1 w-[90%] text-lg focus:border-blue-400 focus:shadow-sm disabled:bg-gray-200 transition mb-1"
                      placeholder="Your guess..."
                      value={guessing[d.id] || ""}
                      disabled={!!inputDisabled[d.id]}
                      onChange={e => setGuessing(prev => ({...prev, [d.id]: e.target.value.replace(/[^a-zA-Z0-9 ]/g,'')}))}
                      onKeyDown={e => e.key === "Enter" && handleGuess(d.id)}
                    />
                    <button
                      className="text-sm px-4 py-1 rounded-full font-semibold bg-blue-500 text-white shadow hover:bg-blue-600 transition"
                      disabled={!!inputDisabled[d.id] || !guessing[d.id]}
                      onClick={() => handleGuess(d.id)}
                    >Submit</button>
                  </div>
                ) : (
                  <div className="w-full text-center mt-2">
                    <span className="text-green-600 font-bold">🎉 Got it!</span>
                  </div>
                )}
                {/* Wrong guesses */}
                <div className="w-full text-left mt-2">
                  <span className="text-xs text-gray-400 font-semibold">Wrong guesses:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(wrongGuesses[d.id] || []).slice(-5).map((g, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded bg-pink-100 text-pink-500">{g}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        {/* Leaderboard */}
        <aside className="w-1/4 min-w-[240px] pt-5">
          <div className="rounded-xl bg-white shadow-lg px-6 py-4 mb-3 border-2 border-[#DDF3F8]" style={{ background: "#fcf8ee" }}>
            <h3 className="text-lg font-bold mb-2 text-blue-500" style={funFont}><Trophy className="inline mr-1" size={20}/>Leaderboard</h3>
            <ol className="space-y-1 text-sm">
              {leaderboard.length === 0 ? <span>Loading...</span> :
                leaderboard.map((entry, idx) =>
                  <li key={entry.username} className="flex items-center gap-2">
                    <span className={`font-bold text-xl`}>{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx+1}</span>
                    <span className="font-semibold text-gray-700">{entry.username}</span>
                    <span className="ml-auto text-blue-700">{entry.score}</span>
                  </li>
              )}
            </ol>
          </div>
        </aside>
      </main>
      <FabAddDrawing onClick={() => navigate("/draw")} />
    </div>
  );
}

// ---- Drawing Prompt Wheel ----
function DrawingPromptWheel({ onSelect, visible }) {
  const prompts = ["Parrot", "Frog", "Elephant", "Penguin", "Giraffe", "Dolphin", "Dragonfly", "Camel", "Otter", "Tiger", "Panda", "Peacock"];
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState(null);

  if (!visible) return null;

  async function spinWheel() {
    setSpinning(true);
    // Randomly spin for ~2s
    let idx = 0;
    for (let t=0;t<18;t++) {
      idx = Math.floor(Math.random()*prompts.length);
      setSelected(prompts[idx]);
      await new Promise(r=>setTimeout(r, 70 + t*8));
    }
    setSpinning(false);
    onSelect(prompts[idx]);
  }
  useEffect(() => { spinWheel(); },[]);

  return (
    <div className="fixed z-40 inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <motion.div animate={{ scale: visible ? 1 : 0.9 }} initial={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 shadow-lg text-center">
        <div className="text-lg font-semibold mb-2" style={funFont}>Your prompt:</div>
        <motion.div
          className="rounded-full bg-blue-100 shadow-inner p-8 inline-block mb-3"
          animate={{ rotate: spinning ? 360 * 1.3 : 0, scale: spinning ? 1.1 : 1 }}
          transition={{ duration: 1.5 }}
        >
          <span className="text-3xl font-extrabold" style={funFont}>
            {selected || <Loader2 className="inline animate-spin" size={34}/>}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ---- Drawing Canvas Page ----
function DrawingPage() {
  // All hooks must be called unconditionally, before any returns.
  const { username } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [canvasRef, setCanvasRef] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [timer, setTimer] = useState(45);
  const [prompt, setPrompt] = useState(null);
  const [saving, setSaving] = useState(false);
  const storage = getStorage();

  // Timer useEffect always present
  useEffect(() => {
    let intervalId = null;
    if (prompt !== null) {
      setTimer(45);
      intervalId = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) return prev - 1;
          clearInterval(intervalId);
          setDrawing(false);
          return 0;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [prompt]);

  // Auth guard: navigation on missing username (MUST be after all hooks)
  if (!username) {
    return <Navigate to="/" replace />;
  }

  function handleMouseDown(e) {
    setDrawing(true);
    const canvas = canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  }
  function handleMouseMove(e) {
    if (!drawing) return;
    const canvas = canvasRef;
    const ctx = canvas.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = "#4F8EFF";
    ctx.lineWidth = 4.5;
    ctx.lineCap = "round";
    ctx.stroke();
  }
  function handleMouseUp() {
    setDrawing(false);
  }
  function handleClear() {
    const canvas = canvasRef;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  async function handleUpload() {
    setSaving(true);
    // Save to Firebase Storage
    const canvas = canvasRef;
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    const imgStorageRef = storageRef(storage, `drawings/${Date.now()}_${username}.png`);
    await uploadBytes(imgStorageRef, blob);
    const imgUrl = await getDownloadURL(imgStorageRef);
    // Save to Firestore
    await addDoc(collection(db, "drawings"), {
      imgUrl,
      prompt,
      author: username,
      correctGuesses: [],
      correctCount: 0,
      created: serverTimestamp(),
    });
    setSaving(false);
    navigate("/dashboard");
  }

  // Render: show spin wheel until prompt is set, then show canvas/timer
  return (
    <div className="min-h-screen bg-[#FAFFFB] p-6 flex flex-col items-center">
      {prompt === null ? (
        <DrawingPromptWheel visible={true} onSelect={setPrompt} />
      ) : (
        <>
          <header className="flex items-center w-full max-w-3xl mb-3">
            <button onClick={() => navigate("/dashboard")} className="mr-4 px-2 py-1 rounded hover:bg-blue-50 transition">
              <HomeIcon size={25} />
            </button>
            <span className="font-bold text-2xl" style={funFont}>
              Draw: <span className="text-blue-500">{prompt}</span>
            </span>
          </header>
          {/* Timer + Canvas */}
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-5 pb-8 mb-4 relative flex flex-col items-center">
            <motion.div
              animate={{ scale: timer <= 5 ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
              className="absolute top-3 left-3 px-5 py-2 rounded-full bg-yellow-100 text-yellow-700 font-bold text-lg shadow"
              style={funFont}
            >
              ⏳ {timer}s
            </motion.div>
            <canvas
              ref={r => setCanvasRef(r)}
              width={350}
              height={350}
              className="border-2 border-blue-200 bg-blue-50 rounded-2xl cursor-crosshair shadow-lg mb-4"
              style={{ touchAction: "none" }}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            />
            <div className="flex gap-3 mt-2">
              <button className="px-4 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200" onClick={handleClear} disabled={timer === 0}>Clear</button>
              <button className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600" onClick={handleUpload} disabled={timer === 0 || saving}>{saving ? "Uploading..." : "Upload"}</button>
            </div>
            {timer === 0 && (
              <span className="absolute bottom-2 left-0 right-0 text-red-500 font-bold text-md" style={funFont}>
                Time's up! Upload your art now.
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ---- Main App & Routing ----
function InnerApp() {
  // Auth logic
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  // Setup Firebase Auth
  useEffect(() => {
    setLoading(true);
    const unsub = onAuthChange(async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        // Fetch username from "usernames" collection by UID
        const unameDoc = await getDocs(query(collection(db, "usernames")));
        let uname = null;
        unameDoc.forEach(docu => {
          if (docu.data().uid === fbUser.uid) uname = docu.id;
        });
        setUsername(uname);
      } else {
        setUser(null);
        setUsername(null);
      }
      setLoading(false);
    });
    return () => unsub && unsub();
  }, []);

  const ctxVal = useMemo(() => ({ user, username, loading, setUser, setUsername }), [user, username, loading]);

  if (loading) return <FullscreenLoading label="Loading SketchQuest..."/>;
  return (
    <AuthContext.Provider value={ctxVal}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/draw" element={<DrawingPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <AnimatePresence>
        <InnerApp />
      </AnimatePresence>
    </Router>
  );
}

export default App;
