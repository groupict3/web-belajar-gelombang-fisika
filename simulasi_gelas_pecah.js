/* ============================================================
   SIMULASI PECAHKAN GELAS – RESONANSI (750 Hz)
   physics.js (FINAL + SOUND EFFECT)
   ============================================================ */

let audioCtx, analyser, mic, dataArray, fftArray;
let isRecording = false;

let targetFreq = 750;     // frekuensi resonansi baru
let score = 0;

// ★ Tambah audio gelas pecah
const breakSound = new Audio("gelas_pecah.mp3");
breakSound.volume = 0.7;

// -------------------------
// ELEMENT HTML
// -------------------------
const freqEl = document.getElementById("freq");
const ampEl = document.getElementById("amp");
const intensEl = document.getElementById("intens");
const lambdaEl = document.getElementById("lambda");

const glass = document.getElementById("glass");
const broken = document.getElementById("broken");

/* ============================================================
   START RECORDING
   ============================================================ */
document.getElementById("startBtn").onclick = async () => {
    if (isRecording) return;

    isRecording = true;
    document.getElementById("status").innerText = "Status: Merekam...";

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;

    mic = await navigator.mediaDevices.getUserMedia({ audio: true });
    let source = audioCtx.createMediaStreamSource(mic);
    source.connect(analyser);

    dataArray = new Uint8Array(analyser.fftSize);
    fftArray = new Uint8Array(analyser.frequencyBinCount);

    draw();
};

/* ============================================================
   STOP RECORDING
   ============================================================ */
document.getElementById("stopBtn").onclick = () => {
    isRecording = false;
    document.getElementById("status").innerText = "Status: Tidak merekam";

    if (mic) mic.getTracks().forEach(t => t.stop());
};

/* ============================================================
   DRAW
   ============================================================ */
function draw() {
    if (!isRecording) return;
    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);
    analyser.getByteFrequencyData(fftArray);

    // ---- Amplitudo (RMS) ----
    let rms = 0;
    for (let i = 0; i < dataArray.length; i++) {
        let v = (dataArray[i] - 128) / 128;
        rms += v * v;
    }
    rms = Math.sqrt(rms / dataArray.length);

    ampEl.textContent = rms.toFixed(3);
    intensEl.textContent = (rms * rms).toFixed(3);

    // ---- FFT (Peak Frequency) ----
    let maxAmp = 0, index = 0;
    for (let i = 0; i < fftArray.length; i++) {
        if (fftArray[i] > maxAmp) {
            maxAmp = fftArray[i];
            index = i;
        }
    }

    let freq = index * (audioCtx.sampleRate / 2) / fftArray.length;

    freqEl.textContent = freq.toFixed(1);
    lambdaEl.textContent = (343 / freq).toFixed(3);

    // ---- Animasi getaran
    glass.style.transform = `scale(${1 + rms * 0.25})`;

    // ============================================================
    //                 GLASS BREAK CHECK
    // ============================================================
    if (Math.abs(freq - targetFreq) < 10 && rms > 0.15) {

        score++;
        document.getElementById("score").textContent = score;

        // ★ MAININ SUARA
        breakSound.currentTime = 0;  
        breakSound.play();

        // animasi pecah
        glass.style.display = "none";
        broken.style.display = "block";

        setTimeout(() => {
            broken.style.display = "none";
            glass.style.display = "block";
        }, 900);
    }
}