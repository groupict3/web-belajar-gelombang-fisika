/* ==========================
   BACKSOUND CONTROL
========================== */

const bgm = document.getElementById("bgm");
const bgmToggle = document.getElementById("bgmToggle");
let bgmOn = false;

bgm.volume = 0.35;

bgmToggle.onclick = () => {
  bgmOn = !bgmOn;
  if(bgmOn){
    bgm.play().catch(()=>{});
    bgmToggle.textContent = "🔊 Backsound: ON";
  } else {
    bgm.pause();
    bgmToggle.textContent = "🔇 Backsound: OFF";
  }
};


/* ==========================
   NAVIGATION
========================== */

document.getElementById("backSim").onclick = () => {
  window.location.href = "menu.html";
};
document.getElementById("toSimResult").onclick = () => {
  window.location.href = "menu.html";
};


/* ==========================
   QUIZ DATA (15 soal)
========================== */

const quiz = [
  {
    soal: "Berikut ini merupakan pernyataan yang benar mengenai bunyi, kecuali .....",
    opsi: [
      "Bunyi merupakan gelombang longitudinal",
      "Bunyi merupakan gelombang mekanik",
      "Dapat merambat melalui zat cair",
      "Tidak dapat merambat dalam vakum",
      "Mengalami polarisasi"
    ],
    jawaban: 4,
    pemb: "Bunyi tidak mengalami polarisasi karena polarisasi hanya terjadi pada gelombang transversal, sedangkan bunyi adalah gelombang longitudinal."
  },

  {
    soal: "Pada malam hari bunyi petir terdengar lebih keras daripada siang hari, hal ini terjadi karena …",
    opsi: [
      "Pemantulan gelombang bunyi",
      "Pembiasan gelombang bunyi",
      "Pelenturan gelombang bunyi",
      "Pelayangan gelombang bunyi",
      "Perpaduan gelombang bunyi"
    ],
    jawaban: 1,
    pemb: "Perbedaan suhu udara malam hari menyebabkan pembiasan bunyi ke arah bawah sehingga terdengar lebih keras."
  },

  {
    soal: "Perbedaan antara gema dan gaung terletak pada …",
    opsi: [
      "Jarak sumber suara dengan penghalang",
      "Jarak sumber suara dengan pendengar",
      "Kelengkapan kata yang terdengar",
      "Amplitudo dan frekuensinya",
      "Kecepatan perpaduan suara"
    ],
    jawaban: 0,
    pemb: "Perbedaan gema dan gaung ditentukan oleh jarak sumber bunyi dengan penghalang."
  },

  {
    soal: "Sifat gelombang ultrasonik yang digunakan dalam pemeriksaan USG adalah …",
    opsi: [
      "Interferensi",
      "Polarisasi",
      "Refleksi",
      "Refraksi",
      "Difraksi"
    ],
    jawaban: 2,
    pemb: "USG memanfaatkan pemantulan (refleksi) gelombang ultrasonik dari jaringan tubuh."
  },

  {
    soal: "Frekuensi suara 60.000 Hz tergolong bunyi …",
    opsi: [
      "Infrasonik",
      "Megasonik",
      "Audiosonik",
      "Ultrasonik",
      "Terasonik"
    ],
    jawaban: 3,
    pemb: "Bunyi dengan frekuensi di atas 20.000 Hz disebut ultrasonik."
  },

  {
    soal: "Cepat rambat bunyi dalam zat cair bertambah besar jika …",
    opsi: [
      "Modulus Bulk diperbesar dan massa jenis diperkecil",
      "Massa jenis diperbesar dan modulus Bulk diperkecil",
      "Modulus Bulk dan massa jenis diperbesar",
      "Modulus Bulk dan massa jenis diperkecil",
      "Modulus Bulk diperkecil dan massa jenis tetap"
    ],
    jawaban: 0,
    pemb: "v = √(K/ρ). Agar cepat rambat besar, K besar dan ρ kecil."
  },

  {
    soal: `
Sebuah gelombang berjalan dengan persamaan
y = 0,02 sin π(50t + x) cm.

Pernyataan yang benar adalah:
(1) Frekuensi gelombang 25 Hz
(2) Panjang gelombang 2 m
(3) Cepat rambat gelombang 50 m/s
(4) Dua titik berjarak 50 m sefase
  `,  
  opsi: [
    "(1), (2), dan (3)",
    "(1) dan (4)",
    "(2) dan (3)",
    "(1), (2), dan (4)",
    "Semua benar"
  ],

  jawaban: 4,

  pemb: `Dari persamaan gelombang diperoleh ω = 50π sehingga frekuensi f = 25 Hz.
Nilai k = π menghasilkan panjang gelombang λ = 2 m.
Cepat rambat gelombang v = fλ = 50 m/s.
Dua titik berjarak 50 m sefase karena memenuhi syarat Δx = nλ.
Maka semua pernyataan benar.`
},


{
    soal: "Dua pipa organa terbuka, pipa A dan pipa B ditiup secara bersamaan. Ternyata suara nada dasar pipa organa A sama dengan pipa organa B. Maka, pernyataan berikut yang benar adalah.....",
    opsi: [
      "Panjang pipa organa A sama dengan pipa organa B",
      "Panjang pipa A dua kali pipa B",
      "Panjang pipa B dua kali pipa A",
      "Panjang pipa A tiga kali pipa B",
      "Panjang pipa B tiga kali pipa A"
    ],
    jawaban: 0,
    pemb: "Nada dasar pipa terbuka f = v/(2L). Jika frekuensi sama, maka panjang pipa sama."
  },

  {
    soal: "Seutas dawai mempunyai panjang 90 cm menghasilkan nada dasar sebesar 50 Hz. Berapa panjang gelombang dawai yang dihasilkan …",
    opsi: [
      "1,6 m",
      "1,8 m",
      "2,0 m",
      "2,2 m",
      "2,4 m"
    ],
    jawaban: 1,
    pemb: "Untuk dawai: λ = 2L = 2 × 0,9 = 1,8 m."
  },

  {
    soal: "Taraf intensitas percakapan antara Anna dan Elsa di dalam suatu ruangan. adalah 35 dB. Jika terdapat 20 orang lainnya sedang bercakap-cakap di ruangan yang sama, taraf intensitas yang dihasilkan menjadi....",
    opsi: [
      "30 dB",
      "35 dB",
      "40 dB",
      "45 dB",
      "50 dB"
    ],
    jawaban: 3,
    pemb:`"Untuk banyak sumber tak berkorelasi (bicara terpisah), level total bertambah menurut faktor dibanding level satu sumber.

Diberi: tingkat suara gabungan 2 orang (Anna + Elsa) = L₂ = 35 dB.
L₂ = L₁ + 10 log₁₀(2)
L₁ = 35 − 3,01 = 31,99 dB

Jumlah orang = 22
L₂₂ = L₁ + 10 log₁₀(22)
L₂₂ ≈ 45,4 dB`
  },

  {
    soal: "Gelombang transversal merambat dari A ke B dengan cepat rambat 12 m/s pada frekuensi 4 Hz dan amplitudo 5 cm. Jika jarak AB = 18m maka banyaknya gelombang yang terjadi sepanjang AB adalah...",
    opsi: ["9", "8", "7", "6", "5"],
    jawaban: 3,
    pemb: "t = s/v = 18/12 = 1,5 s → n = f × t = 4 × 1,5 = 6."
  },

  {
    soal: "Berikut ini adalah persamaan simpangan gelombang berjalan: y = 10 sinn (0,4t – 0,5x). Periode gelombangnya adalah...",
    opsi: ["10 s", "5 s", "4 s", "0,4 s", "0,2 s"],
    jawaban: 1,
    pemb: "ω = 0,4π → T = 2π/ω = 5 s."
  },

  {
    soal: "Astronot berkomunikasi di luar angkasa menggunakan …",
    opsi: [
      "Gelombang bunyi",
      "Gelombang mekanik",
      "Gelombang elektromagnetik",
      "Gelombang ultrasonik",
      "Getaran udara"
    ],
    jawaban: 2,
    pemb: "Gelombang elektromagnetik dapat merambat di ruang hampa."
  },

  {
    soal: "Perbedaan bunyi siang dan malam hari adalah …",
    opsi: [
      "Bunyi lebih cepat malam karena angin",
      "Bunyi lebih jauh malam karena suhu lebih rendah",
      "Bunyi lebih jauh siang karena panas",
      "Tidak ada perbedaan",
      "Bunyi lebih pelan malam hari"
    ],
    jawaban: 1,
    pemb: "Suhu udara malam lebih rendah menyebabkan bunyi dibiaskan ke bawah dan terdengar lebih jauh."
  },

  {
    soal: "Agar frekuensi senar menjadi dua kali, maka panjang senar harus …",
    opsi: [
      "Dibuat dua kali lebih panjang",
      "Dibuat setengah dari semula",
      "Tegangannya diperbesar dua kali",
      "Tegangannya diperkecil",
      "Dibiarkan tetap"
    ],
    jawaban: 1,
    pemb: "Frekuensi senar berbanding terbalik dengan panjang (f ∝ 1/L)."
  }
];

/* ==========================
   QUIZ ENGINE
========================== */

let nomor = 0;
let score = 0;

const numberEl = document.getElementById("number");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const explainEl = document.getElementById("explain");
const nextBtn = document.getElementById("nextBtn");

function renderSoal(){
  const q = quiz[nomor];

  numberEl.textContent = `Soal ${nomor+1} / ${quiz.length}`;
  questionEl.textContent = q.soal;

  choicesEl.innerHTML = "";
  explainEl.style.display = "none";
  nextBtn.style.display = "none";

  q.opsi.forEach((ops, i)=>{
    const btn = document.createElement("div");
    btn.className = "choice";
    btn.textContent = ops;

    btn.onclick = () => pilih(i, btn);

    choicesEl.appendChild(btn);
  });
}

renderSoal();

function pilih(i, ele){
  const benar = quiz[nomor].jawaban;

  if(i === benar){
    ele.classList.add("correct");
    score++;
    confetti({particleCount:70, spread:70});
  } else {
    ele.classList.add("wrong");
  }

  explainEl.style.display = "block";
  explainEl.textContent = quiz[nomor].pemb;

  Array.from(document.getElementsByClassName("choice")).forEach(c => c.onclick = null);

  nextBtn.style.display = "inline-block";
}

nextBtn.onclick = () => {
  nomor++;
  if(nomor >= quiz.length){
    selesai();
  } else {
    renderSoal();
  }
};


/* ==========================
   RESULT
========================== */

function selesai(){
  const nilai = Math.round((score / quiz.length) * 100);

  document.getElementById("quizCard").style.display = "none";
  document.getElementById("resultBox").style.display = "block";
  document.getElementById("scoreVal").textContent =
    `Jawaban Benar: ${score} / ${quiz.length} | Skor: ${nilai}`;
}
