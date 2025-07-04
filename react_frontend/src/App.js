... (unchanged header and component code above DrawingPage)

function DrawingPage() {
  const { username } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [canvasRef, setCanvasRef] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [timer, setTimer] = useState(45);
  const [prompt, setPrompt] = useState(null);
  const [saving, setSaving] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const storage = getStorage();

  useEffect(() => {
    if (!username) {
      setRedirecting(true);
      navigate("/", { replace: true });
    } else {
      setRedirecting(false);
    }
  }, [username, navigate]);

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

  if (redirecting) {
    return <FullscreenLoading label="Redirecting..." />;
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
    const canvas = canvasRef;
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    const imgStorageRef = storageRef(storage, `drawings/${Date.now()}_${username}.png`);
    await uploadBytes(imgStorageRef, blob);
    const imgUrl = await getDownloadURL(imgStorageRef);
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

... (rest of file unchanged)
