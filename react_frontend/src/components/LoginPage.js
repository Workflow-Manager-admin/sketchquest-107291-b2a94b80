import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

/**
 * LoginPage allows user to enter (or keep) their username and sign in.
 */
export default function LoginPage() {
  const { user, signInAnon } = useAppContext();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

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
      className="flex flex-col items-center justify-center h-[75vh]"
      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-xs rounded-2xl drop-shadow-lg bg-white px-8 py-6 flex flex-col items-center gap-4">
        <div className="font-bungee text-3xl text-blue-500 mb-2">🎲 SketchQuest Login</div>
        <form onSubmit={handleLogin} className="flex flex-col w-full gap-2">
          <input
            className="rounded-xl border px-4 py-2 mb-2"
            required
            type="text"
            placeholder="Pick a nickname (optional)"
            minLength={3}
            maxLength={16}
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled
            // Username saved on first guess/draw, not here.
          />
          <button
            type="submit"
            className="btn btn-primary w-full mt-2"
            style={{
              background: "#4F8EFF",
              color: "#fff",
              borderRadius: "0.6rem",
              fontWeight: 700,
              letterSpacing: "1px",
              padding: "0.75em",
              fontSize: 16
            }}
            disabled={busy}
          >
            {busy ? "Signing In..." : "Continue (Anonymous)"}
          </button>
          {err && <div className="text-center text-red-500 pt-1">{err}</div>}
        </form>
      </div>
    </motion.div>
  );
}
