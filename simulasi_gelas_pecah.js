/* ============================================================
   SIMULASI PECAHKAN GELAS – RESONANSI (750 Hz)
   ============================================================ */

function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

let audioCtx, analyser, mic, dataArray, fftArray;
let isRecording = false;
let targetFreq = 750;
let score = 0;

const breakSound = new Audio("gelas_pecah.mp3");
breakSound.volume = 0.7;

// ELEMENT
const freqEl = document.getElementById("freq");
const ampEl = document.getElementById("amp");
const intensEl = document.getElementById("intens");
const lambdaEl = document.getElementById("lambda");
const glass = document.getElementById("glass");
const broken = document.getElementById("broken");
const statusEl = document.getElementById("status");
const scoreEl = document.getElementById("score");

// ============================================================
// START
// ============================================================
document.getElementById("startBtn").onclick = async () => {
    if (isRecording) return;

    if (isMobile()) {
        statusEl.innerText = "Mode HP: Input Manual (tanpa mikrofon)";
        aktifkanModeManual();
        return;
    }

    try {
        isRecording = true;
        statusEl.innerText = "Status: Merekam...";

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;

        mic = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioCtx.createMediaStreamSource(mic);
        source.connect(analyser);

        dataArray = new Uint8Array(analyser.fftSize);
        fftArray = new Uint8Array(analyser.frequencyBinCount);

        draw();
    } catch {
        alert("Mikrofon tidak bisa diakses");
    }
};

// ============================================================
// STOP
// ============================================================
document.getElementById("stopBtn").onclick = () => {
    isRecording = false;
    statusEl.innerText = "Status: Tidak merekam";
    if (mic) mic.getTracks().forEach(t => t.stop());
};

// ============================================================
// DRAW (MIC)
// ============================================================
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

    let maxAmp = 0, index = 0;
    for (let i = 0; i < fftArray.length; i++) {
        if (fftArray[i] > maxAmp) {
            maxAmp = fftArray[i];
            index = i;
        }
    }

    let freq = index * (audioCtx.sampleRate / 2) / fftArray.length;
    tampilkanData(freq, rms);
    cekPecah(freq, rms);
}

// ============================================================
// MODE MANUAL (HP)
// ============================================================
function aktifkanModeManual() {
    document.getElementById("manualControl").style.display = "block";

    document.getElementById("freqSlider").addEventListener("input", (e) => {
        let freq = Number(e.target.value);
        let rms = (freq > 730 && freq < 770) ? 0.18 : 0.08;
        tampilkanData(freq, rms);
        cekPecah(freq, rms);
    });
}

// ============================================================
// TAMPILKAN DATA
// ============================================================
function tampilkanData(freq, rms) {
    freqEl.textContent = freq.toFixed(1);
    ampEl.textContent = rms.toFixed(3);
    intensEl.textContent = (rms * rms).toFixed(3);
    lambdaEl.textContent = (343 / freq).toFixed(3);
    glass.style.transform = `scale(${1 + rms * 0.25})`;
}

// ============================================================
// CEK PECAH
// ============================================================
function cekPecah(freq, rms) {
    if (Math.abs(freq - targetFreq) < 10 && rms > 0.15) {
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
}
