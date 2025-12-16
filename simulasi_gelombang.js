// garpu_tala.js
// Simulasi garpu tala: bunyi (Oscillator), tabel pengamatan (add/delete), grafik sinus (waktu),
// amplitudo mengikuti frekuensi (tidak bisa diubah manual).

(() => {
  // elemen
  const freqRange = document.getElementById('freqRange');
  const freqNumber = document.getElementById('freqNumber');
  const playBtn = document.getElementById('playBtn');
  const stopBtn = document.getElementById('stopBtn');
  const addObs = document.getElementById('addObs');
  const deleteAll = document.getElementById('deleteAll');
  const obsTableBody = document.querySelector('#obsTable tbody');
  const sinusCanvas = document.getElementById('sinusCanvas');
  const toggleGraph = document.getElementById('toggleGraph');
  const currentAmpEl = document.getElementById('currentAmp');

  // audio
  let audioCtx = null;
  let osc = null;
  let analyser = null;

  // drawing
  const ctx = sinusCanvas.getContext('2d');
  let rafId = null;
  let drawPhase = 0;

  // data
  let observations = []; // {time, freq, amp}

  // parameters
  const MAX_F = 1200;
  const MIN_F = 100;
  const BASE_AMP = 0.2; // baseline amplitude scale
  // amplitude will be calculated as function of freq (example): amp = BASE_AMP * (1 + (f - 200)/1000)
  function calcAmpFromFreq(f){
    // choose function that increases moderately with freq, keep in [0.05..0.6]
    const norm = (Math.max(MIN_F, Math.min(MAX_F, f)) - MIN_F) / (MAX_F - MIN_F); // 0..1
    return +(0.07 + norm * 0.48).toFixed(3); // between 0.07 and 0.55
  }

  // sync controls
  function setFreq(v){
    v = Math.round(Number(v));
    freqRange.value = v;
    freqNumber.value = v;
    updateAmpDisplay();
    if(osc) osc.frequency.value = v;
  }
  freqRange.addEventListener('input', (e)=> setFreq(e.target.value));
  freqNumber.addEventListener('change', (e)=> {
    let v = Number(e.target.value);
    if(isNaN(v)) v = 440;
    v = Math.max(MIN_F, Math.min(MAX_F, v));
    setFreq(v);
  });

  function updateAmpDisplay(){
    const amp = calcAmpFromFreq(Number(freqRange.value));
    currentAmpEl.textContent = amp.toFixed(3);
  }
  updateAmpDisplay();

  // play / stop
  function startTone(){
    if(audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    osc = audioCtx.createOscillator();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    osc.type = 'sine';
    osc.frequency.value = Number(freqRange.value);

    // set amplitude by connecting a GainNode whose gain depends on freq
    const gain = audioCtx.createGain();
    const amp = calcAmpFromFreq(Number(freqRange.value));
    gain.gain.value = amp; // NOTE: amplitude follows frequency; user tidak mengubahnya langsung

    osc.connect(gain);
    gain.connect(analyser);
    analyser.connect(audioCtx.destination);

    osc.start();
    playBtn.disabled = true;
    stopBtn.disabled = false;

    // update visualization
    if(!sinusCanvas.classList.contains('hidden')) animate();
  }

  function stopTone(){
    if(!audioCtx) return;
    try {
      osc.stop();
    } catch(e){}
    osc.disconnect();
    analyser.disconnect();
    audioCtx.close();
    audioCtx = null;
    osc = null;
    analyser = null;
    playBtn.disabled = false;
    stopBtn.disabled = true;
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  playBtn.addEventListener('click', startTone);
  stopBtn.addEventListener('click', stopTone);

  // add observation
  function addObservation(){
    const f = Number(freqRange.value);
    const a = calcAmpFromFreq(f);
    const time = new Date().toLocaleTimeString();
    const id = Date.now() + Math.floor(Math.random()*999);
    const row = {id, time, freq: f, amp: a};
    observations.push(row);
    renderTable();
  }
  addObs.addEventListener('click', addObservation);

  // render table
  function renderTable(){
    obsTableBody.innerHTML = '';
    observations.forEach((r, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i+1}</td>
        <td>${r.time}</td>
        <td>${r.freq}</td>
        <td>${r.amp.toFixed(3)}</td>
        <td><button class="muted-btn" data-id="${r.id}">Hapus</button></td>
      `;
      obsTableBody.appendChild(tr);
    });

    // attach delete handlers
    obsTableBody.querySelectorAll('button').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-id');
        observations = observations.filter(x => String(x.id) !== String(id));
        renderTable();
      });
    });
  }

  deleteAll.addEventListener('click', ()=>{
    if(!observations.length) return;
    if(confirm('Hapus semua data pengamatan?')) {
      observations = [];
      renderTable();
    }
  });

  // toggle graph visibility
  toggleGraph.addEventListener('click', ()=>{
    sinusCanvas.classList.toggle('hidden');
    if(!sinusCanvas.classList.contains('hidden')){
      toggleGraph.textContent = 'Sembunyikan Grafik';
      animate();
    } else {
      toggleGraph.textContent = 'Tampilkan Grafik';
      cancelAnimationFrame(rafId);
      rafId = null;
      clearCanvas();
    }
  });

  function clearCanvas(){
    ctx.clearRect(0,0,sinusCanvas.width, sinusCanvas.height);
  }

  // animate sinus (time-domain) — amplitude follows frequency
  function animate(){
    if(!analyser){
      // synthesize sample-only visualization if not playing (simulate sine)
      drawSimulatedSine();
      rafId = requestAnimationFrame(animate);
      return;
    }

    // if playing, use analyser data
    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);

    // draw
    ctx.clearRect(0,0,sinusCanvas.width, sinusCanvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#7af0a0';
    ctx.beginPath();
    const mid = sinusCanvas.height/2;
    const len = buffer.length;
    for(let i=0;i<len;i++){
      const x = (i/len) * sinusCanvas.width;
      const y = mid + buffer[i] * 120; // scale for visibility
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
    rafId = requestAnimationFrame(animate);
  }

  // if osc not active, draw simulated sine with amplitude determined by freq
  function drawSimulatedSine(){
    const f = Number(freqRange.value);
    const amp = calcAmpFromFreq(f);
    const w = sinusCanvas.width;
    const h = sinusCanvas.height;
    clearCanvas();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#39d0ff';
    ctx.beginPath();
    const cycles = (f/100) * 0.5; // rough visual cycles scaling on canvas width
    for(let x=0;x<w;x++){
      const t = x / w * (Math.PI*2*cycles) + drawPhase;
      const y = h/2 + Math.sin(t) * amp * 140; // scale amplitude
      if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
    drawPhase += 0.04 + (f/40000); // animate phase with slight dependence on f
  }

  // responsive canvas sizing
  function resizeCanvas(){
    sinusCanvas.width = Math.min(1200, window.innerWidth - 80);
    sinusCanvas.height = 180;
    clearCanvas();
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // initialize
  setFreq(Number(freqRange.value));
  function setFreq(v){
    freqRange.value = v;
    freqNumber.value = v;
    updateAmp();
  }
  function updateAmp(){
    const amp = calcAmpFromFreq(Number(freqRange.value));
    currentAmpEl.textContent = amp.toFixed(3);
  }
  freqRange.addEventListener('input', ()=> { freqNumber.value = freqRange.value; updateAmp(); });
  freqNumber.addEventListener('change', ()=> { freqRange.value = freqNumber.value; updateAmp(); });

  // helper: when frequency changes while playing, update gain & freq
  // to support that, replace startTone's gain with accessible variable:
  let currentGainNode = null;
  // modify startTone to set currentGainNode
  const originalStartTone = startTone;
  function startTone(){
    if(audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    osc = audioCtx.createOscillator();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    osc.type = 'sine';
    osc.frequency.value = Number(freqRange.value);

    const gain = audioCtx.createGain();
    const amp = calcAmpFromFreq(Number(freqRange.value));
    gain.gain.value = amp;
    currentGainNode = gain;

    osc.connect(gain);
    gain.connect(analyser);
    analyser.connect(audioCtx.destination);

    osc.start();
    playBtn.disabled = true;
    stopBtn.disabled = false;

    if(!sinusCanvas.classList.contains('hidden')) animate();
  }
  // override event binding to use new startTone
  playBtn.removeEventListener && playBtn.removeEventListener('click', startTone);
  playBtn.addEventListener('click', startTone);

  // update gain & freq live
  freqRange.addEventListener('input', ()=>{
    if(osc) osc.frequency.value = Number(freqRange.value);
    if(currentGainNode) currentGainNode.gain.value = calcAmpFromFreq(Number(freqRange.value));
    updateAmp();
  });

  // small UX: confirm when leaving page if audio playing
  window.addEventListener('beforeunload', (e)=>{
    if(audioCtx){
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // expose for debug (optional)
  window._garpu = { observations, addObservation };
})();
