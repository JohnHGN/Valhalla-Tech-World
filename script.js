/* =========================================================
   Valhalla Tech World — Interactive Logic & AI Assistant
   ========================================================= */

const WORKER_URL = "https://valhalla-gemini-proxy.knjhgbtbp9.workers.dev";

/* ---------- ۱. داده‌های تب‌های ویترین اصلی (سبک Phoenix Guardian توییک‌فا) ---------- */
const SHOWCASE_DATA = {
  guard: {
    badge: "سرویس پرچم‌دار والهالا",
    title: "والهالا گارد؛ اتصال آزاد، سریع و بدون دردسر",
    desc: "سرویس اختصاصی با لینک اشتراک خودکار (Subscription) که بدون نیاز به تغییر دستی کانفیگ، روی تمام اپراتورهای ایران پایدار می‌مونه.",
    ctaText: "دریافت اشتراک از ربات گارد",
    ctaHref: "https://t.me/ValhallaGuard_bot",
    features: [
      { text: "پشتیبانی هم‌زمان از پروتکل‌های V2Ray و WireGuard", tag: "اختصاصی", type: "pro" },
      { text: "لینک اشتراک هوشمند با آپدیت خودکار سرورها", tag: "رایگان با پلن", type: "free" },
      { text: "سرورهای کم‌پینگ مخصوص گیمینگ، استریم و هوش مصنوعی", tag: "اختصاصی", type: "pro" },
      { text: "تحویل آنی و تمدید خودکار در ربات تلگرام", tag: "۲۴ ساعته", type: "free" }
    ],
    visual: {
      header: "Valhalla Guard — Live Status",
      status: "Connected • Auto-Sub",
      stats: [
        { label: "پایداری سرورها", value: "99.8%", accent: true },
        { label: "میانگین پینگ گیم", value: "44 ms", accent: true }
      ],
      rows: [
        { label: "پروتکل فعال", value: "VLESS Reality / WG" },
        { label: "به‌روزرسانی پروفایل", value: "Auto-Sync" },
        { label: "دستگاه‌های سازگار", value: "Win / Mac / iOS / Android" }
      ]
    }
  },
  apps: {
    badge: "سازگار با همه دستگاه‌ها",
    title: "اتصال ساده روی موبایل و دسکتاپ بدون شلوغی",
    desc: "فقط یک‌بار لینک اشتراک والهالا گارد رو وارد اپلیکیشن پیشنهادی سیستم‌عاملت کن و هر زمان خواستی با یک کلیک وصل شو.",
    ctaText: "مشاهده راهنمای ۳ مرحله‌ای",
    ctaHref: "#guide",
    features: [
      { text: "سازگاری کامل با v2rayNG و Hiddify در اندروید", tag: "Android", type: "free" },
      { text: "پشتیبانی از Streisand و V2Box روی آیفون و آیپد", tag: "iOS", type: "free" },
      { text: "کلاینت‌های سبک ویندوز و مک‌او‌اس (اپل سیلیکون و اینتل)", tag: "Desktop", type: "pro" },
      { text: "تست پینگ خودکار برای انتخاب سریع‌ترین لوکیشن", tag: "هوشمند", type: "pro" }
    ],
    visual: {
      header: "Multi-Platform Sync",
      status: "4 OS Supported",
      stats: [
        { label: "زمان راه‌اندازی اولیه", value: "کمتر از ۱ دقیقه", accent: true },
        { label: "تنظیم دستی موردنیاز", value: "صفر", accent: false }
      ],
      rows: [
        { label: "اندروید", value: "v2rayNG / Hiddify" },
        { label: "آیفون و مک", value: "Streisand / V2Box" },
        { label: "ویندوز", value: "Hiddify / v2rayN" }
      ]
    }
  },
  digital: {
    badge: "خدمات دیجیتال و هویت بین‌المللی",
    title: "اپل‌آیدی، شماره مجازی و سیم‌کارت بین‌المللی",
    desc: "دسترسی امن و قانونی به سرویس‌های جهانی بدون ریسک بلاک شدن؛ از اپل‌آیدی اختصاصی تا سیم‌کارت فیزیکی بین‌المللی.",
    ctaText: "سفارش از پشتیبانی والهالا",
    ctaHref: "https://t.me/Valhalla_Guard",
    features: [
      { text: "ساخت اپل‌آیدی وریفای‌شده با ایمیل و اطلاعات شخصی خودت", tag: "تضمینی", type: "pro" },
      { text: "سیم‌کارت فیزیکی بین‌المللی با آنتن‌دهی و دریافت SMS در ایران", tag: "اختصاصی", type: "pro" },
      { text: "شماره مجازی اختصاصی برای سرویس‌های هوش مصنوعی و شبکه‌ها", tag: "تحویل فوری", type: "free" },
      { text: "تهیه و فعال‌سازی اکانت‌های پرمیوم کاربردی", tag: "پشتیبانی مستقیم", type: "free" }
    ],
    visual: {
      header: "Valhalla Digital Services",
      status: "Verified Delivery",
      stats: [
        { label: "تحویل سرویس‌های دیجیتال", value: "آنی و مستقیم", accent: true },
        { label: "مالکیت اکانت", value: "۱۰۰٪ اختصاصی", accent: true }
      ],
      rows: [
        { label: "Apple ID", value: "Personal & Verified" },
        { label: "International SIM", value: "Physical Delivery" },
        { label: "پشتیبانی سفارش", value: "@Valhalla_Guard" }
      ]
    }
  },
  hardware: {
    badge: "مهندسی سخت‌افزار و سیستم",
    title: "تعمیرات تخصصی، مشاوره خرید و بهینه‌سازی سیستم",
    desc: "اگر سیستم یا لپ‌تاپت دچار ایراد سخت‌افزاری شده یا قصد خرید و ارتقای هوشمندانه داری، بدون تعصب فروشگاهی کنارتیم.",
    ctaText: "درخواست مشاوره یا عیب‌یابی",
    ctaHref: "https://t.me/Valhalla_Guard",
    features: [
      { text: "عیب‌یابی و تعمیر تخصصی مادربرد لپ‌تاپ و سیستم دسکتاپ", tag: "تخصصی", type: "pro" },
      { text: "مشاوره بی‌طرفانه انتخاب قطعات و بستن سیستم متناسب با بودجه", tag: "بر اساس تست", type: "pro" },
      { text: "بهینه‌سازی ویندوز ۱۱ و macOS برای گیمینگ و کار حرفه‌ای", tag: "کاربردی", type: "free" },
      { text: "آموزش‌های مستمر نرم‌افزار و سخت‌افزار در کانال والهالا", tag: "رایگان", type: "free" }
    ],
    visual: {
      header: "Hardware & System Lab",
      status: "Diagnostics Ready",
      stats: [
        { label: "رویکرد مشاوره", value: "کاملاً بی‌طرف", accent: true },
        { label: "پشتیبانی سیستم‌عامل", value: "Windows & macOS", accent: false }
      ],
      rows: [
        { label: "تعمیرات لپ‌تاپ و PC", value: "Board-Level" },
        { label: "بهینه‌سازی و تیون", value: "OS & Thermal" },
        { label: "آکادمی والهالا", value: "@valhala_tw" }
      ]
    }
  }
};

/* ---------- ۲. داده‌های ویجت مقایسه قبل و بعد (سبک Undervolt توییک‌فا) ---------- */
const COMPARE_DATA = {
  gaming: {
    note: "تست روی سرورهای بهینه‌سازی‌شده گیمینگ والهالا گارد",
    highlights: [
      { label: "کاهش پینگ", value: "۴۶ms کمتر" },
      { label: "پکت‌لاس", value: "۰٪ افت بسته" },
      { label: "ثبات اتصال", value: "کاملاً یکنواخت" }
    ],
    before: [
      { label: "پینگ در بازی آنلاین", valueText: "118 ms (نوسان بالا)", percent: 86, status: "bad" },
      { label: "پایداری اتصال (Uptime)", valueText: "58٪", percent: 58, status: "bad" },
      { label: "بهره‌وری پهنای باند", valueText: "42٪", percent: 42, status: "bad" }
    ],
    after: [
      { label: "پینگ در بازی آنلاین", valueText: "72 ms (ثابت)", percent: 36, status: "good" },
      { label: "پایداری اتصال (Uptime)", valueText: "99.8٪", percent: 99, status: "good" },
      { label: "بهره‌وری پهنای باند", valueText: "96٪", percent: 96, status: "good" }
    ]
  },
  stream: {
    note: "پخش بدون بافر یوتیوب 4K و سرویس‌های استریم",
    highlights: [
      { label: "سرعت دانلود", value: "۲.۸ برابر بیشتر" },
      { label: "توقف و بافر", value: "صفر" },
      { label: "کیفیت پخش", value: "4K 60fps" }
    ],
    before: [
      { label: "تأخیر شروع ویدیو", valueText: "6.4 ثانیه", percent: 82, status: "bad" },
      { label: "ثبات بیت‌ریت 4K", valueText: "38٪", percent: 38, status: "bad" },
      { label: "سرعت واقعی اتصال", valueText: "34٪ از خط", percent: 34, status: "bad" }
    ],
    after: [
      { label: "تأخیر شروع ویدیو", valueText: "0.9 ثانیه", percent: 18, status: "good" },
      { label: "ثبات بیت‌ریت 4K", valueText: "98٪", percent: 98, status: "good" },
      { label: "سرعت واقعی اتصال", valueText: "95٪ از خط", percent: 95, status: "good" }
    ]
  },
  ai: {
    note: "دسترسی سریع و بدون خطای لوکیشن به سرویس‌های هوش مصنوعی",
    highlights: [
      { label: "آی‌پی تمیز", value: "بدون کپچا" },
      { label: "سرعت پاسخ‌دهی", value: "آنی" },
      { label: "سازگاری سرویس‌ها", value: "۱۰۰٪" }
    ],
    before: [
      { label: "خطای محدودیت و کپچا", valueText: "مکرر", percent: 88, status: "bad" },
      { label: "پایداری سشن‌های طولانی", valueText: "49٪", percent: 49, status: "bad" },
      { label: "سرعت بارگذاری صفحات", valueText: "45٪", percent: 45, status: "bad" }
    ],
    after: [
      { label: "خطای محدودیت و کپچا", valueText: "نزدیک به صفر", percent: 10, status: "good" },
      { label: "پایداری سشن‌های طولانی", valueText: "99.5٪", percent: 99, status: "good" },
      { label: "سرعت بارگذاری صفحات", valueText: "97٪", percent: 97, status: "good" }
    ]
  },
  trade: {
    note: "پروفایل اختصاصی با ثبات مسیر و امنیت رمزنگاری‌شده",
    highlights: [
      { label: "امنیت تونل", value: "رمزنگاری مدرن" },
      { label: "ثبات لوکیشن", value: "پایدار" },
      { label: "قطعی ناگهانی", value: "حداقل ممکن" }
    ],
    before: [
      { label: "ریسک تغییر ناگهانی IP", valueText: "بالا", percent: 85, status: "bad" },
      { label: "پایداری اتصال ممتد", valueText: "54٪", percent: 54, status: "bad" },
      { label: "سرعت باز شدن پلتفرم‌ها", valueText: "50٪", percent: 50, status: "bad" }
    ],
    after: [
      { label: "ریسک تغییر ناگهانی IP", valueText: "بسیار پایین", percent: 12, status: "good" },
      { label: "پایداری اتصال ممتد", valueText: "99.7٪", percent: 99, status: "good" },
      { label: "سرعت باز شدن پلتفرم‌ها", valueText: "96٪", percent: 96, status: "good" }
    ]
  }
};

/* ---------- ۳. داده‌های راهنمای ۳ مرحله‌ای اتصال ---------- */
const GUIDE_DATA = {
  android: {
    apps: [
      { name: "v2rayNG (پیشنهادی)", recommended: true },
      { name: "Hiddify", recommended: false },
      { name: "WireGuard", recommended: false }
    ],
    steps: [
      {
        num: "01",
        title: "دریافت لینک اشتراک",
        desc: "وارد ربات @ValhallaGuard_bot بشو و لینک اشتراک اختصاصی (Subscription) خودت رو کپی کن."
      },
      {
        num: "02",
        title: "نصب و ایمپورت در v2rayNG",
        desc: "اپلیکیشن v2rayNG رو باز کن، از منوی بالا بخش Subscription Setting رو بزن، با علامت + لینک رو وارد و ذخیره کن."
      },
      {
        num: "03",
        title: "آپدیت و اتصال یک‌کلیکه",
        desc: "در صفحه اصلی از منوی سه‌نقطه گزینه Update Subscription رو بزن، یکی از سرورها رو انتخاب کن و دکمه اتصال رو لمس کن."
      }
    ]
  },
  ios: {
    apps: [
      { name: "Streisand (پیشنهادی)", recommended: true },
      { name: "V2Box", recommended: false },
      { name: "WireGuard", recommended: false }
    ],
    steps: [
      {
        num: "01",
        title: "کپی کردن لینک اشتراک",
        desc: "لینک اشتراک اختصاصی خودت رو از ربات @ValhallaGuard_bot کپی کن (در صورت نیاز به اپل‌آیدی با پشتیبانی در ارتباط باش)."
      },
      {
        num: "02",
        title: "افزودن لینک در Streisand",
        desc: "اپلیکیشن Streisand رو از App Store نصب کن، علامت + بالا رو بزن و گزینه Import from Clipboard رو انتخاب کن."
      },
      {
        num: "03",
        title: "تست پینگ و اتصال",
        desc: "روی نام اشتراک ضربه بزن تا سرورها آپدیت بشن، سپس دکمه اتصال بالای صفحه رو روشن کن و مجوز VPN رو تایید کن."
      }
    ]
  },
  windows: {
    apps: [
      { name: "Hiddify (پیشنهادی)", recommended: true },
      { name: "v2rayN", recommended: false },
      { name: "WireGuard", recommended: false }
    ],
    steps: [
      {
        num: "01",
        title: "کپی لینک اشتراک",
        desc: "لینک اختصاصی اشتراک والهالا گارد رو از ربات تلگرام @ValhallaGuard_bot کپی کن."
      },
      {
        num: "02",
        title: "اضافه کردن پروفایل در Hiddify",
        desc: "برنامه Hiddify رو اجرا کن، روی دکمه New Profile کلیک کن و گزینه Add from Clipboard رو بزن."
      },
      {
        num: "03",
        title: "اتصال و انتخاب حالت سیستم",
        desc: "دکمه بزرگ Connect وسط صفحه رو بزن تا کل سیستم (مرورگر و اپ‌ها) به اینترنت پایدار متصل بشن."
      }
    ]
  },
  macos: {
    apps: [
      { name: "Hiddify / V2Box (پیشنهادی)", recommended: true },
      { name: "Streisand (اپل سیلیکون)", recommended: false },
      { name: "WireGuard", recommended: false }
    ],
    steps: [
      {
        num: "01",
        title: "دریافت لینک اشتراک",
        desc: "لینک اشتراک اختصاصی خودت رو از ربات @ValhallaGuard_bot کپی کن."
      },
      {
        num: "02",
        title: "ایمپورت در کلاینت مک",
        desc: "برنامه Hiddify یا V2Box رو روی مک اجرا کن و لینک کپی‌شده رو از بخش Import / Add Profile وارد کن."
      },
      {
        num: "03",
        title: "تایید دسترسی و اتصال",
        desc: "دکمه اتصال رو بزن و در اولین اجرا مجوز شبکه مک‌او‌اس (System Proxy / VPN) رو تایید کن."
      }
    ]
  }
};

/* ---------- رندر بخش ویترین تب‌ها ---------- */
function renderShowcase(key) {
  const data = SHOWCASE_DATA[key];
  if (!data) return;

  const infoEl = document.getElementById("showcaseInfo");
  const visualEl = document.getElementById("showcaseVisual");

  const isExternal = data.ctaHref.startsWith("http");
  const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : "";

  infoEl.innerHTML = `
    <span class="showcase-badge">${data.badge}</span>
    <h3>${data.title}</h3>
    <p>${data.desc}</p>
    <ul class="feature-list">
      ${data.features
        .map(
          (f) => `
        <li>
          <span class="feature-list-text">
            <span class="check-mark">${f.type === "pro" ? "✦" : "✓"}</span>
            <span>${f.text}</span>
          </span>
          <span class="tier-tag ${f.type}">${f.tag}</span>
        </li>`
        )
        .join("")}
    </ul>
    <a href="${data.ctaHref}" ${targetAttr} class="btn btn-primary">${data.ctaText}</a>
  `;

  visualEl.innerHTML = `
    <div class="visual-panel">
      <div class="visual-top">
        <span class="visual-top-title">
          <span class="status-dot"></span>
          <span>${data.visual.header}</span>
        </span>
        <span>${data.visual.status}</span>
      </div>
      <div class="visual-stats">
        ${data.visual.stats
          .map(
            (s) => `
          <div class="v-stat">
            <span class="v-stat-label">${s.label}</span>
            <span class="v-stat-value ${s.accent ? "accent" : ""}">${s.value}</span>
          </div>`
          )
          .join("")}
      </div>
      <div class="visual-rows">
        ${data.visual.rows
          .map(
            (r) => `
          <div class="v-row">
            <span>${r.label}</span>
            <span>${r.value}</span>
          </div>`
          )
          .join("")}
      </div>
    </div>
  `;
}

/* ---------- رندر بخش مقایسه قبل و بعد ---------- */
let currentProfile = "gaming";
let currentMode = "after";

function renderCompare() {
  const profile = COMPARE_DATA[currentProfile];
  if (!profile) return;

  const highlightsEl = document.getElementById("compareHighlights");
  const noteEl = document.getElementById("compareNote");
  const metricsEl = document.getElementById("metricsGrid");

  highlightsEl.innerHTML = profile.highlights
    .map(
      (h) => `
    <div class="highlight-box">
      <span>${h.label}</span>
      <strong>${h.value}</strong>
    </div>`
    )
    .join("");

  noteEl.textContent = profile.note;

  const list = profile[currentMode];
  metricsEl.innerHTML = list
    .map(
      (m) => `
    <div class="metric-row">
      <div class="metric-header">
        <span>${m.label}</span>
        <strong>${m.valueText}</strong>
      </div>
      <div class="metric-track">
        <div class="metric-fill ${m.status}" style="width: ${m.percent}%"></div>
      </div>
    </div>`
    )
    .join("");
}

/* ---------- رندر راهنمای ۳ مرحله‌ای اتصال ---------- */
function renderGuide(os) {
  const data = GUIDE_DATA[os];
  if (!data) return;

  const appsBar = document.getElementById("guideAppsBar");
  const stepsGrid = document.getElementById("stepsGrid");

  appsBar.innerHTML = `
    <span class="guide-apps-title">اپلیکیشن‌های پیشنهادی برای این سیستم‌عامل:</span>
    <div class="guide-app-badges">
      ${data.apps
        .map(
          (app) =>
            `<span class="app-badge ${app.recommended ? "recommended" : ""}">${app.name}</span>`
        )
        .join("")}
    </div>
  `;

  stepsGrid.innerHTML = data.steps
    .map(
      (s) => `
    <div class="step-card">
      <span class="step-num">${s.num}</span>
      <h4>${s.title}</h4>
      <p>${s.desc}</p>
    </div>`
    )
    .join("");
}

/* ---------- مدیریت دستیار هوشمند والهالا (Cloudflare Worker + 3D Bot) ---------- */
const BOT_SKINS = ["valhalla-bot.glb", "valhalla_bot_2.glb"];
let currentSkinIndex = 0;
let chatHistory = [];

function appendMessage(text, role) {
  const container = document.getElementById("aiMessages");
  const div = document.createElement("div");
  div.className = `ai-msg ${role}`;
  div.textContent = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

async function sendToValhallaAI(userText) {
  const sendBtn = document.getElementById("aiSendBtn");
  const input = document.getElementById("aiInput");

  appendMessage(userText, "user");
  const loadingMsg = appendMessage("در حال بررسی و پاسخ‌گویی...", "bot");

  input.value = "";
  sendBtn.disabled = true;

  const systemInstruction =
    "تو دستیار هوشمند رسمی سایت والهالا تک‌ورلد (Valhalla Tech World) هستی. کوتاه، دقیق، محترمانه و به زبان فارسی پاسخ بده. کانال تلگرام: @valhala_tw، پشتیبانی: @Valhalla_Guard، ربات اشتراک والهالا گارد: @ValhallaGuard_bot، اینستاگرام: @Valhala_tw.";

  chatHistory.push({ role: "user", parts: [{ text: userText }] });

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: chatHistory.slice(-8)
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.reply ||
      data?.text ||
      "پاسخی دریافت نشد. لطفاً دوباره امتحان کن یا به پشتیبانی @Valhalla_Guard پیام بده.";

    loadingMsg.textContent = reply;
    chatHistory.push({ role: "model", parts: [{ text: reply }] });
  } catch (err) {
    loadingMsg.textContent =
      "در حال حاضر ارتباط با سرور هوش مصنوعی برقرار نشد. می‌تونی مستقیماً از طریق تلگرام @Valhalla_Guard یا ربات @ValhallaGuard_bot راهنمایی بگیری.";
  } finally {
    sendBtn.disabled = false;
    input.focus();
  }
}

/* ---------- راه‌اندازی اولیه صفحه و رویدادها ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // رندر اولیه بخش‌های پویا
  renderShowcase("guard");
  renderCompare();
  renderGuide("android");

  // منوی موبایل
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  mobileToggle?.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    mobileToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      mobileToggle.setAttribute("aria-expanded", "false");
    });
  });

  // تب‌های ویترین اصلی
  document.querySelectorAll(".feature-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".feature-tab").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      renderShowcase(btn.dataset.tab);
    });
  });

  // چیپ‌های مقایسه قبل و بعد
  document.querySelectorAll("#profileChips .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("#profileChips .chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentProfile = chip.dataset.profile;
      renderCompare();
    });
  });

  // سوییچ قبل / بعد
  document.querySelectorAll(".seg-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentMode = btn.dataset.mode;
      renderCompare();
    });
  });

  // تب‌های سیستم‌عامل راهنمای اتصال
  document.querySelectorAll(".platform-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".platform-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderGuide(tab.dataset.os);
    });
  });

  // آکاردئون سوالات پرتکرار
  document.querySelectorAll(".faq-q").forEach((qBtn) => {
    qBtn.addEventListener("click", () => {
      const item = qBtn.closest(".faq-item");
      const answer = item.querySelector(".faq-a");
      const isOpen = item.classList.contains("open");

      document.querySelectorAll(".faq-item").forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        other.querySelector(".faq-a").style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("open");
        qBtn.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  // باز و بسته کردن دستیار هوشمند
  const aiFab = document.getElementById("aiFab");
  const navAiBtn = document.getElementById("navAiBtn");
  const aiDrawer = document.getElementById("aiDrawer");
  const aiCloseBtn = document.getElementById("aiCloseBtn");

  function toggleAiDrawer(forceOpen) {
    const nextState = typeof forceOpen === "boolean" ? forceOpen : !aiDrawer.classList.contains("open");
    aiDrawer.classList.toggle("open", nextState);
    aiDrawer.setAttribute("aria-hidden", String(!nextState));
    if (nextState) {
      setTimeout(() => document.getElementById("aiInput")?.focus(), 180);
    }
  }

  aiFab?.addEventListener("click", () => toggleAiDrawer());
  navAiBtn?.addEventListener("click", () => toggleAiDrawer(true));
  aiCloseBtn?.addEventListener("click", () => toggleAiDrawer(false));

  // تغییر اسکین مدل سه‌بعدی دستیار
  const switchSkinBtn = document.getElementById("switchSkinBtn");
  const botViewer = document.getElementById("valhallaBotViewer");
  switchSkinBtn?.addEventListener("click", () => {
    currentSkinIndex = (currentSkinIndex + 1) % BOT_SKINS.length;
    if (botViewer) {
      botViewer.setAttribute("src", BOT_SKINS[currentSkinIndex]);
    }
  });

  // ارسال فرم چت و دکمه‌های سوال آماده
  const aiForm = document.getElementById("aiForm");
  aiForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = document.getElementById("aiInput").value.trim();
    if (val) sendToValhallaAI(val);
  });

  document.querySelectorAll(".ai-prompt-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const prompt = chip.dataset.prompt;
      if (prompt) sendToValhallaAI(prompt);
    });
  });
});
      steps: [
        ["برنامه را نصب کن", "Hiddify را از صفحهٔ رسمی نصب برنامه باز کن و نسخهٔ App Store را انتخاب کن."],
        ["لینک اشتراک را کپی کن", "لینک Subscription را از پیام سرویس خودت کامل کپی کن."],
        ["اشتراک را اضافه کن", "در Hiddify روی افزودن کانفیگ بزن و لینک را وارد کن؛ اگر گزینهٔ Import from clipboard دیده شد، می‌توانی از آن استفاده کنی."],
        ["فهرست سرورها را تازه کن", "در صورت نیاز Refresh یا Update را بزن."],
        ["سرور را انتخاب و وصل شو", "سرور دلخواه را انتخاب کن و اتصال را روشن کن. درخواست افزودن VPN configuration باید از طرف Hiddify باشد."],
      ],
      callout: "دسترسی برنامه در App Store ممکن است با کشور Apple ID تغییر کند. راهنمای رسمی Hiddify روش‌های نصب دستگاهت را نشان می‌دهد.",
    },
    windows: {
      title: "راه‌اندازی روی Windows",
      steps: [
        ["کلاینت را نصب کن", "Hiddify را از راهنمای نصب رسمی، یا v2rayN را از صفحهٔ انتشارهای رسمی دریافت کن."],
        ["لینک اشتراک را کپی کن", "Subscription Link را از پیام سرویس خودت کامل کپی کن."],
        ["اشتراک را وارد کن", "در Hiddify گزینهٔ افزودن کانفیگ را انتخاب کن؛ در v2rayN از گزینهٔ افزودن پروفایل اشتراک استفاده کن و لینک را Paste کن."],
        ["سرورها را به‌روز کن", "Update یا Refresh را بزن و منتظر بمان تا فهرست سرورها ظاهر شود."],
        ["اتصال را روشن کن", "سرور موردنظر را انتخاب و اتصال را فعال کن. اگر برنامه درخواست دسترسی شبکه داد، ناشر و منبع نصب را بررسی کن."],
      ],
      callout: "v2rayN و Hiddify ممکن است در نسخه‌های مختلف نام دکمه‌ها را تغییر دهند؛ راهنمای رسمی هر برنامه مرجع مراحل همان نسخه است.",
    },
    mac: {
      title: "راه‌اندازی روی macOS",
      steps: [
        ["Hiddify را نصب کن", "راهنمای نصب رسمی را باز کن و نسخهٔ مناسب macOS را دریافت کن."],
        ["لینک اشتراک را کپی کن", "لینک Subscription را از پیام سرویس خودت کامل کپی کن."],
        ["اشتراک را اضافه کن", "در Hiddify گزینهٔ افزودن کانفیگ را انتخاب کن و لینک را وارد کن."],
        ["فهرست سرورها را تازه کن", "اگر لازم بود Update یا Refresh را بزن تا سرورها بارگذاری شوند."],
        ["سرور را انتخاب و وصل شو", "سرور دلخواه را انتخاب کن و اتصال را روشن کن؛ مجوز VPN را فقط برای برنامهٔ نصب‌شده از منبع رسمی تأیید کن."],
      ],
      callout: "کانال مجموعه macOS را در فهرست دستگاه‌های پشتیبانی‌شده آورده است؛ راهنمای رسمی Hiddify مراحل نسخهٔ فعلی برنامه را نشان می‌دهد.",
    },
  },
  wireguard: {
    android: {
      title: "راه‌اندازی روی اندروید",
      steps: [
        ["WireGuard را نصب کن", "نسخهٔ رسمی WireGuard را از پیوند بالا برای Android دریافت کن."],
        ["فایل کانفیگ را بگیر", "فایل ZIP کانفیگ‌های WireGuard را از پیام سرویس خودت دانلود کن."],
        ["فایل را وارد کن", "در برنامه روی + بزن و Import from file or archive را انتخاب کن."],
        ["فایل ZIP را انتخاب کن", "ZIP دانلودشده را انتخاب کن تا تونل‌های داخل آن به برنامه اضافه شوند."],
        ["یک تونل را فعال کن", "یکی از لوکیشن‌ها را انتخاب و کلید اتصال را روشن کن."],
      ],
      callout: "فایل ZIP و پروفایل‌های WireGuard را خصوصی نگه دار؛ آن‌ها دسترسی اتصال سرویس را فراهم می‌کنند.",
    },
    ios: {
      title: "راه‌اندازی روی iPhone / iOS",
      steps: [
        ["WireGuard را نصب کن", "نسخهٔ رسمی WireGuard را از پیوند بالا برای iPhone / iOS دریافت کن."],
        ["فایل ZIP را دانلود کن", "فایل کانفیگ‌های WireGuard را از پیام سرویس خودت روی دستگاه ذخیره کن."],
        ["فایل را وارد کن", "در WireGuard گزینهٔ Add a Tunnel و سپس Create from file or archive را بزن."],
        ["ZIP را انتخاب کن", "فایل ZIP دانلودشده را انتخاب کن تا تونل‌های موجود به فهرست اضافه شوند."],
        ["تونل را روشن کن", "لوکیشن دلخواه را انتخاب و کلید Tunnel را روشن کن."],
      ],
      callout: "اگر فایل را از پیام‌رسان باز کرده‌ای، ابتدا آن را در Files ذخیره کن و سپس از داخل WireGuard انتخابش کن.",
    },
    windows: {
      title: "راه‌اندازی روی Windows",
      steps: [
        ["WireGuard را نصب کن", "نسخهٔ رسمی WireGuard برای Windows را از پیوند بالا دریافت کن."],
        ["فایل ZIP را دانلود کن", "روی لینک دریافت یکجای کانفیگ‌ها در پیام سرویس بزن."],
        ["تونل‌ها را وارد کن", "در برنامه گزینهٔ Import tunnel(s) from file را انتخاب کن و فایل ZIP را باز کن."],
        ["سرور را انتخاب کن", "تونل یا لوکیشن دلخواه را در فهرست انتخاب کن."],
        ["اتصال را فعال کن", "روی Activate بزن. برای قطع اتصال، همان تونل را Deactivate کن."],
      ],
      callout: "اگر برنامه فایل ZIP را نپذیرفت، فایل را دوباره دریافت کن و پیام خطا را برای پشتیبانی سرویس بفرست.",
    },
    mac: {
      title: "راه‌اندازی روی macOS",
      steps: [
        ["WireGuard را نصب کن", "صفحهٔ رسمی WireGuard را باز کن و گزینهٔ App Store برای macOS را انتخاب کن."],
        ["فایل کانفیگ را بگیر", "فایل تونل یا کانفیگی را که برای سرویس خودت دریافت کرده‌ای روی Mac ذخیره کن."],
        ["تونل را وارد کن", "در WireGuard گزینهٔ Import tunnel(s) from file را بزن و فایل کانفیگ را انتخاب کن."],
        ["لوکیشن را انتخاب کن", "تونل موردنظر را از فهرست انتخاب کن."],
        ["اتصال را فعال کن", "روی Activate بزن؛ برای قطع اتصال، Deactivate را انتخاب کن."],
      ],
      callout: "اگر کانفیگ را به شکل ZIP دریافت کرده‌ای و برنامه آن را وارد نکرد، از پشتیبانی سرویس راهنمای فرمت مناسب macOS را بگیر.",
    },
  },
};

const serviceNames = { v2ray: "V2RAY", wireguard: "WIREGUARD" };
const platformNames = { android: "ANDROID", ios: "IOS", windows: "WINDOWS", mac: "MACOS" };
const latinPattern = /[A-Za-z0-9]+(?:[ .+/_-]+[A-Za-z0-9]+)*/g;
let activeService = "v2ray";
let activePlatform = "android";

const serviceButtons = [...document.querySelectorAll("[data-service]")];
const platformButtons = [...document.querySelectorAll("[data-platform]")];
const panel = document.querySelector("#guide-panel");
const kicker = document.querySelector("#guide-kicker");
const subtitle = document.querySelector("#guide-subtitle");
const glyph = document.querySelector("#platform-glyph");
const downloadLinks = document.querySelector("#download-links");
const stepsList = document.querySelector("#steps-list");
const callout = document.querySelector("#guide-callout");

function formatMixedText(value) {
  const escaped = value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  return escaped.replace(latinPattern, (latinRun) => `<bdi lang="en">${latinRun}</bdi>`);
}

function tagEnglishRuns(root = document.body) {
  const displaySelectors = "h1, h2, h3, .brand-copy strong, .brand-copy > span, .footer-copy strong, .footer-copy small, .service-text strong, .panel-kicker, .offer-topline, .offer-kicker, .academy-type, .contact-heading .eyebrow, .contact-card strong, .hero-coordinates, .step-count, .step-number, .footer-details";
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!/[A-Za-z0-9]/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
      if (node.parentElement.closest("script, style, noscript, svg, bdi, code, [aria-hidden='true']")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  for (const textNode of textNodes) {
    const value = textNode.nodeValue;
    const runs = [...value.matchAll(/[A-Za-z0-9]+(?:[ .+/_-]+[A-Za-z0-9]+)*/g)];
    if (!runs.length) continue;
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    for (const run of runs) {
      if (run.index > cursor) fragment.append(document.createTextNode(value.slice(cursor, run.index)));
      const bdi = document.createElement("bdi");
      bdi.lang = "en";
      bdi.textContent = run[0];
      if (textNode.parentElement.closest(displaySelectors)) bdi.classList.add("en-display");
      fragment.append(bdi);
      cursor = run.index + run[0].length;
    }
    if (cursor < value.length) fragment.append(document.createTextNode(value.slice(cursor)));
    textNode.replaceWith(fragment);
  }
}

tagEnglishRuns();

function renderGuide() {
  const guide = content[activeService][activePlatform];
  kicker.innerHTML = `${serviceNames[activeService]} <span>·</span> ${platformNames[activePlatform]}`;
  subtitle.textContent = guide.title;
  glyph.innerHTML = document.querySelector(`#tab-${activePlatform} .platform-icon`).innerHTML;
  panel.setAttribute("aria-labelledby", `tab-${activePlatform}`);

  downloadLinks.replaceChildren();
  for (const item of downloads[activeService][activePlatform]) {
    const link = document.createElement("a");
    link.className = "download-link";
    link.href = item.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.innerHTML = `<span>${formatMixedText(item.label)}</span><span aria-hidden="true">↗</span>`;
    downloadLinks.append(link);
  }

  stepsList.replaceChildren();
  guide.steps.forEach(([title, description], index) => {
    const item = document.createElement("li");
    item.className = "step-item";
    item.innerHTML = `<span class="step-number">${String(index + 1).padStart(2, "0")}</span><div><strong>${formatMixedText(title)}</strong><p>${formatMixedText(description)}</p></div>`;
    stepsList.append(item);
  });
  callout.innerHTML = `<span aria-hidden="true">✦</span><p>${formatMixedText(guide.callout)}</p>`;
}

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeService = button.dataset.service;
    serviceButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    renderGuide();
  });
});

platformButtons.forEach((button, index) => {
  button.addEventListener("click", () => selectPlatform(button));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? platformButtons.length - 1 : (index + (event.key === "ArrowLeft" ? 1 : -1) + platformButtons.length) % platformButtons.length;
    selectPlatform(platformButtons[nextIndex]);
    platformButtons[nextIndex].focus();
  });
});

const academyFilters = [...document.querySelectorAll("[data-filter]")];
const academyCards = [...document.querySelectorAll(".academy-card[data-category]")];

academyFilters.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    academyFilters.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    academyCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

const searchToggle = document.querySelector("#search-toggle");
const searchForm = document.querySelector("#site-search");
const searchInput = document.querySelector("#site-search-input");
const searchClose = document.querySelector("#search-close");
const searchResults = document.querySelector("#search-results");
const searchPlatformLabels = { android: "اندروید Android", ios: "آیفون iPhone iOS", windows: "ویندوز Windows", mac: "مک Mac macOS" };
const searchServiceLabels = { v2ray: "V2Ray", wireguard: "WireGuard" };
let searchIndex = [];
let currentSearchResults = [];
let activeSearchIndex = 0;

function normalizeSearch(value) {
  return value.toLocaleLowerCase("fa-IR").replace(/[يى]/g, "ی").replace(/ك/g, "ک").replace(/\u200c/g, " ").replace(/\s+/g, " ").trim();
}

function buildSearchIndex() {
  const records = [];
  for (const [service, platforms] of Object.entries(content)) {
    for (const [platform, guide] of Object.entries(platforms)) {
      const searchable = [searchServiceLabels[service], searchPlatformLabels[platform], guide.title, guide.callout, ...guide.steps.flat()].join(" ");
      records.push({
        title: `${searchServiceLabels[service]} · ${searchPlatformLabels[platform].split(" ")[0]}`,
        detail: guide.title,
        text: normalizeSearch(searchable),
        kind: "guide",
        service,
        platform,
      });
    }
  }

  const targets = document.querySelectorAll(".offer-card, .academy-card, .faq-item, .contact-card, [data-service], [data-platform]");
  for (const target of targets) {
    const title = target.querySelector("h3, summary, .contact-card strong, .service-text strong")?.textContent.trim() || target.textContent.trim();
    const detail = target.querySelector(".offer-description, .academy-card p, .faq-item p, .contact-card small, .service-text span")?.textContent.trim() || "";
    const kind = target.matches(".academy-card") ? "academy"
      : target.matches(".faq-item") ? "faq"
      : target.matches("[data-service]") ? "service"
      : target.matches("[data-platform]") ? "platform"
      : "section";
    records.push({ title, detail, text: normalizeSearch(`${target.textContent} ${target.dataset.category || ""}`), kind, target });
  }
  return records;
}

function setActiveSearchOption(index) {
  activeSearchIndex = Math.max(0, Math.min(index, currentSearchResults.length - 1));
  const options = [...searchResults.querySelectorAll(".search-result")];
  options.forEach((option, optionIndex) => {
    const selected = optionIndex === activeSearchIndex;
    option.setAttribute("aria-selected", String(selected));
    if (selected) {
      searchInput.setAttribute("aria-activedescendant", option.id);
      option.scrollIntoView({ block: "nearest" });
    }
  });
}

function renderSearchResults() {
  searchResults.replaceChildren();
  const query = normalizeSearch(searchInput.value);
  if (!query) {
    const hint = document.createElement("p");
    hint.className = "search-empty";
    hint.textContent = "جست‌وجو کن؛ مثلاً WireGuard، لپ‌تاپ، ویندوز، SSD یا ChatGPT.";
    searchResults.append(hint);
    searchInput.setAttribute("aria-expanded", "false");
    searchInput.removeAttribute("aria-activedescendant");
    currentSearchResults = [];
    return;
  }

  currentSearchResults = searchIndex.filter((record) => record.text.includes(query)).slice(0, 7);
  if (!currentSearchResults.length) {
    const empty = document.createElement("p");
    empty.className = "search-empty";
    empty.textContent = "نتیجه‌ای پیدا نشد؛ عبارت دیگری را امتحان کن.";
    searchResults.append(empty);
    searchInput.setAttribute("aria-expanded", "false");
    searchInput.removeAttribute("aria-activedescendant");
    return;
  }

  activeSearchIndex = 0;
  currentSearchResults.forEach((record, index) => {
    const option = document.createElement("button");
    option.type = "button";
    option.id = `search-result-${index}`;
    option.className = "search-result";
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", String(index === 0));
    const title = document.createElement("strong");
    title.innerHTML = formatMixedText(record.title);
    const detail = document.createElement("small");
    detail.innerHTML = formatMixedText(record.detail || "رفتن به بخش مربوط");
    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    option.append(title, detail, arrow);
    option.addEventListener("click", () => activateSearchResult(record));
    searchResults.append(option);
  });
  searchInput.setAttribute("aria-expanded", "true");
  searchInput.setAttribute("aria-activedescendant", "search-result-0");
}

function closeQuickSearch(restoreFocus = false) {
  searchForm.hidden = true;
  searchToggle.setAttribute("aria-expanded", "false");
  searchInput.setAttribute("aria-expanded", "false");
  searchInput.removeAttribute("aria-activedescendant");
  searchResults.replaceChildren();
  searchInput.value = "";
  currentSearchResults = [];
  if (restoreFocus) searchToggle.focus();
}

function activateSearchResult(record) {
  let destination = record.target;
  if (record.kind === "guide") {
    setPageView("guide");
    serviceButtons.find((button) => button.dataset.service === record.service)?.click();
    platformButtons.find((button) => button.dataset.platform === record.platform)?.click();
    destination = panel;
  } else if (record.kind === "service") {
    setPageView("guide");
    record.target.click();
    destination = panel;
  } else if (record.kind === "platform") {
    setPageView("guide");
    record.target.click();
    destination = panel;
  } else if (record.kind === "faq") {
    setPageView("guide");
    record.target.open = true;
  } else {
    setPageView("home");
    if (record.kind === "academy" && record.target.hidden) {
      academyFilters.find((button) => button.dataset.filter === "all")?.click();
    }
  }
  closeQuickSearch(true);
  destination?.scrollIntoView({ behavior: "smooth", block: "center" });
}

searchIndex = buildSearchIndex();
searchToggle.addEventListener("click", () => {
  if (!searchForm.hidden) {
    closeQuickSearch(true);
    return;
  }
  searchForm.hidden = false;
  searchToggle.setAttribute("aria-expanded", "true");
  renderSearchResults();
  searchInput.focus();
});
searchInput.addEventListener("input", renderSearchResults);
searchClose.addEventListener("click", () => closeQuickSearch(true));
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (currentSearchResults.length) activateSearchResult(currentSearchResults[activeSearchIndex]);
});
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeQuickSearch(true);
  } else if (event.key === "ArrowDown" && currentSearchResults.length) {
    event.preventDefault();
    setActiveSearchOption((activeSearchIndex + 1) % currentSearchResults.length);
  } else if (event.key === "ArrowUp" && currentSearchResults.length) {
    event.preventDefault();
    setActiveSearchOption((activeSearchIndex - 1 + currentSearchResults.length) % currentSearchResults.length);
  } else if (event.key === "Enter" && currentSearchResults.length) {
    event.preventDefault();
    activateSearchResult(currentSearchResults[activeSearchIndex]);
  }
});
document.addEventListener("pointerdown", (event) => {
  if (!searchForm.contains(event.target) && !searchToggle.contains(event.target) && !searchForm.hidden) closeQuickSearch();
});

function selectPlatform(button) {
  activePlatform = button.dataset.platform;
  platformButtons.forEach((item) => {
    const selected = item === button;
    item.classList.toggle("is-active", selected);
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  renderGuide();
}

const guideView = document.querySelector("#vpn-guide");
const homeViews = [...document.querySelectorAll(".home-view")];
const vpnTabLinks = [...document.querySelectorAll("[data-vpn-tab]")];

function setPageView(view) {
  const showGuide = view === "guide";
  guideView.hidden = !showGuide;
  homeViews.forEach((homeView) => { homeView.hidden = showGuide; });
  vpnTabLinks.forEach((link) => link.setAttribute("aria-current", String(showGuide ? "page" : "false")));
  document.body.dataset.currentView = showGuide ? "guide" : "home";
}

function navigateWithinSite(view, hash, target) {
  if (window.location.hash !== hash) window.history.pushState(null, "", hash);
  setPageView(view);
  requestAnimationFrame(() => {
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function restoreViewFromLocation() {
  const hash = window.location.hash;
  const showGuide = hash === "#vpn-guide" || hash === "#help";
  setPageView(showGuide ? "guide" : "home");
  if (showGuide) {
    const destination = hash === "#help" ? document.querySelector("#help") : guideView;
    requestAnimationFrame(() => destination?.scrollIntoView({ block: "start" }));
  }
}

vpnTabLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    navigateWithinSite("guide", "#vpn-guide", guideView);
  });
});

document.querySelectorAll(".top-nav a[href^='#']:not([data-vpn-tab]), .brand[href='#top'], .footer-brand[href='#top']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    const target = hash === "#top" ? document.querySelector("#top") : document.querySelector(hash);
    event.preventDefault();
    const view = target?.closest("#vpn-guide") ? "guide" : "home";
    navigateWithinSite(view, hash, target);
  });
});

window.addEventListener("popstate", restoreViewFromLocation);
window.addEventListener("hashchange", restoreViewFromLocation);

const motionTargets = [...document.querySelectorAll(".section-heading, .service-card, .step-item, .offer-card, .academy-card, .faq-item, .contact-card, .privacy-strip")];
motionTargets.forEach((element) => {
  const siblings = [...element.parentElement.children].filter((sibling) => sibling.matches(".service-card, .step-item, .offer-card, .academy-card, .faq-item, .contact-card"));
  const siblingIndex = Math.max(0, siblings.indexOf(element));
  element.style.setProperty("--motion-delay", `${Math.min(siblingIndex * 45, 180)}ms`);
  element.classList.add("motion-in");
});
document.documentElement.classList.add("motion-ready");
if ("IntersectionObserver" in window) {
  const motionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
  motionTargets.forEach((element) => motionObserver.observe(element));
} else {
  motionTargets.forEach((element) => element.classList.add("is-visible"));
}

renderGuide();
restoreViewFromLocation();
