// =======================================================
// AUDIO SETUP
// =======================================================
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Fungsi main bunyi (1 suara saja)
function playTuningFork(freq) {
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();

    osc.frequency.value = freq;
    osc.type = "sine";

    gain.gain.value = 0.6;
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.3);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.3);
}

// =======================================================
// ELEMENT
// =======================================================
let f1 = document.getElementById("f1");
let f2 = document.getElementById("f2");
let fork1 = document.getElementById("fork1");
let fork2 = document.getElementById("fork2");
let resText = document.getElementById("resText");


// =======================================================
// CEK RESONANSI
// =======================================================
function cekResonansi() {
    let freq1 = parseFloat(f1.value);
    let freq2 = parseFloat(f2.value);

    if (Math.abs(freq1 - 680) < 5 && Math.abs(freq2 - 680) < 5) {
        resText.textContent = "✔ Resonansi! Kedua garpu bergetar kuat di 680 Hz";
        resText.style.color = "#7aff8c";
    } else {
        resText.textContent = "Belum resonansi";
        resText.style.color = "#ffffff";
    }
}

f1.oninput = cekResonansi;
f2.oninput = cekResonansi;


// =======================================================
// TOMBOL BUNYIKAN
// =======================================================
document.getElementById("playBtn").onclick = () => {
    let freqMain = (parseFloat(f1.value) + parseFloat(f2.value)) / 2;

    // animasi getar
    fork1.style.transform = "scale(1.1)";
    fork2.style.transform = "scale(1.1)";
    setTimeout(() => {
        fork1.style.transform = "scale(1)";
        fork2.style.transform = "scale(1)";
    }, 300);

    playTuningFork(freqMain);
    cekResonansi();
};
