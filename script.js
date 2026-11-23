/* =========================================================
   Valhalla Tech World — Complete App Script
   Minimal Podcast Theme Sync + Corner Valhalla Bot + Accordion
   ========================================================= */

const WORKER_URL = "https://valhalla-gemini-proxy.knjhgbtbp9.workers.dev";
const BOT_SKINS = ["valhalla-bot.glb", "valhalla_bot_2.glb"];

/* ---------- داده‌های راهنمای اتصال VPN (V2Ray & WireGuard) ---------- */
const VPN_GUIDES = {
  v2ray: {
    label: "V2Ray (VLESS / Reality)",
    platforms: {
      android: {
        title: "راهنمای اتصال V2Ray در اندروید",
        kicker: "ANDROID • V2RAY",
        downloads: [
          { name: "دانلود v2rayNG از Google Play", url: "https://play.google.com/store/apps/details?id=com.v2ray.ang" },
          { name: "دانلود مستقیم v2rayNG (GitHub)", url: "https://github.com/2dust/v2rayNG/releases/latest" },
          { name: "دانلود Hiddify برای اندروید", url: "https://github.com/hiddify/hiddify-app/releases/latest" }
        ],
        steps: [
          { title: "دریافت لینک اشتراک", desc: "وارد ربات @ValhallaGuard_bot شوید و لینک اشتراک اختصاصی (Subscription) خود را کپی کنید." },
          { title: "نصب اپلیکیشن v2rayNG", desc: "اپلیکیشن v2rayNG یا Hiddify را از یکی از لینک‌های بالا نصب و اجرا کنید." },
          { title: "افزودن لینک اشتراک", desc: "در v2rayNG منوی بالا سمت چپ را بزنید، وارد Subscription setting شوید، علامت + را بزنید و لینک کپی‌شده را در بخش URL قرار داده و ذخیره کنید." },
          { title: "آپدیت و اتصال", desc: "به صفحه اصلی برگردید، از منوی سه‌نقطه گزینه Update subscription را بزنید، سرور دلخواه را انتخاب و دکمه اتصال (V) را لمس کنید." }
        ],
        callout: "نکته: هر زمان سرور جدیدی اضافه شد، کافی است دوباره Update subscription را بزنید تا کانفیگ‌ها خودکار به‌روزرسانی شوند."
      },
      ios: {
        title: "راهنمای اتصال V2Ray در آیفون و آیپد (iOS)",
        kicker: "IOS • V2RAY",
        downloads: [
          { name: "دانلود Streisand از App Store", url: "https://apps.apple.com/app/streisand/id6450534064" },
          { name: "دانلود V2Box از App Store", url: "https://apps.apple.com/app/v2box-v2ray-client/id6446814690" }
        ],
        steps: [
          { title: "کپی کردن لینک اشتراک", desc: "لینک اشتراک اختصاصی خود را از ربات تلگرام @ValhallaGuard_bot کپی کنید." },
          { title: "نصب Streisand یا V2Box", desc: "یکی از دو برنامه Streisand (پیشنهادی) یا V2Box را از اپ‌استور دانلود و نصب کنید." },
          { title: "وارد کردن لینک در برنامه", desc: "در Streisand علامت + بالای صفحه را بزنید و گزینه Import from Clipboard را انتخاب کنید." },
          { title: "آپدیت و فعال‌سازی VPN", desc: "روی اشتراک اضافه‌شده ضربه بزنید تا لیست سرورها لود شود، یک سرور انتخاب کرده و کلید اتصال بالا را روشن کنید." }
        ],
        callout: "نکته: در اولین اتصال، سیستم‌عامل iOS درخواست مجوز Allow VPN Configurations می‌دهد؛ روی Allow بزنید و رمز گوشی را وارد کنید."
      },
      windows: {
        title: "راهنمای اتصال V2Ray در ویندوز",
        kicker: "WINDOWS • V2RAY",
        downloads: [
          { name: "دانلود Hiddify (نسخه ویندوز)", url: "https://github.com/hiddify/hiddify-app/releases/latest" },
          { name: "دانلود v2rayN (GitHub)", url: "https://github.com/2dust/v2rayN/releases/latest" }
        ],
        steps: [
          { title: "کپی لینک اشتراک", desc: "لینک اشتراک خود را از ربات @ValhallaGuard_bot کپی کنید." },
          { title: "نصب و اجرای Hiddify", desc: "فایل نصب Hiddify را دانلود و نصب کنید (در صورت نیاز، برنامه را با Run as Administrator اجرا نمایید)." },
          { title: "افزودن پروفایل از کلیپ‌بورد", desc: "روی دکمه New Profile یا + کلیک کرده و گزینه Add from Clipboard را انتخاب کنید." },
          { title: "اتصال سراسری سیستم", desc: "دکمه بزرگ Connect در مرکز صفحه را بزنید تا اتصال برای مرورگر و تمام نرم‌افزارهای ویندوز فعال شود." }
        ],
        callout: "نکته: اگر در بازی‌ها یا نرم‌افزارهای خاص به تونل کامل نیاز دارید، از تنظیمات Hiddify حالت VPN (TUN) را فعال کنید."
      },
      macos: {
        title: "راهنمای اتصال V2Ray در مک‌او‌اس (macOS)",
        kicker: "MACOS • V2RAY",
        downloads: [
          { name: "دانلود Hiddify برای macOS", url: "https://github.com/hiddify/hiddify-app/releases/latest" },
          { name: "دانلود V2Box از Mac App Store", url: "https://apps.apple.com/app/v2box-v2ray-client/id6446814690" }
        ],
        steps: [
          { title: "کپی لینک اشتراک", desc: "لینک اشتراک اختصاصی خود را از ربات @ValhallaGuard_bot کپی کنید." },
          { title: "نصب کلاینت روی مک", desc: "برنامه Hiddify (سازگار با اپل سیلیکون و اینتل) یا V2Box را روی مک نصب و اجرا کنید." },
          { title: "ایمپورت پروفایل", desc: "گزینه Add Profile / Import from Clipboard را بزنید تا تمام سرورهای والهالا گارد اضافه شوند." },
          { title: "تایید دسترسی و اتصال", desc: "دکمه اتصال را بزنید و در پنجره macOS، دسترسی System Proxy یا VPN را تایید کنید." }
        ],
        callout: "نکته: در مک‌های سری M (اپل سیلیکون) اپلیکیشن Streisand نیز مستقیماً از App Store قابل نصب و استفاده است."
      }
    }
  },
  wireguard: {
    label: "WireGuard (پینگ پایین و سرعت بالا)",
    platforms: {
      android: {
        title: "راهنمای اتصال WireGuard در اندروید",
        kicker: "ANDROID • WIREGUARD",
        downloads: [
          { name: "دانلود WireGuard از Google Play", url: "https://play.google.com/store/apps/details?id=com.wireguard.android" },
          { name: "دانلود از سایت رسمی WireGuard", url: "https://www.wireguard.com/install/" }
        ],
        steps: [
          { title: "دریافت فایل یا QR کد", desc: "فایل کانفیگ (.conf) یا QR کد اختصاصی WireGuard خود را از @ValhallaGuard_bot یا پشتیبانی دریافت کنید." },
          { title: "نصب اپلیکیشن WireGuard", desc: "اپلیکیشن رسمی WireGuard را نصب و باز کنید." },
          { title: "ایمپورت کانفیگ", desc: "علامت + پایین صفحه را بزنید و گزینه Import from file یا Scan from QR code را انتخاب کنید." },
          { title: "روشن کردن تونل", desc: "سوییچ کنار نام کانفیگ را روشن کنید و مجوز اتصال VPN را تایید نمایید." }
        ],
        callout: "نکته: پروتکل WireGuard به دلیل سبک بودن، مصرف باتری بسیار پایینی دارد و برای پینگ ثابت عالی است."
      },
      ios: {
        title: "راهنمای اتصال WireGuard در آیفون و آیپد",
        kicker: "IOS • WIREGUARD",
        downloads: [
          { name: "دانلود WireGuard از App Store", url: "https://apps.apple.com/app/wireguard/id1441195209" }
        ],
        steps: [
          { title: "دریافت کانفیگ WireGuard", desc: "فایل کانفیگ یا QR کد اختصاصی خود را از ربات یا پشتیبانی والهالا دریافت کنید." },
          { title: "نصب اپلیکیشن", desc: "برنامه رسمی WireGuard را از App Store دانلود و اجرا کنید." },
          { title: "افزودن تونل جدید", desc: "علامت + بالای صفحه را زده و گزینه Create from file or archive یا Create from QR code را انتخاب کنید." },
          { title: "تایید و اتصال", desc: "مجوز افزودن پروفایل VPN را تایید کرده و سوییچ تونل را فعال کنید." }
        ],
        callout: "نکته: برای فعال‌سازی خودکار در شبکه‌های مختلف می‌توانید گزینه On-Demand Activation را در تنظیمات تونل روشن کنید."
      },
      windows: {
        title: "راهنمای اتصال WireGuard در ویندوز",
        kicker: "WINDOWS • WIREGUARD",
        downloads: [
          { name: "دانلود نصب‌کننده رسمی WireGuard ویندوز", url: "https://download.wireguard.com/windows-client/wireguard-installer.exe" },
          { name: "صفحه رسمی دانلود WireGuard", url: "https://www.wireguard.com/install/" }
        ],
        steps: [
          { title: "دانلود فایل کانفیگ", desc: "فایل کانفیگ با پسوند .conf را از تلگرام ذخیره کنید." },
          { title: "نصب نرم‌افزار WireGuard", desc: "فایل نصب رسمی WireGuard را دانلود و روی ویندوز نصب نمایید." },
          { title: "ایمپورت فایل تونل", desc: "روی دکمه Import tunnel(s) from file کلیک کرده و فایل .conf را انتخاب کنید." },
          { title: "فعال‌سازی اتصال", desc: "روی دکمه Activate کلیک کنید تا وضعیت به Active تغییر یابد." }
        ],
        callout: "نکته: WireGuard روی ویندوز تمام ترافیک سیستم از جمله لانچرهای بازی را با حداقل تاخیر تونل می‌کند."
      },
      macos: {
        title: "راهنمای اتصال WireGuard در مک‌او‌اس",
        kicker: "MACOS • WIREGUARD",
        downloads: [
          { name: "دانلود WireGuard از Mac App Store", url: "https://apps.apple.com/app/wireguard/id1451685025" }
        ],
        steps: [
          { title: "ذخیره فایل .conf", desc: "فایل کانفیگ WireGuard خود را از ربات یا پشتیبانی دانلود کنید." },
          { title: "نصب برنامه از Mac App Store", desc: "اپلیکیشن WireGuard را از اپ‌استور مک نصب و اجرا کنید." },
          { title: "افزودن فایل کانفیگ", desc: "روی Import Tunnel(s) from File کلیک کرده و فایل ذخیره شده را انتخاب نمایید." },
          { title: "اتصال", desc: "پس از تایید مجوز VPN در macOS، روی Activate کلیک کنید تا اتصال برقرار شود." }
        ],
        callout: "نکته: آیکون WireGuard در نوار بالای مک (Menu Bar) قرار می‌گیرد تا با یک کلیک بتوانید متصل یا قطع شوید."
      }
    }
  }
};

/* ---------- استایل تزریقی مینیمال برای منو و پلیر پادکست داخل audio-player/ ---------- */
const PODCAST_IFRAME_CSS = `
  :root {
    color-scheme: dark !important;
    --bg: #09090b !important;
    --bg-alt: #0d0d10 !important;
    --surface: #121216 !important;
    --surface-hover: #18181e !important;
    --surface-inset: #0c0c0f !important;
    --border: #222228 !important;
    --border-strong: #303039 !important;
    --accent: #9f1239 !important;
    --accent-hover: #be123c !important;
    --accent-bright: #f43f5e !important;
    --accent-text: #fda4af !important;
    --primary: #9f1239 !important;
    --teal: #9f1239 !important;
    --cyan: #be123c !important;
    --text: #f4f4f5 !important;
    --text-secondary: #a1a1aa !important;
    --muted: #71717a !important;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }

  html, body {
    background: #09090b !important;
    color: #f4f4f5 !important;
    font-family: "Vazirmatn", system-ui, -apple-system, sans-serif !important;
    margin: 0 !important;
    overflow-x: hidden !important;
  }

  body::before, body::after {
    display: none !important;
  }

  /* حذف شلوغی و کادرهای شیشه‌ای درون پلیر */
  header, main, section, aside, nav, .app, .player, .player-shell, .player-card,
  .podcast-app, .podcast-container, .playlist, .track-list, .episode-list,
  .sidebar, .menu, .controls-bar, .now-playing, .card, .panel {
    background-image: none !important;
    box-shadow: none !important;
  }

  .player, .player-shell, .player-card, .podcast-app, .now-playing, .controls-bar, .panel {
    background-color: #121216 !important;
    border: 1px solid #222228 !important;
    border-radius: 12px !important;
  }

  /* منوی پادکست‌ها و ردیف اپیزودها (مینیمال با خط جداکننده ظریف) */
  .playlist, .track-list, .episode-list, .episodes, ul.playlist, ul.tracks, nav ul {
    background-color: #0d0d10 !important;
    border: 1px solid #222228 !important;
    border-radius: 12px !important;
    padding: 4px !important;
  }

  .track, .track-item, .episode, .episode-item, .playlist-item,
  li.track, li.episode, button.track, button.episode {
    background: transparent !important;
    border: none !important;
    border-bottom: 1px solid #222228 !important;
    border-radius: 0 !important;
    color: #a1a1aa !important;
    transition: background-color 0.18s ease, color 0.18s ease !important;
  }

  .track:last-child, .track-item:last-child, .episode:last-child,
  .episode-item:last-child, .playlist-item:last-child {
    border-bottom: none !important;
  }

  .track:hover, .track-item:hover, .episode:hover, .episode-item:hover, .playlist-item:hover {
    background-color: #16161b !important;
    color: #f4f4f5 !important;
  }

  .track.active, .track.is-active, .track-item.active, .track-item.is-active,
  .episode.active, .episode.is-active, .episode-item.active, .episode-item.is-active,
  .playlist-item.active, .playlist-item.is-active, [aria-current="true"] {
    background-color: #1f0d13 !important;
    border-right: 2px solid #9f1239 !important;
    color: #fff5f7 !important;
  }

  /* دکمه‌های پلیر و منو */
  button, .btn {
    font-family: "Vazirmatn", system-ui, sans-serif !important;
    border-radius: 8px !important;
    transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease !important;
  }

  .play-btn, .btn-play, #playBtn, #playPauseBtn, button[data-action="play"],
  button.primary, .tab.active, .filter.active, .category.active {
    background-color: #9f1239 !important;
    border-color: #9f1239 !important;
    color: #fff5f7 !important;
  }

  .play-btn:hover, .btn-play:hover, #playBtn:hover, #playPauseBtn:hover,
  button[data-action="play"]:hover, button.primary:hover {
    background-color: #be123c !important;
    border-color: #be123c !important;
  }

  /* اسلایدر زمان پخش و صدا */
  input[type="range"] {
    accent-color: #9f1239 !important;
    cursor: pointer !important;
  }

  input[type="range"]::-webkit-slider-runnable-track {
    background: #222228 !important;
    height: 4px !important;
    border-radius: 999px !important;
  }

  input[type="range"]::-webkit-slider-thumb {
    background: #f43f5e !important;
    border: 2px solid #09090b !important;
  }

  .progress-fill, .progress-bar-fill, .seek-fill, .waveform-progress {
    background: #9f1239 !important;
  }

  .progress, .progress-bar, .seek-bar {
    background: #222228 !important;
  }

  .time, .duration, .current-time, time {
    font-variant-numeric: tabular-nums !important;
    color: #a1a1aa !important;
  }

  a {
    color: #fda4af !important;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #09090b;
  }
  ::-webkit-scrollbar-thumb {
    background: #27272e;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #9f1239;
  }
`;

/* ---------- همگام‌سازی خودکار ظاهر بخش پادکست، منو و پلیر ---------- */
function syncPodcastPlayerTheme() {
  const frameWrap = document.querySelector(".podcast-player-frame");
  if (!frameWrap) return;

  // افزودن نوار عنوان مینیمال بالای پلیر پادکست برای یکپارچگی با طراحی سایت
  if (!frameWrap.parentElement?.classList.contains("podcast-shell")) {
    const shell = document.createElement("div");
    shell.className = "podcast-shell";

    const bar = document.createElement("div");
    bar.className = "podcast-bar";
    bar.innerHTML = `
      <span class="podcast-bar-right">
        <span class="podcast-eq" aria-hidden="true"><i></i><i></i><i></i></span>
        <span>پلیر و آرشیو پادکست‌های والهالا</span>
      </span>
      <span class="podcast-bar-meta">پخش مستقیم صوتی</span>
    `;

    frameWrap.parentNode.insertBefore(shell, frameWrap);
    shell.appendChild(bar);
    shell.appendChild(frameWrap);
  }

  const iframe = frameWrap.querySelector("iframe");
  if (!iframe) return;

  const injectStyles = () => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc || !doc.head) return;

      if (!doc.getElementById("valhalla-vazir-font")) {
        const fontLink = doc.createElement("link");
        fontLink.id = "valhalla-vazir-font";
        fontLink.rel = "stylesheet";
        fontLink.href = "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap";
        doc.head.appendChild(fontLink);
      }

      let styleTag = doc.getElementById("valhalla-podcast-minimal-theme");
      if (!styleTag) {
        styleTag = doc.createElement("style");
        styleTag.id = "valhalla-podcast-minimal-theme";
        doc.head.appendChild(styleTag);
      }
      styleTag.textContent = PODCAST_IFRAME_CSS;

      // تنظیم ارتفاع متناسب با محتوای داخلی پلیر در صورت امکان
      const adjustHeight = () => {
        const contentH = doc.documentElement?.scrollHeight || doc.body?.scrollHeight || 0;
        if (contentH >= 360 && contentH <= 860) {
          iframe.style.height = `${contentH + 8}px`;
        }
      };
      setTimeout(adjustHeight, 250);
      setTimeout(adjustHeight, 900);
    } catch {
      // اگر منبع iframe روی دامنه خارجی باشد، بدون خطا رها می‌شود
    }
  };

  iframe.addEventListener("load", injectStyles);
  if (iframe.contentDocument?.readyState === "complete") {
    injectStyles();
  }
}

/* ---------- تضمین نمایش و چیدمان کلید «والهالا بات» در گوشه پایین سمت چپ ---------- */
function ensureValhallaBotUI() {
  let fab = document.getElementById("aiFab") || document.querySelector(".ai-fab");
  let drawer = document.getElementById("aiDrawer") || document.querySelector(".ai-drawer");

  const botIconSvg = `
    <span class="ai-fab-badge" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="8" width="18" height="11" rx="3"/>
        <path d="M12 8V4"/>
        <circle cx="12" cy="3" r="1"/>
        <circle cx="9" cy="13.5" r="1" fill="currentColor" stroke="none"/>
        <circle cx="15" cy="13.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    </span>
    <span class="ai-fab-label">
      <span>والهالا بات</span>
      <span class="ai-fab-dot" aria-hidden="true"></span>
    </span>
  `;

  if (!fab) {
    fab = document.createElement("button");
    fab.type = "button";
    fab.id = "aiFab";
    fab.className = "ai-fab";
    fab.setAttribute("aria-label", "باز کردن والهالا بات");
    fab.setAttribute("aria-expanded", "false");
    fab.innerHTML = botIconSvg;
    document.body.appendChild(fab);
  } else {
    fab.classList.add("ai-fab");
    fab.id = fab.id || "aiFab";
    fab.setAttribute("aria-label", "باز کردن والهالا بات");
    fab.innerHTML = botIconSvg;
  }

   if (!drawer) {
    drawer = document.createElement("aside");
    drawer.id = "aiDrawer";
    drawer.className = "ai-drawer";
    drawer.setAttribute("aria-hidden", "true");
    drawer.hidden = true;
    drawer.innerHTML = `
      <div class="ai-header">
        <div class="ai-header-info">
          <div class="ai-avatar-wrap" id="aiAvatarWrap">
            <model-viewer
              id="valhallaBotViewer"
              src="${BOT_SKINS[0]}"
              alt="Valhalla Bot"
              auto-rotate
              autoplay
              disable-zoom
              interaction-prompt="none"
              shadow-intensity="0"
              style="width: 42px; height: 42px; background: transparent;">
            </model-viewer>
          </div>
          <div>
            <h4>والهالا بات</h4>
            <span class="ai-status"><span class="status-dot"></span>آنلاین و آماده پاسخ‌گویی</span>
          </div>
        </div>
        <div class="ai-header-actions">
          <button type="button" class="ai-icon-btn" id="switchSkinBtn" title="تغییر اسکین ربات" aria-label="تغییر اسکین ربات">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
          </button>
          <button type="button" class="ai-icon-btn" id="aiCloseBtn" aria-label="بستن چت">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </div>

      <div class="ai-messages" id="aiMessages">
        <div class="ai-msg bot">
          سلام! من <strong>والهالا بات</strong> هستم. درباره راهنمای اتصال والهالا گارد، خدمات دیجیتال، سیم‌کارت بین‌المللی یا مسائل فنی سیستم چطور می‌تونم کمکت کنم؟
        </div>
      </div>

      <div class="ai-quick-prompts">
        <button type="button" class="ai-prompt-chip" data-prompt="چطور لینک اشتراک والهالا گارد رو روی آیفون وصل کنم؟">اتصال در آیفون</button>
        <button type="button" class="ai-prompt-chip" data-prompt="تفاوت V2Ray و WireGuard در والهالا گارد چیه؟">تفاوت V2Ray و WireGuard</button>
        <button type="button" class="ai-prompt-chip" data-prompt="چه خدمات سخت‌افزاری و دیجیتال ارائه می‌دید؟">لیست خدمات</button>
      </div>

      <form class="ai-input-row" id="aiForm">
        <input type="text" id="aiInput" placeholder="سوالت رو اینجا بنویس..." autocomplete="off" required />
        <button type="submit" class="ai-send-btn" id="aiSendBtn" aria-label="ارسال پیام">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        </button>
      </form>
    `;
    document.body.appendChild(drawer);
  } else {
    drawer.classList.add("ai-drawer");
    drawer.id = drawer.id || "aiDrawer";
    if (!drawer.classList.contains("open")) {
      drawer.hidden = true;
      drawer.setAttribute("aria-hidden", "true");
    }
  }
}

/* ---------- شفاف‌سازی خودکار پس‌زمینه سفید لوگو ---------- */
function makeLogoTransparent(imgEl) {
  if (!imgEl || imgEl.tagName !== "IMG" || imgEl.dataset.transparentDone === "true") return;
  const src = imgEl.getAttribute("src") || "";
  if (src.endsWith(".svg") || src.startsWith("data:image/svg")) return;

  const process = () => {
    try {
      const w = imgEl.naturalWidth;
      const h = imgEl.naturalHeight;
      if (!w || !h) return;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imgEl, 0, 0);

      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      if (data[3] < 20 && data[(w - 1) * 4 + 3] < 20) {
        imgEl.dataset.transparentDone = "true";
        return;
      }

      const visited = new Uint8Array(w * h);
      const queue = new Int32Array(w * h);
      let head = 0;
      let tail = 0;

      const isOuterWhite = (idx) => {
        const p = idx * 4;
        return data[p] > 226 && data[p + 1] > 226 && data[p + 2] > 226;
      };

      const pushIfWhite = (idx) => {
        if (!visited[idx] && isOuterWhite(idx)) {
          visited[idx] = 1;
          queue[tail++] = idx;
        }
      };

      for (let x = 0; x < w; x++) {
        pushIfWhite(x);
        pushIfWhite((h - 1) * w + x);
      }
      for (let y = 0; y < h; y++) {
        pushIfWhite(y * w);
        pushIfWhite(y * w + (w - 1));
      }

      while (head < tail) {
        const curr = queue[head++];
        const cx = curr % w;
        const cy = (curr / w) | 0;
        data[curr * 4 + 3] = 0;

        if (cx > 0) pushIfWhite(curr - 1);
        if (cx < w - 1) pushIfWhite(curr + 1);
        if (cy > 0) pushIfWhite(curr - w);
        if (cy < h - 1) pushIfWhite(curr + w);
      }

      ctx.putImageData(imageData, 0, 0);
      imgEl.dataset.transparentDone = "true";
      imgEl.src = canvas.toDataURL("image/png");
    } catch {
      // بدون خطا در اجرای لوکال
    }
  };

  if (imgEl.complete && imgEl.naturalWidth > 0) {
    process();
  } else {
    imgEl.addEventListener("load", process, { once: true });
  }
}

/* ---------- تبدیل خودکار دسته‌بندی‌های آکادمی به لیست بازشونده (سبک توییک آکادمی) ---------- */
function initAcademyAccordion() {
  const grid = document.querySelector(".academy-grid");
  if (!grid || document.querySelector(".academy-accordion")) return;

  const cards = Array.from(grid.querySelectorAll(".academy-card"));
  if (!cards.length) return;

  const filtersWrap = document.querySelector(".academy-filters");
  const filterButtons = filtersWrap ? Array.from(filtersWrap.querySelectorAll(".academy-filter")) : [];

  const groups = [];
  const groupMap = new Map();

  const registerGroup = (key, title) => {
    const cleanKey = key.trim().toLowerCase();
    if (!cleanKey || groupMap.has(cleanKey)) return groupMap.get(cleanKey);
    const group = { key: cleanKey, title: title.trim(), items: [] };
    groups.push(group);
    groupMap.set(cleanKey, group);
    return group;
  };

  filterButtons.forEach((btn) => {
    const key = (btn.dataset.filter || btn.dataset.category || "").trim().toLowerCase();
    const label = btn.textContent.trim();
    if (key && key !== "all") {
      registerGroup(key, label);
    }
  });

  cards.forEach((card) => {
    const rawCats = (
      card.dataset.category ||
      card.dataset.filter ||
      card.dataset.type ||
      card.dataset.tags ||
      ""
    )
      .trim()
      .toLowerCase();

    const tokens = rawCats.split(/[\s,]+/).filter(Boolean);
    let targetGroup = null;

    if (groups.length > 0) {
      for (const token of tokens) {
        if (groupMap.has(token)) {
          targetGroup = groupMap.get(token);
          break;
        }
      }
      if (!targetGroup) {
        targetGroup = groups.find((g) => rawCats.includes(g.key));
      }
    }

    if (!targetGroup) {
      const typeLabel = card.querySelector(".academy-type")?.textContent.trim() || "سایر آموزش‌ها";
      const fallbackKey = rawCats || typeLabel.toLowerCase();
      targetGroup = registerGroup(fallbackKey, typeLabel);
    }

    targetGroup.items.push(card);
  });

  const nonEmptyGroups = groups.filter((g) => g.items.length > 0);
  if (!nonEmptyGroups.length) return;

  const accordion = document.createElement("div");
  accordion.className = "academy-accordion";

  nonEmptyGroups.forEach((group, idx) => {
    const numStr = String(idx + 1).padStart(2, "0");
    const panelId = `academy-group-panel-${idx + 1}`;
    const faCount = group.items.length.toLocaleString("fa-IR");

    const groupEl = document.createElement("div");
    groupEl.className = "academy-group";
    groupEl.dataset.groupKey = group.key;

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "academy-group-trigger";
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", panelId);
    trigger.innerHTML = `
      <span class="academy-group-right">
        <span class="academy-group-index">${numStr}</span>
        <span class="academy-group-meta">
          <span class="academy-group-title">${group.title}</span>
          <span class="academy-group-subtitle">برای مشاهده مطالب و جزئیات این بخش کلیک کنید</span>
        </span>
      </span>
      <span class="academy-group-left">
        <span class="academy-group-count">${faCount} مورد</span>
        <span class="academy-group-chevron" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </span>
      </span>
    `;

    const panel = document.createElement("div");
    panel.className = "academy-group-panel";
    panel.id = panelId;

    const panelInner = document.createElement("div");
    panelInner.className = "academy-group-panel-inner";

    const itemsWrap = document.createElement("div");
    itemsWrap.className = "academy-group-items";

    group.items.forEach((card) => {
      card.hidden = false;
      itemsWrap.appendChild(card);
    });

    panelInner.appendChild(itemsWrap);
    panel.appendChild(panelInner);
    groupEl.appendChild(trigger);
    groupEl.appendChild(panel);
    accordion.appendChild(groupEl);
  });

  grid.parentNode.insertBefore(accordion, grid);
  grid.classList.add("is-replaced");
  filtersWrap?.classList.add("is-replaced");
}

function toggleAcademyGroup(groupEl, forceOpen) {
  if (!groupEl) return;
  const trigger = groupEl.querySelector(".academy-group-trigger");
  const isOpen = groupEl.classList.contains("is-open");
  const nextState = typeof forceOpen === "boolean" ? forceOpen : !isOpen;

  if (nextState) {
    document.querySelectorAll(".academy-group.is-open").forEach((other) => {
      if (other !== groupEl) {
        other.classList.remove("is-open");
        other.querySelector(".academy-group-trigger")?.setAttribute("aria-expanded", "false");
      }
    });
  }

  groupEl.classList.toggle("is-open", nextState);
  trigger?.setAttribute("aria-expanded", String(nextState));
}

/* ---------- وضعیت سراسری اپلیکیشن ---------- */
let currentVpnService = "v2ray";
let currentVpnPlatform = "android";
let currentSkinIndex = 0;
let chatHistory = [];
let searchIndex = [];
let activeSearchIdx = -1;

/* ---------- کنترل باز و بسته کردن پنل والهالا بات ---------- */
function setAiDrawerState(forceOpen) {
  const aiDrawer = document.getElementById("aiDrawer") || document.querySelector(".ai-drawer");
  const aiFab = document.getElementById("aiFab") || document.querySelector(".ai-fab");
  if (!aiDrawer) return;

  const isCurrentlyOpen = aiDrawer.classList.contains("open") && !aiDrawer.hidden;
  const nextState = typeof forceOpen === "boolean" ? forceOpen : !isCurrentlyOpen;

  aiDrawer.hidden = !nextState;
  aiDrawer.classList.toggle("open", nextState);
  aiDrawer.setAttribute("aria-hidden", String(!nextState));

  if (aiFab) {
    aiFab.setAttribute("aria-expanded", String(nextState));
  }

  if (nextState) {
    setTimeout(() => {
      const input = document.getElementById("aiInput") || aiDrawer.querySelector("input");
      input?.focus();
    }, 90);
  }
}

/* ---------- ارتباط با Cloudflare Worker دستیار هوشمند ---------- */
function appendAiMessage(text, role) {
  const container = document.getElementById("aiMessages") || document.querySelector(".ai-messages");
  if (!container) return null;
  const msg = document.createElement("div");
  msg.className = `ai-msg ${role}`;
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
  return msg;
}

async function sendToValhallaAI(userText) {
  const input = document.getElementById("aiInput") || document.querySelector(".ai-input-row input");
  const sendBtn = document.getElementById("aiSendBtn") || document.querySelector(".ai-send-btn");

  appendAiMessage(userText, "user");
  const loadingEl = appendAiMessage("در حال بررسی و پاسخ‌گویی...", "bot");

  if (input) input.value = "";
  if (sendBtn) sendBtn.disabled = true;

  const systemInstruction =
    "تو والهالا بات، دستیار هوشمند رسمی سایت والهالا تک‌ورلد (Valhalla Tech World) هستی. دقیق، کوتاه، محترمانه و به زبان فارسی پاسخ بده. کانال تلگرام: @valhala_tw، پشتیبانی: @Valhalla_Guard، ربات اشتراک والهالا گارد: @ValhallaGuard_bot، اینستاگرام: @Valhala_tw.";

  chatHistory.push({ role: "user", parts: [{ text: userText }] });

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: chatHistory.slice(-8)
      })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const rawText = await res.text();
    let reply = "";
    try {
      const data = JSON.parse(rawText);
      reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.reply ||
        data?.response ||
        data?.answer ||
        data?.text ||
        data?.message ||
        "";
    } catch {
      reply = rawText;
    }

    if (!reply) {
      reply = "پاسخی دریافت نشد. لطفاً دوباره امتحان کنید یا به پشتیبانی @Valhalla_Guard پیام دهید.";
    }

    if (loadingEl) loadingEl.textContent = reply;
    chatHistory.push({ role: "model", parts: [{ text: reply }] });
  } catch {
    if (loadingEl) {
      loadingEl.textContent =
        "ارتباط با سرور هوش مصنوعی موقتاً برقرار نشد. برای راهنمایی سریع می‌توانید به پشتیبانی @Valhalla_Guard یا ربات @ValhallaGuard_bot پیام دهید.";
    }
  } finally {
    if (sendBtn) sendBtn.disabled = false;
    input?.focus();
  }
}

/* ---------- مدیریت نمای اصلی و نمای راهنمای VPN (#vpn-guide) ---------- */
function switchSiteView(viewName, scrollTargetId = null) {
  const vpnView = document.getElementById("vpn-guide") || document.querySelector('[data-view="vpn-guide"]');
  const homeView =
    document.getElementById("home-view") ||
    document.getElementById("main-view") ||
    document.querySelector('[data-view="home"]');

  const vpnTabs = document.querySelectorAll('.vpn-tab, [data-open-view="vpn-guide"]');

  if (vpnView && homeView) {
    const showVpn = viewName === "vpn-guide";
    vpnView.hidden = !showVpn;
    homeView.hidden = showVpn;

    vpnTabs.forEach((tab) => {
      if (showVpn) {
        tab.setAttribute("aria-current", "page");
      } else {
        tab.removeAttribute("aria-current");
      }
    });

    if (showVpn) {
      renderVpnGuidePanel();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (scrollTargetId) {
      const target = document.getElementById(scrollTargetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } else if (scrollTargetId) {
    document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: "smooth" });
  }
}

/* ---------- رندر پنل راهنمای VPN ---------- */
function renderVpnGuidePanel() {
  const preRenderedPanels = document.querySelectorAll("[data-guide-service][data-guide-platform]");
  if (preRenderedPanels.length > 0) {
    preRenderedPanels.forEach((panel) => {
      const match =
        panel.dataset.guideService === currentVpnService &&
        panel.dataset.guidePlatform === currentVpnPlatform;
      panel.hidden = !match;
    });
    return;
  }

  const panel = document.getElementById("guidePanel") || document.querySelector(".guide-panel");
  if (!panel) return;

  const serviceData = VPN_GUIDES[currentVpnService] || VPN_GUIDES.v2ray;
  const platformData = serviceData.platforms[currentVpnPlatform] || serviceData.platforms.android;

  const kickerEl = panel.querySelector(".panel-kicker");
  const titleEl = panel.querySelector("h4");
  const downloadsEl = panel.querySelector(".download-links");
  const stepsEl = panel.querySelector(".steps-list");
  const calloutEl = panel.querySelector(".guide-callout");

  if (kickerEl && titleEl && downloadsEl && stepsEl) {
    kickerEl.textContent = platformData.kicker;
    titleEl.textContent = platformData.title;
    downloadsEl.innerHTML = platformData.downloads
      .map(
        (item) => `
        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="download-link">
          <span>${item.name}</span>
          <span aria-hidden="true">↗</span>
        </a>`
      )
      .join("");

    stepsEl.innerHTML = platformData.steps
      .map(
        (step, idx) => `
        <li class="step-item">
          <span class="step-number">0${idx + 1}</span>
          <div>
            <strong>${step.title}</strong>
            <p>${step.desc}</p>
          </div>
        </li>`
      )
      .join("");

    if (calloutEl) {
      calloutEl.innerHTML = `<span>✦</span><p>${platformData.callout}</p>`;
    }
  } else {
    panel.innerHTML = `
      <div class="guide-panel-head">
        <div>
          <span class="panel-kicker">${platformData.kicker}</span>
          <h4>${platformData.title}</h4>
        </div>
      </div>
      <div class="download-box">
        <div class="download-heading">
          <span class="download-arrow">↓</span>
          <strong>لینک‌های دانلود اپلیکیشن مورد نیاز</strong>
        </div>
        <div class="download-links">
          ${platformData.downloads
            .map(
              (item) => `
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="download-link">
              <span>${item.name}</span>
              <span aria-hidden="true">↗</span>
            </a>`
            )
            .join("")}
        </div>
      </div>
      <ol class="steps-list">
        ${platformData.steps
          .map(
            (step, idx) => `
          <li class="step-item">
            <span class="step-number">0${idx + 1}</span>
            <div>
              <strong>${step.title}</strong>
              <p>${step.desc}</p>
            </div>
          </li>`
          )
          .join("")}
      </ol>
      <div class="guide-callout">
        <span>✦</span>
        <p>${platformData.callout}</p>
      </div>
    `;
  }
}

/* ---------- مدیریت تب‌های سیم‌کارت فیزیکی ---------- */
function activateSimTab(tabBtn) {
  const container = tabBtn.closest(".physical-sim-card") || document;
  const tabs = Array.from(container.querySelectorAll(".sim-tab"));
  const panels = Array.from(container.querySelectorAll(".sim-panel"));
  const tabIndex = tabs.indexOf(tabBtn);
  const targetId = tabBtn.getAttribute("aria-controls") || tabBtn.dataset.target || tabBtn.dataset.sim;

  tabs.forEach((t) => {
    const active = t === tabBtn;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", String(active));
  });

  panels.forEach((panel, idx) => {
    let match = false;
    if (targetId) {
      match = panel.id === targetId || panel.dataset.simPanel === targetId || panel.dataset.sim === targetId;
    }
    if (!targetId || !panels.some((p) => p.id === targetId || p.dataset.simPanel === targetId || p.dataset.sim === targetId)) {
      match = idx === tabIndex;
    }
    panel.hidden = !match;
  });
}

/* ---------- جست‌وجوی سریع ---------- */
function buildSearchIndex() {
  searchIndex = [];

  document.querySelectorAll(".offer-card, .academy-card, .faq-item, .contact-card").forEach((el, idx) => {
    const titleEl = el.querySelector("h3, h4, summary, strong");
    const descEl = el.querySelector("p, small");
    const title = titleEl ? titleEl.textContent.trim() : "";
    const desc = descEl ? descEl.textContent.trim() : "";
    if (!title) return;

    if (!el.id) {
      el.id = `search-item-${idx}`;
    }

    const inVpnView = Boolean(el.closest("#vpn-guide, [data-view='vpn-guide']"));
    searchIndex.push({
      id: el.id,
      title,
      desc,
      haystack: `${title} ${desc}`.toLowerCase(),
      inVpnView
    });
  });
}

function toggleQuickSearch(forceOpen) {
  const panel = document.getElementById("quickSearch") || document.querySelector(".quick-search");
  const toggleBtn =
    document.getElementById("searchToggle") ||
    document.querySelector('[data-search-toggle], .btn-icon[aria-controls*="search"], .btn-icon');
  if (!panel) return;

  const isOpen = !panel.hidden;
  const next = typeof forceOpen === "boolean" ? forceOpen : !isOpen;
  panel.hidden = !next;
  if (toggleBtn) toggleBtn.setAttribute("aria-expanded", String(next));

  if (next) {
    const input = panel.querySelector("input");
    input?.focus();
    renderSearchResults(input?.value || "");
  } else {
    activeSearchIdx = -1;
  }
}

function renderSearchResults(query) {
  const resultsEl = document.getElementById("searchResults") || document.querySelector(".search-results");
  if (!resultsEl) return;

  const q = query.trim().toLowerCase();
  activeSearchIdx = -1;

  if (!q) {
    resultsEl.innerHTML = "";
    return;
  }

  const matches = searchIndex.filter((item) => item.haystack.includes(q)).slice(0, 8);

  if (matches.length === 0) {
    resultsEl.innerHTML = `<div class="search-empty">موردی برای «${query.trim()}» پیدا نشد.</div>`;
    return;
  }

  resultsEl.innerHTML = matches
    .map(
      (item, idx) => `
      <button type="button" class="search-result" data-search-idx="${idx}" data-target-id="${item.id}" data-in-vpn="${item.inVpnView}" role="option" aria-selected="false">
        <strong>${item.title}</strong>
        <small>${item.desc || "مشاهده بخش"}</small>
        <span aria-hidden="true">↵</span>
      </button>`
    )
    .join("");
}

function navigateToSearchResult(btn) {
  const targetId = btn.dataset.targetId;
  const inVpn = btn.dataset.inVpn === "true";

  toggleQuickSearch(false);

  if (inVpn) {
    switchSiteView("vpn-guide");
  } else {
    switchSiteView("home");
  }

  setTimeout(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const parentGroup = el.closest(".academy-group");
    if (parentGroup) {
      toggleAcademyGroup(parentGroup, true);
    }

    if (el.hidden) el.hidden = false;
    if (el.tagName === "DETAILS") el.open = true;

    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, parentGroup ? 220 : 20);
  }, 60);
}

/* ---------- Event Delegation سراسری برای تمام کلیدها و تب‌ها ---------- */
document.addEventListener("click", (e) => {
  // ۱. دسته‌بندی‌های بازشونده آکادمی
  const academyTrigger = e.target.closest(".academy-group-trigger");
  if (academyTrigger) {
    e.preventDefault();
    toggleAcademyGroup(academyTrigger.closest(".academy-group"));
    return;
  }

  // ۲. کلیدهای باز/بسته کردن والهالا بات
  const aiTrigger = e.target.closest("#navAiBtn, #aiFab, #mobileAiBtn, [data-ai-open], .ai-fab");
  if (aiTrigger) {
    e.preventDefault();
    e.stopPropagation();
    const mobileMenu = document.getElementById("mobileMenu") || document.querySelector(".mobile-menu");
    if (mobileMenu) {
      mobileMenu.hidden = true;
      mobileMenu.classList.remove("open");
    }
    setAiDrawerState();
    return;
  }

  // ۳. بستن پنل والهالا بات
  if (e.target.closest("#aiCloseBtn, [data-ai-close]")) {
    e.preventDefault();
    setAiDrawerState(false);
    return;
  }

  // ۴. تغییر اسکین ربات سه‌بعدی
  if (e.target.closest("#switchSkinBtn, [data-switch-skin]")) {
    currentSkinIndex = (currentSkinIndex + 1) % BOT_SKINS.length;
    const viewer = document.getElementById("valhallaBotViewer") || document.querySelector("model-viewer");
    if (viewer) viewer.setAttribute("src", BOT_SKINS[currentSkinIndex]);
    return;
  }

  // ۵. سوالات آماده داخل چت
  const promptChip = e.target.closest(".ai-prompt-chip");
  if (promptChip) {
    const prompt = promptChip.dataset.prompt || promptChip.textContent.trim();
    if (prompt) sendToValhallaAI(prompt);
    return;
  }

  // ۶. منوی موبایل
  const mobileToggle = e.target.closest("#mobileToggle, .mobile-toggle");
  if (mobileToggle) {
    const mobileMenu = document.getElementById("mobileMenu") || document.querySelector(".mobile-menu");
    if (mobileMenu) {
      const nextOpen = mobileMenu.hidden || !mobileMenu.classList.contains("open");
      mobileMenu.hidden = !nextOpen;
      mobileMenu.classList.toggle("open", nextOpen);
      mobileToggle.setAttribute("aria-expanded", String(nextOpen));
    }
    return;
  }

  if (e.target.closest(".mobile-link")) {
    const mobileMenu = document.getElementById("mobileMenu") || document.querySelector(".mobile-menu");
    const toggle = document.getElementById("mobileToggle") || document.querySelector(".mobile-toggle");
    if (mobileMenu) {
      mobileMenu.hidden = true;
      mobileMenu.classList.remove("open");
    }
    toggle?.setAttribute("aria-expanded", "false");
  }

  // ۷. جست‌وجوی سریع
  const searchToggle = e.target.closest("#searchToggle, [data-search-toggle], .btn-icon");
  if (
    searchToggle &&
    (searchToggle.id === "searchToggle" ||
      searchToggle.hasAttribute("data-search-toggle") ||
      searchToggle.getAttribute("aria-controls")?.includes("search"))
  ) {
    e.preventDefault();
    toggleQuickSearch();
    return;
  }

  if (e.target.closest(".search-close")) {
    e.preventDefault();
    toggleQuickSearch(false);
    return;
  }

  const searchResultBtn = e.target.closest(".search-result");
  if (searchResultBtn) {
    navigateToSearchResult(searchResultBtn);
    return;
  }

  const quickSearch = document.getElementById("quickSearch") || document.querySelector(".quick-search");
  if (quickSearch && !quickSearch.hidden && !e.target.closest(".quick-search, #searchToggle, [data-search-toggle], .btn-icon")) {
    toggleQuickSearch(false);
  }

  // ۸. تب‌های سیم‌کارت فیزیکی
  const simTab = e.target.closest(".sim-tab");
  if (simTab) {
    e.preventDefault();
    activateSimTab(simTab);
    return;
  }

  // ۹. جابه‌جایی به نمای راهنمای VPN و بازگشت به صفحه اصلی
  const vpnLink = e.target.closest('.vpn-tab, [data-open-view="vpn-guide"], a[href="#vpn-guide"]');
  if (vpnLink) {
    const vpnView = document.getElementById("vpn-guide") || document.querySelector('[data-view="vpn-guide"]');
    const homeView = document.getElementById("home-view") || document.getElementById("main-view") || document.querySelector('[data-view="home"]');
    if (vpnView && homeView) {
      e.preventDefault();
      switchSiteView("vpn-guide");
      history.replaceState(null, "", "#vpn-guide");
      return;
    }
  }

  const homeLink = e.target.closest('[data-open-view="home"], .guide-back, .brand, .top-nav a[href^="#"], .mobile-link[href^="#"], .quick-pill[href^="#"], .footer-col a[href^="#"]');
  if (homeLink) {
    const href = homeLink.getAttribute("href") || "";
    if (href !== "#vpn-guide") {
      const vpnView = document.getElementById("vpn-guide") || document.querySelector('[data-view="vpn-guide"]');
      const homeView = document.getElementById("home-view") || document.getElementById("main-view") || document.querySelector('[data-view="home"]');
      if (vpnView && homeView && !vpnView.hidden) {
        e.preventDefault();
        const targetId = href.startsWith("#") ? href.slice(1) : null;
        switchSiteView("home", targetId);
        if (href.startsWith("#")) history.replaceState(null, "", href);
        return;
      }
    }
  }

  // ۱۰. انتخاب سرویس (V2Ray / WireGuard)
  const serviceCard = e.target.closest(".service-card[data-service]");
  if (serviceCard) {
    document.querySelectorAll(".service-card[data-service]").forEach((c) => {
      const selected = c === serviceCard;
      c.classList.toggle("is-selected", selected);
      c.setAttribute("aria-pressed", String(selected));
    });
    currentVpnService = serviceCard.dataset.service;
    renderVpnGuidePanel();
    return;
  }

  // ۱۱. انتخاب پلتفرم در راهنمای VPN
  const platformTab = e.target.closest(".platform-tab");
  if (platformTab) {
    document.querySelectorAll(".platform-tab").forEach((t) => {
      const active = t === platformTab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
    });
    currentVpnPlatform = platformTab.dataset.platform || platformTab.dataset.os || "android";
    renderVpnGuidePanel();
  }
});

/* ---------- ارسال فرم چت با Event Delegation (سازگار با پنل داینامیک) ---------- */
document.addEventListener("submit", (e) => {
  const aiForm = e.target.closest("#aiForm, .ai-input-row");
  if (!aiForm) return;
  e.preventDefault();
  const input = document.getElementById("aiInput") || aiForm.querySelector("input");
  const val = input?.value.trim();
  if (val) sendToValhallaAI(val);
});

/* ---------- راه‌اندازی اولیه ---------- */
function initValhallaApp() {
  document.querySelectorAll(".brand-logo").forEach((img) => makeLogoTransparent(img));

  syncPodcastPlayerTheme();
  ensureValhallaBotUI();
  initAcademyAccordion();
  buildSearchIndex();

  const searchInput = document.querySelector(".quick-search input");
  searchInput?.addEventListener("input", (e) => {
    renderSearchResults(e.target.value);
  });

  searchInput?.addEventListener("keydown", (e) => {
    const items = Array.from(document.querySelectorAll(".search-result"));
    if (e.key === "Escape") {
      toggleQuickSearch(false);
      return;
    }
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeSearchIdx = (activeSearchIdx + 1) % items.length;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeSearchIdx = (activeSearchIdx - 1 + items.length) % items.length;
    } else if (e.key === "Enter" && activeSearchIdx >= 0) {
      e.preventDefault();
      navigateToSearchResult(items[activeSearchIdx]);
      return;
    } else {
      return;
    }

    items.forEach((btn, idx) => {
      btn.setAttribute("aria-selected", String(idx === activeSearchIdx));
      if (idx === activeSearchIdx) btn.scrollIntoView({ block: "nearest" });
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      toggleQuickSearch(false);
      setAiDrawerState(false);
    }
  });

  document.querySelectorAll(".pdf-reader").forEach((details) => {
    details.addEventListener("toggle", () => {
      if (!details.open) return;
      const iframe = details.querySelector("iframe[data-src]");
      if (iframe && !iframe.getAttribute("src")) {
        iframe.setAttribute("src", iframe.dataset.src);
      }
    });
  });

  renderVpnGuidePanel();
  if (window.location.hash === "#vpn-guide") {
    switchSiteView("vpn-guide");
  }
}

window.addEventListener("hashchange", () => {
  if (window.location.hash === "#vpn-guide") {
    switchSiteView("vpn-guide");
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initValhallaApp);
} else {
  initValhallaApp();
}
