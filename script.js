/* =========================================================
   Valhalla Tech World — Interactive Logic, Transparent Logo & AI
   ========================================================= */

const WORKER_URL = "https://valhalla-gemini-proxy.knjhgbtbp9.workers.dev";

/* ---------- حذف خودکار پس‌زمینه سفید لوگو (تبدیل به PNG ترنسپرنت) ---------- */
function makeLogoTransparent(imgEl) {
  if (!imgEl || imgEl.dataset.transparentProcessed === "true") return;

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
      const visited = new Uint8Array(w * h);
      const queue = new Int32Array(w * h);
      let head = 0;
      let tail = 0;

      const isOuterWhite = (idx) => {
        const p = idx * 4;
        const r = data[p];
        const g = data[p + 1];
        const b = data[p + 2];
        // فقط پیکسل‌های سفید و خاکستری بسیار روشن خارجی حذف می‌شوند
        return r > 228 && g > 228 && b > 228;
      };

      // شروع Flood-Fill از لبه‌های تصویر تا متن سفید داخل لوگو دست‌نخورده بماند
      for (let x = 0; x < w; x++) {
        const topIdx = x;
        const botIdx = (h - 1) * w + x;
        if (!visited[topIdx] && isOuterWhite(topIdx)) {
          visited[topIdx] = 1;
          queue[tail++] = topIdx;
        }
        if (!visited[botIdx] && isOuterWhite(botIdx)) {
          visited[botIdx] = 1;
          queue[tail++] = botIdx;
        }
      }
      for (let y = 0; y < h; y++) {
        const leftIdx = y * w;
        const rightIdx = y * w + (w - 1);
        if (!visited[leftIdx] && isOuterWhite(leftIdx)) {
          visited[leftIdx] = 1;
          queue[tail++] = leftIdx;
        }
        if (!visited[rightIdx] && isOuterWhite(rightIdx)) {
          visited[rightIdx] = 1;
          queue[tail++] = rightIdx;
        }
      }

      while (head < tail) {
        const curr = queue[head++];
        const cx = curr % w;
        const cy = (curr / w) | 0;

        data[curr * 4 + 3] = 0; // شفاف‌سازی کامل پس‌زمینه

        if (cx > 0) {
          const n = curr - 1;
          if (!visited[n] && isOuterWhite(n)) {
            visited[n] = 1;
            queue[tail++] = n;
          }
        }
        if (cx < w - 1) {
          const n = curr + 1;
          if (!visited[n] && isOuterWhite(n)) {
            visited[n] = 1;
            queue[tail++] = n;
          }
        }
        if (cy > 0) {
          const n = curr - w;
          if (!visited[n] && isOuterWhite(n)) {
            visited[n] = 1;
            queue[tail++] = n;
          }
        }
        if (cy < h - 1) {
          const n = curr + w;
          if (!visited[n] && isOuterWhite(n)) {
            visited[n] = 1;
            queue[tail++] = n;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      imgEl.dataset.transparentProcessed = "true";
      imgEl.src = canvas.toDataURL("image/png");
    } catch (e) {
      // در صورت محدودیت CORS لوکال، بدون خطا ادامه می‌دهد
    }
  };

  if (imgEl.complete && imgEl.naturalWidth > 0) {
    process();
  } else {
    imgEl.addEventListener("load", process, { once: true });
    imgEl.addEventListener(
      "error",
      () => {
        imgEl.style.display = "none";
        const fb = document.getElementById("brandFallback");
        if (fb) fb.style.display = "flex";
      },
      { once: true }
    );
  }
}

/* ---------- ۱. داده‌های تب‌های ویترین اصلی ---------- */
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

/* ---------- ۲. داده‌های ویجت مقایسه قبل و بعد ---------- */
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
  if (!infoEl || !visualEl) return;

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
  if (!highlightsEl || !noteEl || !metricsEl) return;

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
  if (!appsBar || !stepsGrid) return;

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

/* ---------- کنترل باز و بسته کردن پنل دستیار هوشمند ---------- */
function setAiDrawerState(forceOpen) {
  const aiDrawer = document.getElementById("aiDrawer");
  const aiFab = document.getElementById("aiFab");
  if (!aiDrawer) return;

  const isCurrentlyOpen = aiDrawer.classList.contains("open");
  const nextState = typeof forceOpen === "boolean" ? forceOpen : !isCurrentlyOpen;

  aiDrawer.classList.toggle("open", nextState);
  aiDrawer.setAttribute("aria-hidden", String(!nextState));
  if (aiFab) {
    aiFab.setAttribute("aria-expanded", String(nextState));
  }

  if (nextState) {
    setTimeout(() => {
      document.getElementById("aiInput")?.focus();
    }, 80);
  }
}

/* ---------- ارتباط با Cloudflare Worker دستیار والهالا ---------- */
const BOT_SKINS = ["valhalla-bot.glb", "valhalla_bot_2.glb"];
let currentSkinIndex = 0;
let chatHistory = [];

function appendMessage(text, role) {
  const container = document.getElementById("aiMessages");
  if (!container) return null;
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

  if (input) input.value = "";
  if (sendBtn) sendBtn.disabled = true;

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

    const rawText = await response.text();
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
      reply = "پاسخی دریافت نشد. لطفاً دوباره امتحان کن یا به پشتیبانی @Valhalla_Guard پیام بده.";
    }

    if (loadingMsg) loadingMsg.textContent = reply;
    chatHistory.push({ role: "model", parts: [{ text: reply }] });
  } catch (err) {
    if (loadingMsg) {
      loadingMsg.textContent =
        "در حال حاضر ارتباط با سرور هوش مصنوعی برقرار نشد. می‌تونی مستقیماً از طریق تلگرام @Valhalla_Guard یا ربات @ValhallaGuard_bot راهنمایی بگیری.";
    }
  } finally {
    if (sendBtn) sendBtn.disabled = false;
    input?.focus();
  }
}

/* ---------- Event Delegation سراسری برای کلیدهای دستیار هوشمند ---------- */
document.addEventListener("click", (e) => {
  // باز/بسته کردن دستیار از طریق دکمه هدر، دکمه شناور پایین یا منوی موبایل
  const openTrigger = e.target.closest("#navAiBtn, #aiFab, #mobileAiBtn");
  if (openTrigger) {
    e.preventDefault();
    e.stopPropagation();
    const mobileMenu = document.getElementById("mobileMenu");
    mobileMenu?.classList.remove("open");
    setAiDrawerState();
    return;
  }

  // بستن پنل چت با دکمه ضربدر
  const closeTrigger = e.target.closest("#aiCloseBtn");
  if (closeTrigger) {
    e.preventDefault();
    setAiDrawerState(false);
    return;
  }

  // تغییر اسکین ربات سه‌بعدی
  const skinTrigger = e.target.closest("#switchSkinBtn");
  if (skinTrigger) {
    currentSkinIndex = (currentSkinIndex + 1) % BOT_SKINS.length;
    const botViewer = document.getElementById("valhallaBotViewer");
    if (botViewer) {
      botViewer.setAttribute("src", BOT_SKINS[currentSkinIndex]);
    }
    return;
  }

  // دکمه‌های سوال آماده داخل چت
  const promptChip = e.target.closest(".ai-prompt-chip");
  if (promptChip) {
    const prompt = promptChip.dataset.prompt;
    if (prompt) sendToValhallaAI(prompt);
  }
});

/* ---------- راه‌اندازی اولیه ---------- */
function initValhallaApp() {
  // شفاف‌سازی لوگوی هدر و فوتر
  document.querySelectorAll(".brand-logo").forEach((img) => makeLogoTransparent(img));

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
      mobileMenu?.classList.remove("open");
      mobileToggle?.setAttribute("aria-expanded", "false");
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

  // فرم ارسال پیام در دستیار هوشمند
  const aiForm = document.getElementById("aiForm");
  aiForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = document.getElementById("aiInput")?.value.trim();
    if (val) sendToValhallaAI(val);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initValhallaApp);
} else {
  initValhallaApp();
}
