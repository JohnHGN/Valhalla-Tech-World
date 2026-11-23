(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const root = $("valhallaPlayer");
  if (!root) return;

  const audio = $("audioElement");
  const seek = $("seekBar");
  const volumeBar = $("volumeBar");
  const canvas = $("equalizer");
  const ctx = canvas ? canvas.getContext("2d") : null;

  let playlist = [];
  let index = -1;
  let repeat = false;
  let sleepTimer = null;
  let sleepMinutes = 0;
  let lastVolume = 0.85;
  let audioCtx = null;
  let analyser = null;
  let bins = null;
  let raf = 0;
  let msgTimer = 0;

  const fmt = (n) => {
    if (!Number.isFinite(n) || n < 0) return "00:00";
    n = Math.floor(n);
    return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
  };

  function setRangeFill(inputEl, ratio) {
    if (!inputEl) return;
    const pct = Math.max(0, Math.min(100, ratio * 100));
    inputEl.style.setProperty("--progress", `${pct}%`);
  }

  function notify(text) {
    const el = $("playerMessage");
    if (!el) return;
    el.textContent = text;
    el.classList.add("show");
    clearTimeout(msgTimer);
    msgTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  function setPodcastLogo(src) {
    const img = $("podcastLogo");
    const placeholder = $("coverPlaceholder");
    if (!img) return;

    const path = src || "";
    img.hidden = true;
    img.removeAttribute("src");
    if (placeholder) placeholder.hidden = false;

    if (!path) return;

    img.onload = () => {
      img.hidden = false;
      if (placeholder) placeholder.hidden = true;
    };
    img.onerror = () => {
      img.hidden = true;
      img.removeAttribute("src");
      if (placeholder) placeholder.hidden = false;
    };
    img.src = path;
  }

  function renderPodcastMenu() {
    const list = $("podcastList");
    const countEl = $("podcastCount");
    if (countEl) {
      countEl.textContent = `${playlist.length.toLocaleString("fa-IR")} اپیزود`;
    }
    if (!list) return;

    list.replaceChildren();
    if (!playlist.length) {
      const empty = document.createElement("p");
      empty.className = "vp-list-empty";
      empty.textContent = "هنوز پادکستی به فهرست اضافه نشده است.";
      list.appendChild(empty);
      return;
    }

    playlist.forEach((item, i) => {
      const current = i === index;
      const playing = current && !audio.paused && !audio.ended && !!audio.src;

      const row = document.createElement("div");
      row.className = "vp-list-item" + (current ? " is-current" : "");
      row.dataset.playIndex = String(i);

      const info = document.createElement("div");
      info.className = "vp-list-info";

      const num = document.createElement("span");
      num.className = "vp-list-num";
      num.textContent = String(i + 1).padStart(2, "0");
      info.appendChild(num);

      if (item.cover) {
        const thumb = document.createElement("img");
        thumb.className = "vp-list-thumb";
        thumb.src = item.cover;
        thumb.alt = "";
        thumb.onerror = () => thumb.remove();
        info.appendChild(thumb);
      }

      const title = document.createElement("span");
      title.className = "vp-list-title";
      title.textContent = item.title;
      info.appendChild(title);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "vp-list-play";
      button.dataset.playIndex = String(i);
      button.textContent = playing ? "در حال پخش" : current ? "متوقف" : "پخش";
      button.setAttribute("aria-label", `${button.textContent}: ${item.title}`);

      row.append(info, button);
      list.appendChild(row);
    });
  }

  function state() {
    const playing = !audio.paused && !audio.ended && !!audio.src;
    $("playSymbol")?.classList.toggle("is-playing", playing);
    $("playButton")?.setAttribute("aria-label", playing ? "توقف موقت" : "پخش");
    const statusText = $("statusText");
    if (statusText) statusText.textContent = playing ? "در حال پخش" : "متوقف";
    $("statusButton")?.classList.toggle("is-playing", playing);
    renderPodcastMenu();
  }

  function setupAudioGraph() {
    if (audioCtx) {
      if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      audioCtx = new AC();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.82;
      bins = new Uint8Array(analyser.frequencyBinCount);
      audioCtx.createMediaElementSource(audio).connect(analyser);
      analyser.connect(audioCtx.destination);
      audioCtx.resume().catch(() => {});
    } catch {
      audioCtx = null;
      analyser = null;
    }
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, rect.width * dpr);
    canvas.height = Math.max(1, rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawEqualizer() {
    if (canvas && ctx) {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w && h) {
        ctx.clearRect(0, 0, w, h);
        const isPlaying = Boolean(analyser && !audio.paused && !audio.ended);
        if (isPlaying) analyser.getByteFrequencyData(bins);

        const count = 32;
        const gap = 3;
        const bw = Math.max(2, (w - gap * (count - 1)) / count);

        for (let i = 0; i < count; i++) {
          const val = isPlaying
            ? bins[Math.min(bins.length - 1, Math.floor((i / count) * bins.length))] / 255
            : 0.12 + Math.sin(i * 0.6) * 0.04;

          const bh = Math.max(4, val * (h - 4));
          const x = i * (bw + gap);
          const y = h - bh;

          if (isPlaying) {
            const grad = ctx.createLinearGradient(0, y, 0, h);
            grad.addColorStop(0, "#fda4af");
            grad.addColorStop(0.45, "#e11d48");
            grad.addColorStop(1, "#9f1239");
            ctx.fillStyle = grad;
          } else {
            ctx.fillStyle = "#2b2b34";
          }

          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x, y, bw, bh, Math.min(2, bw / 2));
          } else {
            ctx.rect(x, y, bw, bh);
          }
          ctx.fill();
        }
      }
    }
    raf = requestAnimationFrame(drawEqualizer);
  }

  function normalizeTrack(item) {
    if (typeof item === "string") {
      return { src: item, title: item.split("/").pop().replace(/\.[^.]+$/, ""), cover: "" };
    }
    if (!item || !item.src) return null;
    return {
      src: item.src,
      title: item.title || item.src.split("/").pop(),
      cover: item.cover || item.logo || item.image || ""
    };
  }

  function selectTrack(n, autoplay = false) {
    if (!playlist.length) return false;
    index = ((n % playlist.length) + playlist.length) % playlist.length;
    const t = playlist[index];
    audio.src = t.src;
    audio.load();
    $("trackTitle").textContent = t.title;
    setPodcastLogo(t.cover);
    $("currentTime").textContent = "00:00";
    $("duration").textContent = "00:00";
    seek.value = 0;
    setRangeFill(seek, 0);
    state();

    if (autoplay) {
      setupAudioGraph();
      audio
        .play()
        .then(state)
        .catch(() => notify(`پخش «${t.title}» ممکن نشد؛ فایل را بررسی کنید.`));
    }
    return true;
  }

  async function play() {
    if (!audio.src) {
      if (playlist.length > 0) {
        selectTrack(0, true);
      } else {
        notify("هنوز پادکستی در فهرست موجود نیست.");
      }
      return;
    }

    if (!audio.paused) {
      audio.pause();
      state();
      return;
    }

    try {
      setupAudioGraph();
      await audio.play();
    } catch {
      notify("پخش ممکن نشد؛ مسیر فایل صوتی را بررسی کنید.");
    }
    state();
  }

  /* رویدادهای منوی کشویی پادکست‌ها */
  const libraryToggle = $("podcastLibraryToggle");
  const listPanel = $("podcastListPanel");
  const listEl = $("podcastList");

  libraryToggle?.addEventListener("click", () => {
    const expanded = libraryToggle.getAttribute("aria-expanded") === "true";
    libraryToggle.setAttribute("aria-expanded", String(!expanded));
    if (listPanel) listPanel.hidden = expanded;
  });

  listEl?.addEventListener("click", (e) => {
    const targetEl = e.target.closest("[data-play-index]");
    if (!targetEl) return;
    const targetIdx = Number(targetEl.dataset.playIndex);
    if (!Number.isInteger(targetIdx) || targetIdx < 0 || targetIdx >= playlist.length) return;

    if (targetIdx === index && audio.src && !audio.paused && !audio.ended) {
      audio.pause();
      state();
    } else {
      selectTrack(targetIdx, true);
    }
  });

  /* کنترل‌های پخش */
  $("playButton")?.addEventListener("click", play);
  $("statusButton")?.addEventListener("click", play);

  $("rewindButton")?.addEventListener("click", () => {
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = Math.max(0, audio.currentTime - 15);
    } else {
      notify("فایل صوتی هنوز آماده نیست.");
    }
  });

  $("forwardButton")?.addEventListener("click", () => {
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 30);
    } else {
      notify("فایل صوتی هنوز آماده نیست.");
    }
  });

  $("previousButton")?.addEventListener("click", () => {
    if (!playlist.length) {
      notify("فهرست پخش خالی است.");
      return;
    }
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      selectTrack(index < 0 ? 0 : index - 1, true);
    }
  });

  $("nextButton")?.addEventListener("click", () => {
    if (!playlist.length) {
      notify("فهرست پخش خالی است.");
      return;
    }
    selectTrack(index < 0 ? 0 : index + 1, true);
  });

  $("speedSelect")?.addEventListener("change", (e) => {
    const rate = Number(e.target.value);
    audio.playbackRate = rate;
    e.target.closest(".vp-pill")?.classList.toggle("is-active", rate !== 1);
    notify(`سرعت پخش: ${rate}x`);
  });

  /* کنترل صدا و بی‌صدا کردن */
  audio.volume = Number(volumeBar?.value ?? 0.85);
  setRangeFill(volumeBar, audio.volume);

  volumeBar?.addEventListener("input", (e) => {
    const val = Number(e.target.value);
    audio.volume = val;
    audio.muted = val === 0;
    if (val > 0) lastVolume = val;
    setRangeFill(volumeBar, val);
    $("muteButton")?.classList.toggle("is-active", audio.muted);
  });

  $("muteButton")?.addEventListener("click", () => {
    if (audio.muted || audio.volume === 0) {
      audio.muted = false;
      audio.volume = lastVolume || 0.85;
      if (volumeBar) volumeBar.value = String(audio.volume);
      setRangeFill(volumeBar, audio.volume);
      $("muteButton")?.classList.remove("is-active");
    } else {
      lastVolume = audio.volume;
      audio.muted = true;
      if (volumeBar) volumeBar.value = "0";
      setRangeFill(volumeBar, 0);
      $("muteButton")?.classList.add("is-active");
    }
  });

  /* اسلایدر زمان پخش */
  seek?.addEventListener("input", () => {
    const ratio = Number(seek.value) / 1000;
    setRangeFill(seek, ratio);
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = ratio * audio.duration;
    }
  });

  audio.addEventListener("timeupdate", () => {
    $("currentTime").textContent = fmt(audio.currentTime);
    if (!seek.matches(":active") && audio.duration > 0) {
      const ratio = audio.currentTime / audio.duration;
      seek.value = String(Math.round(ratio * 1000));
      setRangeFill(seek, ratio);
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    $("duration").textContent = fmt(audio.duration);
  });

  audio.addEventListener("play", state);
  audio.addEventListener("pause", state);
  audio.addEventListener("ended", () => {
    state();
    if (repeat) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else if (playlist.length > 1) {
      selectTrack(index + 1, true);
    }
  });

  audio.addEventListener("error", () => {
    notify("فایل صوتی پیدا نشد؛ مسیر آن را در playlist.js بررسی کنید.");
  });

  /* تکرار، تایمر خواب و اشتراک‌گذاری */
  $("repeatButton")?.addEventListener("click", () => {
    repeat = !repeat;
    audio.loop = repeat;
    const btn = $("repeatButton");
    btn?.classList.toggle("is-active", repeat);
    btn?.setAttribute("aria-label", repeat ? "تکرار روشن" : "تکرار خاموش");
    notify(repeat ? "تکرار روشن شد." : "تکرار خاموش شد.");
  });

  $("sleepButton")?.addEventListener("click", () => {
    const opts = [0, 15, 30, 45, 60];
    sleepMinutes = opts[(opts.indexOf(sleepMinutes) + 1) % opts.length];
    clearTimeout(sleepTimer);

    const valEl = $("sleepValue");
    const btn = $("sleepButton");
    if (valEl) valEl.textContent = sleepMinutes ? `${sleepMinutes} دقیقه` : "خاموش";
    btn?.classList.toggle("is-active", sleepMinutes > 0);

    if (sleepMinutes) {
      sleepTimer = setTimeout(() => {
        audio.pause();
        sleepMinutes = 0;
        if (valEl) valEl.textContent = "خاموش";
        btn?.classList.remove("is-active");
        notify("زمان توقف خودکار فرا رسید.");
      }, sleepMinutes * 60000);
      notify(`توقف خودکار پس از ${sleepMinutes} دقیقه`);
    } else {
      notify("توقف خودکار خاموش شد.");
    }
  });

  $("shareButton")?.addEventListener("click", async () => {
    const shareUrl = window.top?.location?.href || location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Valhalla Audio", url: shareUrl });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        notify("لینک صفحه کپی شد.");
      } else {
        notify("اشتراک‌گذاری در این مرورگر پشتیبانی نمی‌شود.");
      }
    } catch (err) {
      if (err?.name !== "AbortError") notify("اشتراک‌گذاری انجام نشد.");
    }
  });

  /* رابط عمومی برای سازگاری کامل با playlist.js */
  window.ValhallaPlayer = {
    setAudio(src, title = "", cover = "") {
      playlist = [];
      index = -1;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      $("trackTitle").textContent = "هیچ پادکستی انتخاب نشده";
      $("currentTime").textContent = "00:00";
      $("duration").textContent = "00:00";
      seek.value = 0;
      setRangeFill(seek, 0);
      setPodcastLogo("");
      if (src) {
        playlist = [{ src, title: title || src.split("/").pop(), cover: cover || "" }];
      }
      renderPodcastMenu();
    },
    setPlaylist(items) {
      playlist = Array.isArray(items) ? items.map(normalizeTrack).filter(Boolean) : [];
      index = -1;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      $("trackTitle").textContent = "هیچ پادکستی انتخاب نشده";
      $("currentTime").textContent = "00:00";
      $("duration").textContent = "00:00";
      seek.value = 0;
      setRangeFill(seek, 0);
      setPodcastLogo("");
      renderPodcastMenu();
    },
    play,
    pause() {
      audio.pause();
    },
    next() {
      if (playlist.length) selectTrack(index < 0 ? 0 : index + 1, true);
    },
    previous() {
      if (playlist.length) selectTrack(index < 0 ? 0 : index - 1, true);
    },
    get playlist() {
      return playlist.map((x) => ({ ...x }));
    },
    get currentIndex() {
      return index;
    },
    get audio() {
      return audio;
    }
  };

  if (canvas) {
    if ("ResizeObserver" in window) {
      new ResizeObserver(resizeCanvas).observe(canvas);
    } else {
      window.addEventListener("resize", resizeCanvas);
    }
    resizeCanvas();
    if (!raf) raf = requestAnimationFrame(drawEqualizer);
  }

  setRangeFill(seek, 0);
  renderPodcastMenu();
  state();
})();
