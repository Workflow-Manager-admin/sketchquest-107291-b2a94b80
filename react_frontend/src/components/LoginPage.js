import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Sparkles, Smile } from "lucide-react";

// PUBLIC_INTERFACE
export default function LoginPage() {
  const { user, signInAnon } = useAppContext();
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  // Mascot animation settings
  const mascotAnim = {
    initial: { scale: 0.7, rotate: -7 },
    animate: { scale: [1.18, 1.05, 1], rotate: [14, -8, 0] },
    transition: { duration: 1.75, type: "spring", bounce: 0.37, delay: 0.21 }
  };

  // Login logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await signInAnon();
      navigate("/dashboard");
    } catch (e) {
      setErr("Failed to sign in.");
      setBusy(false);
    }
  };

  return (
    <motion.div
      className="auth-center bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] min-h-[88vh] flex flex-col items-center justify-center"
      initial={{ opacity: 0, scale: 0.94, y: 19 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.65, type: "spring", stiffness: 80 }}
    >
      <motion.div
        className="sketch-card flex flex-col items-center gap-4 w-[96vw] max-w-xs sm:max-w-md shadow-2xl relative"
        initial={{ scale: 0.89, y: 40, opacity: 0.62 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.65, bounce: 0.4 }}
        style={{
          padding: "2.25rem 1.8rem 1.7rem 1.8rem",
          background: "linear-gradient(104deg,#e4f0ff 70%,#ffe385 110%)"
        }}
      >
        <motion.div
          className="mascot-logo wavy mb-0 -mt-7 shadow-lg"
          {...mascotAnim}
        >
          {/* Playful mascot/logo */}
          <span
            role="img"
            aria-label="mascot"
            style={{
              fontSize: 62,
              userSelect: "none",
              filter: "drop-shadow(0 2px 12px #ffe38599)"
            }}
          >🦎</span>
        </motion.div>
        <motion.div
          className="font-bungee text-3xl font-extrabold text-playful drop-shadow wavy text-center pt-1 mb-2"
          initial={{ scale: 0.81 }}
          animate={{ scale: 1, transition: { type: "spring", stiffness: 180, delay: 0.2 } }}
        >
          SketchQuest
        </motion.div>
        <form
          onSubmit={handleLogin}
          className="flex flex-col w-full gap-3 motion-pop"
          autoComplete="off"
        >
          <div className="text-brand text-center font-bold tracking-wide mb-0.5 flex items-center justify-center gap-1">
            <Smile width="28" className="animate-spin" style={{ color: "var(--kavia-orange)" }} />
            <span className="font-bungee text-lg tracking-wide pl-1.5" style={{ color: "var(--button-active)" }}>
              Welcome, sketcher!
            </span>
          </div>
          <input
            className="rounded-xl border px-4 py-2 mb-0.5 text-lg focus:ring-2 transition-all focus:border-[var(--input-focus)] focus:ring-[var(--input-focus)] placeholder:text-muted bg-[var(--input-bg)] border-[var(--input-border)] motion-pop"
            type="text"
            placeholder="Nickname: (set later)"
            minLength={3}
            maxLength={16}
            value=""
            disabled
          />
          <motion.button
            type="submit"
            className="btn btn-animated w-full mt-1 font-bungee text-lg py-3 flex items-center justify-center gap-2 relative"
            style={{
              background: "linear-gradient(96deg,#4e73df 70%,#ff6b81 100%)",
              color: "#fff",
              borderRadius: "1.9rem",
              boxShadow: "0 4px 22px #b2e7ff77,0 2px 10px #dbeaff22",
              letterSpacing: "1.1px"
            }}
            disabled={busy}
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.94, rotate: -4 }}
            whileHover={{ scale: 1.045, background: "linear-gradient(90deg,#4e73df 35%,#fbbf24 90%)", color: "#333" }}
          >
            <Sparkles size={22} style={{ marginRight: 5 }} />
            {busy ? "Signing In..." : "Continue (Anonymous)"}
          </motion.button>
          {err &&
            <motion.div
              className="text-center text-[var(--error)] font-bungee font-semibold pt-2 drop-shadow animate-shake"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.38 }}
            >{err}</motion.div>
          }
        </form>
        <div className="w-full pt-2 pb-1 mt-1 text-center text-md text-muted font-sans">
          <span className="font-playful mr-1">✨</span>Your drawings, username &amp; scores are saved. <span className="font-playful">No email required!</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
