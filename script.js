(() => {
  const C = typeof CONFIG !== "undefined" ? CONFIG : {};
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const fill = (t) => String(t || "").replaceAll("{nama}", C.nama || "");
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- isi teks dari config ---------- */
  $$("[data-nama]").forEach((el) => (el.textContent = C.nama || ""));
  $$("[data-dari]").forEach((el) => (el.textContent = C.dari || ""));
  $("#pembuka").textContent = fill(C.pembuka);
  $("#wishJudul").textContent = fill(C.wishJudul);
  $("#wishPetunjuk").textContent = fill(C.wishPetunjuk);
  $("#wishDone").textContent = fill(C.wishSelesai);
  $("#penutup").textContent = fill(C.penutup);
  if (C.umur) { $("#ageLine").textContent = `Selamat ${C.umur} tahun 💙`; $("#ageLine").hidden = false; }
  $("#letterBody").innerHTML = (C.surat || []).map((p) => `<p>${esc(fill(p))}</p>`).join("");

  /* ---------- latar: ilustrasi & hati ---------- */
  const sky = $(".sky");
  const backgroundStickers = [
    "assets/background/sticker-1.png",
    "assets/background/sticker-2.png",
    "assets/background/sticker-3.png",
    "assets/background/sticker-4.png",
    "assets/background/sticker-5.png"
  ];
  function spawn() {
    const heart = Math.random() < 0.45;
    const el = document.createElement(heart ? "span" : "img");
    el.className = "float " + (heart ? "heart" : "character");
    if (!heart) {
      el.src = backgroundStickers[Math.floor(Math.random() * backgroundStickers.length)];
      el.alt = "";
      el.style.width = 64 + Math.random() * 56 + "px";
    }
    if (heart) { el.textContent = "♥"; el.style.fontSize = 14 + Math.random() * 18 + "px"; }
    el.style.left = Math.random() * 100 + "vw";
    el.style.setProperty("--dx", (Math.random() * 80 - 40) + "px");
    el.style.animationDuration = 9 + Math.random() * 8 + "s";
    sky.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
  for (let i = 0; i < 6; i++) setTimeout(spawn, i * 400);
  setInterval(spawn, 1100);

  /* ---------- navigasi scene ---------- */
  function go(id) {
    $$(".scene").forEach((s) => s.classList.remove("active"));
    const next = document.getElementById(id);
    next.classList.add("active");
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    if (id === "s-letter") revealLetter();
    if (id === "s-end") setTimeout(() => confetti(140, ["#ffffff", "#a9cdf5", "#ffd9e6"]), 300);
  }
  $$("[data-next]").forEach((b) => b.addEventListener("click", () => go(b.dataset.next)));

  /* ---------- musik ---------- */
  const audio = $("#bgm");
  const musicBtn = $("#musicBtn");
  let musicOk = false;
  if (C.musik) {
    audio.src = C.musik;
    audio.addEventListener("canplay", () => { musicOk = true; });
    audio.addEventListener("error", () => { musicOk = false; musicBtn.hidden = true; });
  }
  function startMusic() {
    if (!C.musik) return;
    audio.volume = 0.0;
    audio.currentTime = 6;
    audio.play().then(() => {
      musicBtn.hidden = false; musicBtn.classList.add("playing");
      let v = 0; const t = setInterval(() => { v = Math.min(0.7, v + 0.05); audio.volume = v; if (v >= 0.7) clearInterval(t); }, 150);
    }).catch(() => {});
  }
  musicBtn.addEventListener("click", () => {
    if (audio.paused) { audio.play(); musicBtn.classList.add("playing"); musicBtn.classList.remove("muted"); }
    else { audio.pause(); musicBtn.classList.remove("playing"); musicBtn.classList.add("muted"); }
  });

  /* ---------- 1. amplop ---------- */
  const env = $("#envelope");
  env.addEventListener("click", () => {
    if (env.classList.contains("open")) return;
    env.classList.add("open");
    startMusic();
    setTimeout(() => go("s-letter"), 1500);
  }, { once: false });

  /* ---------- 2. surat ---------- */
  let letterShown = false;
  function revealLetter() {
    if (letterShown) return; letterShown = true;
    const ps = $$("#letterBody p");
    ps.forEach((p, i) => setTimeout(() => p.classList.add("show"), 400 + i * 900));
    const end = 400 + ps.length * 900;
    setTimeout(() => $(".paper .sign").classList.add("show"), end);
    setTimeout(() => $("#s-letter .btn").classList.add("show"), end + 500);
  }

  /* ---------- 3. make a wish (tahan tombol) ---------- */
  const HOLD_MS = 3500;
  const CIRC = 2 * Math.PI * 54;
  const holdBtn = $("#holdBtn"), ring = $("#ringFg"), holdLabel = $("#holdLabel");
  ring.style.strokeDasharray = CIRC;
  ring.style.strokeDashoffset = CIRC;
  let holdStart = 0, raf = 0, wished = false, progress = 0;

  function setRing(p) { ring.style.strokeDashoffset = CIRC * (1 - p); }
  function tick(now) {
    progress = Math.min(1, (now - holdStart) / HOLD_MS);
    setRing(progress);
    holdLabel.textContent = progress < 0.35 ? "Terus tahan…" : progress < 0.75 ? "Sedikit lagi…" : "Hampir…";
    if (progress >= 1) return finishWish();
    raf = requestAnimationFrame(tick);
  }
  function startHold(e) {
    if (wished) return;
    e.preventDefault();
    holdBtn.setPointerCapture?.(e.pointerId);
    holdBtn.classList.add("holding");
    holdStart = performance.now(); // mulai dari 0 setiap kali ditahan
    progress = 0;
    navigator.vibrate?.(20);
    raf = requestAnimationFrame(tick);
  }
  function stopHold() {
    if (wished) return;
    cancelAnimationFrame(raf);
    holdBtn.classList.remove("holding");
    if (progress < 1) {
      holdLabel.textContent = progress > 0.05 ? "Yah, lepas. Tahan lagi" : "Tahan";
      // ring kembali pelan-pelan
      const from = progress, t0 = performance.now();
      const back = (n) => { const k = Math.min(1, (n - t0) / 400); setRing(from * (1 - k)); if (k < 1 && !holdBtn.classList.contains("holding")) requestAnimationFrame(back); };
      requestAnimationFrame(back);
      progress = 0;
    }
  }
  function finishWish() {
    wished = true;
    holdBtn.classList.remove("holding");
    $(".hold-wrap").classList.add("done");
    holdLabel.textContent = "Terkirim";
    navigator.vibrate?.([60, 40, 120]);
    const r = holdBtn.getBoundingClientRect();
    stars(r.left + r.width / 2, r.top + r.height / 2);
    $("#wishDone").hidden = false;
    setTimeout(() => ($("#wishNext").hidden = false), 900);
  }
  holdBtn.addEventListener("pointerdown", startHold);
  ["pointerup", "pointercancel", "pointerleave"].forEach((ev) => holdBtn.addEventListener(ev, stopHold));
  holdBtn.addEventListener("contextmenu", (e) => e.preventDefault());

  /* ---------- 4. kue & lilin ---------- */
  const candlesEl = $("#candles");
  const N = 3;
  for (let i = 0; i < N; i++) {
    const c = document.createElement("div");
    c.className = "candle";
    c.innerHTML = '<span class="flame"></span>';
    c.addEventListener("click", () => blow(c));
    candlesEl.appendChild(c);
  }
  let blownAll = false;
  function blow(c) {
    if (c.classList.contains("out")) return;
    c.classList.add("out");
    const s = document.createElement("span"); s.className = "smoke"; c.appendChild(s);
    if ([...$$(".candle")].every((x) => x.classList.contains("out"))) celebrate();
  }
  function celebrate() {
    if (blownAll) return; blownAll = true;
    stopMic();
    $("#cakeHint").hidden = true; $(".cake-actions").hidden = true;
    navigator.vibrate?.([80, 50, 80]);
    setTimeout(() => {
      confetti(260);
      $("#hbd").hidden = false;
      setTimeout(() => confetti(160), 900);
    }, 500);
  }

  // tiup lewat mikrofon
  let micStream, micCtx, micRaf;
  const micBtn = $("#micBtn");
  micBtn.addEventListener("click", async () => {
    if (micStream) return stopMic();
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } });
      micCtx = new (window.AudioContext || window.webkitAudioContext)();
      const src = micCtx.createMediaStreamSource(micStream);
      const an = micCtx.createAnalyser(); an.fftSize = 512; src.connect(an);
      const buf = new Uint8Array(an.fftSize);
      micBtn.textContent = "🌬️ Tiup sekarang…"; micBtn.classList.add("listening");
      let loud = 0;
      const loop = () => {
        an.getByteTimeDomainData(buf);
        let sum = 0; for (const v of buf) { const d = (v - 128) / 128; sum += d * d; }
        const rms = Math.sqrt(sum / buf.length);
        $("#cake").classList.toggle("wobble", rms > 0.08);
        loud = rms > 0.14 ? loud + 1 : Math.max(0, loud - 1);
        if (loud > 8) {
          loud = 0;
          const lit = [...$$(".candle:not(.out)")];
          if (lit.length) blow(lit[0]);
        }
        micRaf = requestAnimationFrame(loop);
      };
      loop();
    } catch (err) {
      micBtn.textContent = "Mic tidak tersedia, ketuk lilinnya ya";
      micBtn.disabled = true;
    }
  });
  function stopMic() {
    cancelAnimationFrame(micRaf);
    micStream?.getTracks().forEach((t) => t.stop());
    micCtx?.close?.();
    micStream = null;
    $("#cake").classList.remove("wobble");
  }

  /* ---------- 5. galeri ---------- */
  const track = $("#track"), dots = $("#dots");
  const photos = C.foto || [];
  photos.forEach((f, i) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.innerHTML = `<figure class="polaroid" style="--r:${i % 2 ? 1.5 : -1.5}deg">
        <div class="img"><img alt="" loading="lazy"></div>
        <figcaption>${esc(fill(f.caption || ""))}</figcaption></figure>`;
    const img = slide.querySelector("img");
    img.onerror = () => { img.parentElement.innerHTML = `<div class="ph">Foto belum ada:<br>${esc(f.file)}</div>`; };
    img.src = f.file;
    track.appendChild(slide);
    const d = document.createElement("button");
    d.setAttribute("aria-label", "Foto " + (i + 1));
    d.addEventListener("click", () => show(i));
    dots.appendChild(d);
  });
  let cur = 0, timer;
  function show(i) {
    if (!photos.length) return;
    cur = (i + photos.length) % photos.length;
    track.style.transform = `translateX(${-cur * 100}%)`;
    [...dots.children].forEach((d, k) => d.classList.toggle("on", k === cur));
    clearInterval(timer); timer = setInterval(() => show(cur + 1), 4500);
  }
  show(0);
  let sx = null;
  const gal = $("#gallery");
  gal.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  gal.addEventListener("touchend", (e) => {
    if (sx == null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    sx = null;
  });
  gal.addEventListener("click", (e) => { const r = gal.getBoundingClientRect(); show(cur + (e.clientX > r.left + r.width / 2 ? 1 : -1)); });

  /* ---------- 6. ulangi ---------- */
  $("#replay").addEventListener("click", () => location.reload());

  /* ---------- confetti & bintang (canvas) ---------- */
  const cv = $("#confetti"), ctx = cv.getContext("2d");
  let parts = [], animating = false;
  function resize() { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); }
  resize(); addEventListener("resize", resize);
  const PALETTE = ["#a9cdf5", "#7fb2e8", "#ffffff", "#ffd9e6", "#cdd6ff", "#ffe9a8"];
  function confetti(n, colors = PALETTE) {
    for (let i = 0; i < n; i++) {
      parts.push({
        x: innerWidth / 2 + (Math.random() - 0.5) * innerWidth * 0.3, y: innerHeight * 0.35,
        vx: (Math.random() - 0.5) * 12, vy: -Math.random() * 13 - 4,
        w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
        c: colors[(Math.random() * colors.length) | 0], life: 1, shape: Math.random() < 0.25 ? "heart" : "rect",
      });
    }
    run();
  }
  function stars(x, y) {
    for (let i = 0; i < 60; i++) {
      const a = Math.random() * Math.PI * 2, s = 2 + Math.random() * 7;
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2, w: 10, h: 10, r: 0, vr: 0.1,
        c: ["#ffe9a8", "#ffffff", "#ffd9e6", "#a9cdf5"][i % 4], life: 1, shape: "star", g: 0.05 });
    }
    run();
  }
  function drawHeart(s) { ctx.beginPath(); ctx.moveTo(0, s * 0.3); ctx.bezierCurveTo(0, 0, -s * 0.5, 0, -s * 0.5, s * 0.3); ctx.bezierCurveTo(-s * 0.5, s * 0.6, 0, s * 0.8, 0, s); ctx.bezierCurveTo(0, s * 0.8, s * 0.5, s * 0.6, s * 0.5, s * 0.3); ctx.bezierCurveTo(s * 0.5, 0, 0, 0, 0, s * 0.3); ctx.fill(); }
  function drawStar(s) { ctx.beginPath(); for (let i = 0; i < 10; i++) { const rr = i % 2 ? s * 0.4 : s; const a = (i * Math.PI) / 5; ctx.lineTo(Math.sin(a) * rr, -Math.cos(a) * rr); } ctx.closePath(); ctx.fill(); }
  function run() {
    if (animating) return; animating = true;
    const step = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
      for (const p of parts) {
        p.vy += p.g ?? 0.28; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        if (p.shape === "star") p.life -= 0.012; else if (p.vy > 0) p.life -= 0.004;
        ctx.save(); ctx.globalAlpha = Math.max(0, p.life); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
        if (p.c === "#ffffff") { ctx.shadowColor = "rgba(93,147,207,.5)"; ctx.shadowBlur = 3; }
        if (p.shape === "heart") drawHeart(p.w * 1.4);
        else if (p.shape === "star") drawStar(p.w * 0.7);
        else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (parts.length) requestAnimationFrame(step); else { animating = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
    };
    requestAnimationFrame(step);
  }
})();
