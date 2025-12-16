/* ============================================================
   SIMULASI PECAHKAN GELAS – MOBILE SAFE
   ============================================================ */

let audioCtx, analyser, micStream;
let dataArray, fftArray;
let isRecording = false;

const targetFreq = 750;
let score = 0;

let breakSound = null;

// =========================
// ELEMENT
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
// START BUTTON (GESTURE)
// =========================
document.getElementById("startBtn").addEventListener("click", async () => {
    if (isRecording) return;

    try {
        statusEl.innerText = "Meminta izin mikrofon...";
        isRecording = true;

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        await audioCtx.resume(); // 🔥 WAJIB HP

        // 🔥 BUAT AUDIO SETELAH KLIK
        breakSound = new Audio("gelas_pecah.mp3");
        breakSound.volume = 0.7;

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

        statusEl.innerText = "Merekam (Mic Aktif)";
        draw();

    } catch (err) {
        console.error(err);
        alert("Mikrofon diblokir browser.\nCoba Firefox Android.");
        isRecording = false;
    }
});

// =========================
// STOP
// =========================
document.getElementById("stopBtn").addEventListener("click", () => {
    isRecording = false;
    statusEl.innerText = "Tidak merekam";

    if (micStream) micStream.getTracks().forEach(t => t.stop());
});

// =========================
// LOOP
// =========================
function draw() {
    if (!isRecording) return;
    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);
    analyser.getByteFrequencyData(fftArray);

    let rms = 0;
    for (let i = 0; i < dataArray.length; i++) {
        let v = (dataArray[i] - 128) / 128;
        rms += v * v;
    }
    rms = Math.sqrt(rms / dataArray.length);

    ampEl.textContent = rms.toFixed(3);
    intensEl.textContent = (rms * rms).toFixed(3);

    let max = 0, idx = 0;
    for (let i = 0; i < fftArray.length; i++) {
        if (fftArray[i] > max) {
            max = fftArray[i];
            idx = i;
        }
    }

    const freq = idx * (audioCtx.sampleRate / 2) / fftArray.length;
    freqEl.textContent = freq.toFixed(1);
    lambdaEl.textContent = (343 / freq).toFixed(3);

    glass.style.transform = `scale(${1 + rms * 0.25})`;

    if (Math.abs(freq - targetFreq) < 10 && rms > 0.15) {
        pecah();
    }
}

// =========================
// PECAH
// =========================
function pecah() {
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
