
/* ============================================================
   SIMULASI PECAHKAN GELAS – RESONANSI (750 Hz)
   SUPPORT: DESKTOP & HP (MIC AKTIF)
   ============================================================ */

// =========================
// GLOBAL
// =========================
let audioCtx, analyser, micStream;
let dataArray, fftArray;
let isRecording = false;

const targetFreq = 750;
let score = 0;

// =========================
// AUDIO EFEK
// =========================
const breakSound = new Audio("gelas_pecah.mp3");
breakSound.volume = 0.7;

// =========================
// ELEMENT HTML
// =========================
const freqEl = document.getElementById("freq");
const ampEl = document.getElementById("amp");
const intensEl = document.getElementById("intens");
const lambdaEl = document.getElementById("lambda");
const statusEl = document.getElementById("status");
const scoreEl = document.getElementById("score");

const glass = document.getElementById("glass");
const broken = document.getElementById("broken");

// =========================
// START MIC
// =========================
document.getElementById("startBtn").onclick = async () => {
    if (isRecording) return;

    try {
        isRecording = true;
        statusEl.innerText = "Status: Meminta izin mikrofon...";

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        await audioCtx.resume(); // 🔥 WAJIB DI HP

        micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
            }
        });

        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;

        const source = audioCtx.createMediaStreamSource(micStream);
        source.connect(analyser);

        dataArray = new Uint8Array(analyser.fftSize);
        fftArray = new Uint8Array(analyser.frequencyBinCount);

        statusEl.innerText = "Status: Merekam (Mic Aktif)";
        draw();

    } catch (err) {
        alert("Mikrofon tidak bisa diakses.\nGunakan Firefox / Laptop.");
        console.error(err);
        isRecording = false;
    }
};

// =========================
// STOP MIC
// =========================
document.getElementById("stopBtn").onclick = () => {
    isRecording = false;
    statusEl.innerText = "Status: Tidak merekam";

    if (micStream) {
        micStream.getTracks().forEach(t => t.stop());
    }
};

// =========================
// LOOP ANALISIS AUDIO
// =========================
function draw() {
    if (!isRecording) return;
    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);
    analyser.getByteFrequencyData(fftArray);

    // ===== RMS (AMPLITUDO) =====
    let rms = 0;
    for (let i = 0; i < dataArray.length; i++) {
        const v = (dataArray[i] - 128) / 128;
        rms += v * v;
    }
    rms = Math.sqrt(rms / dataArray.length);

    ampEl.textContent = rms.toFixed(3);
    intensEl.textContent = (rms * rms).toFixed(3);

    // ===== FREKUENSI DOMINAN =====
    let maxAmp = 0;
    let index = 0;
    for (let i = 0; i < fftArray.length; i++) {
        if (fftArray[i] > maxAmp) {
            maxAmp = fftArray[i];
            index = i;
        }
    }

    const freq = index * (audioCtx.sampleRate / 2) / fftArray.length;
    freqEl.textContent = freq.toFixed(1);
    lambdaEl.textContent = (343 / freq).toFixed(3);

    // ===== ANIMASI GETARAN =====
    glass.style.transform = `scale(${1 + rms * 0.25})`;

    // ===== LOGIKA GELAS PECAH =====
    if (Math.abs(freq - targetFreq) < 10 && rms > 0.15) {
        pecahkanGelas();
    }
}

// =========================
// PECAHKAN GELAS
// =========================
function pecahkanGelas() {
    score++;
    scoreEl.textContent = score;

    breakSound.currentTime = 0;
    breakSound.play();

    glass.style.display = "none";
    broken.style.display = "block";

    setTimeout(() => {
        broken.style.display = "none";
        glass.style.display = "block";
    }, 900);
}
