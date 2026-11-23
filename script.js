/* =========================================================
   Valhalla Tech World — Complete Interactive Engine v3
   ========================================================= */

const WORKER_URL = "https://valhalla-gemini-proxy.knjhgbtbp9.workers.dev";

/* ---------- ۰. بارگذاری امن لوگو + حذف خودکار پس‌زمینه سفید ---------- */
function setupTransparentLogo(imgEl) {
  if (!imgEl || imgEl.dataset.logoReady === "true") return;

  const applyTransparency = () => {
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
        return data[p] > 226 && data[p + 1] > 226 && data[p + 2] > 226;
      };

      for (let x = 0; x < w; x++) {
        const top = x;
        const bot = (h - 1) * w + x;
        if (!visited[top] && isOuterWhite(top)) { visited[top] = 1; queue[tail++] = top; }
        if (!visited[bot] && isOuterWhite(bot)) { visited[bot] = 1; queue[tail++] = bot; }
      }
      for (let y = 0; y < h; y++) {
        const left = y * w;
        const right = y * w + (w - 1);
        if (!visited[left] && isOuterWhite(left)) { visited[left] = 1; queue[tail++] = left; }
        if (!visited[right] && isOuterWhite(right)) { visited[right] = 1; queue[tail++] = right; }
      }

      while (head < tail) {
        const curr = queue[head++];
        const cx = curr % w;
        const cy = (curr / w) | 0;
        data[curr * 4 + 3] = 0;

        if (cx > 0) { const n = curr - 1; if (!visited[n] && isOuterWhite(n)) { visited[n] = 1; queue[tail++] = n; } }
        if (cx < w - 1) { const n = curr + 1; if (!visited[n] && isOuterWhite(n)) { visited[n] = 1; queue[tail++] = n; } }
        if (cy > 0) { const n = curr - w; if (!visited[n] && isOuterWhite(n)) { visited[n] = 1; queue[tail++] = n; } }
        if (cy < h - 1) { const n = curr + w; if (!visited[n] && isOuterWhite(n)) { visited[n] = 1; queue[tail++] = n; } }
      }

      ctx.putImageData(imageData, 0, 0);
      imgEl.dataset.logoReady = "true";
      imgEl.src = canvas.toDataURL("image/png");
    } catch {
      imgEl.dataset.logoReady = "true";
    }
  };

  imgEl.addEventListener("error", () => {
    const fallback = imgEl.dataset.fallbackSrc;
    if (fallback && imgEl.dataset.triedFallback !== "true") {
      imgEl.dataset.triedFallback = "true";
      imgEl.src = fallback;
    } else {
      imgEl.style.display = "none";
      const fb = document.getElementById("brandFallback");
      if (fb) fb.style.display = "flex";
    }
  });

  if (imgEl.complete && imgEl.naturalWidth > 0) {
    applyTransparency();
  } else {
    imgEl.addEventListener("load", applyTransparency, { once: true });
  }
}

/* ---------- ۱. داده‌های ویترین اصلی ---------- */
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
    badge: "آموزش و دانلود مستقیم",
    title: "راهنمای قدم‌به‌قدم تمام اپلیکیشن‌ها روی هر سیستم‌عامل",
    desc: "چه اندروید و آیفون داشته باشی و چه ویندوز و مک، کلاینت رسمی و آموزش اختصاصی همان برنامه رو برات آماده کردیم.",
    ctaText: "رفتن به راهنمای اتصال و دانلود",
    ctaHref: "#guide",
    features: [
      { text: "اندروید: v2rayNG، Hiddify و WireGuard با لینک دانلود رسمی", tag: "Android", type: "free" },
      { text: "آیفون و آیپد: Streisand، V2Box و WireGuard از App Store", tag: "iOS", type: "free" },
      { text: "ویندوز و مک: Hiddify، v2rayN و کلاینت‌های اپل سیلیکون", tag: "Desktop", type: "pro" },
      { text: "تست پینگ خودکار برای انتخاب سریع‌ترین سرور", tag: "هوشمند", type: "pro" }
    ],
    visual: {
      header: "Multi-Platform Sync",
      status: "4 OS • 10+ Guides",
      stats: [
        { label: "زمان راه‌اندازی اولیه", value: "کمتر از ۱ دقیقه", accent: true },
        { label: "تنظیم دستی موردنیاز", value: "صفر", accent: false }
      ],
      rows: [
        { label: "اندروید", value: "v2rayNG / Hiddify / WG" },
        { label: "آیفون و مک", value: "Streisand / V2Box / Hiddify" },
        { label: "ویندوز", value: "Hiddify / v2rayN / WG" }
      ]
    }
  },
  digital: {
    badge: "هویت و ارتباطات بین‌المللی",
    title: "سیم‌کارت‌های بین‌المللی، eSIM و اکانت‌های وریفای‌شده",
    desc: "سیم‌کارت فیزیکی گرجستان (Cellfie)، اتریش (Eety) و انگلستان (Vodafone) کنار eSIM مسافرتی و شماره مجازی بیش از ۱۶۰ کشور.",
    ctaText: "مشاهده کامل سیم‌کارت‌ها",
    ctaHref: "#sim-cards",
    features: [
      { text: "سیم‌کارت فیزیکی Cellfie گرجستان با آنتن‌دهی در ایران", tag: "فیزیکی", type: "pro" },
      { text: "سیم‌کارت Eety اتریش با ثبت رسمی و قانونی با پاسپورت", tag: "فیزیکی", type: "pro" },
      { text: "سیم‌کارت Vodafone انگلستان پلمپ + ۵ پوند شارژ اولیه", tag: "پرچم‌دار", type: "pro" },
      { text: "سیم‌کارت مجازی eSIM و شماره مجازی بیش از ۱۶۰ کشور", tag: "تحویل آنی", type: "free" }
    ],
    visual: {
      header: "Valhalla SIM & Digital",
      status: "Physical & eSIM",
      stats: [
        { label: "پوشش شماره مجازی", value: "+160 کشور", accent: true },
        { label: "سیم‌کارت‌های فیزیکی", value: "GE / AT / UK", accent: true }
      ],
      rows: [
        { label: "Cellfie Georgia", value: "*110*00# • 85 Days" },
        { label: "Eety Austria", value: "*149# • Passport Reg" },
        { label: "Vodafone UK", value: "Sealed • £5 Credit" }
      ]
    }
  },
  hardware: {
    badge: "مهندسی سخت‌افزار و آکادمی",
    title: "تعمیرات تخصصی، مشاوره سیستم و آموزش‌های رایگان",
    desc: "از عیب‌یابی برد لپ‌تاپ و مشاوره بی‌طرفانه خرید قطعات تا مقالات، فایل‌های PDF و پادکست‌های کاربردی در کانال والهالا.",
    ctaText: "مشاهده مقالات و فایل‌های PDF",
    ctaHref: "#academy",
    features: [
      { text: "عیب‌یابی و تعمیر تخصصی مادربرد لپ‌تاپ و سیستم دسکتاپ", tag: "تخصصی", type: "pro" },
      { text: "مشاوره بی‌طرفانه انتخاب قطعات و بستن سیستم", tag: "بر اساس تست", type: "pro" },
      { text: "جزوه‌های PDF اختصاصی ChatGPT و میان‌برهای macOS", tag: "رایگان", type: "free" },
      { text: "مقالات به‌روز ویندوز، مک، SSD و شبکه در @valhala_tw", tag: "کانال تلگرام", type: "free" }
    ],
    visual: {
      header: "Hardware & Academy",
      status: "Lab + Resources",
      stats: [
        { label: "فایل‌های PDF رایگان", value: "دانلود مستقیم", accent: true },
        { label: "کانال آموزش تلگرام", value: "@valhala_tw", accent: true }
      ],
      rows: [
        { label: "تعمیرات لپ‌تاپ و PC", value: "Board-Level" },
        { label: "مقالات و PDF", value: "AI / OS / Hardware" },
        { label: "پشتیبانی فنی", value: "@Valhalla_Guard" }
      ]
    }
  }
};

/* ---------- ۲. راهنمای کامل اتصال به تفکیک سیستم‌عامل + هر برنامه + لینک دانلود ---------- */
const CONNECTION_GUIDES = {
  android: {
    apps: [
      {
        id: "v2rayng",
        name: "v2rayNG (پیشنهادی)",
        protocol: "V2Ray / VLESS / VMess",
        note: "سبک‌ترین و پایدارترین کلاینت اندروید برای لینک‌های اشتراک (Subscription) والهالا گارد.",
        downloads: [
          { label: "دانلود از Google Play", url: "https://play.google.com/store/apps/details?id=com.v2ray.ang", primary: true },
          { label: "دانلود فایل APK (GitHub)", url: "https://github.com/2dust/v2rayNG/releases", primary: false }
        ],
        steps: [
          { num: "01", title: "کپی لینک اشتراک از ربات", desc: "وارد ربات @ValhallaGuard_bot بشو، بخش اشتراک من رو بزن و لینک Subscription اختصاصی خودت رو کپی کن." },
          { num: "02", title: "افزودن لینک در v2rayNG", desc: "برنامه v2rayNG رو باز کن، منوی سه‌خط بالا سمت چپ > Subscription group setting > علامت + رو بزن. یک نام دلخواه (مثلاً Valhalla) بنویس، لینک رو در بخش url جای‌گذاری کن و تیک بالا رو بزن." },
          { num: "03", title: "آپدیت سرورها و اتصال", desc: "به صفحه اصلی برگرد، روی منوی سه‌نقطه بالا سمت راست > Update subscription بزن تا سرورها لود بشن. یک سرور رو انتخاب کن و دکمه V پایین صفحه رو بزن." }
        ]
      },
      {
        id: "hiddify-android",
        name: "Hiddify",
        protocol: "V2Ray / Sing-box (همه‌کاره)",
        note: "رابط کاربری بسیار ساده با انتخاب خودکار سریع‌ترین سرور بدون نیاز به تست دستی.",
        downloads: [
          { label: "دانلود از Google Play", url: "https://play.google.com/store/apps/details?id=app.hiddify.com", primary: true },
          { label: "دانلود مستقیم (GitHub)", url: "https://github.com/hiddify/hiddify-app/releases", primary: false }
        ],
        steps: [
          { num: "01", title: "کپی کردن لینک اشتراک", desc: "لینک اشتراک اختصاصی والهالا گارد رو از ربات @ValhallaGuard_bot کپی کن." },
          { num: "02", title: "ایمپورت با یک کلیک", desc: "برنامه Hiddify رو باز کن، دکمه + (New Profile) رو بزن و گزینه «افزودن از کلیپ‌بورد / Add from Clipboard» رو انتخاب کن." },
          { num: "03", title: "اتصال خودکار", desc: "کافیه دکمه دایره‌ای بزرگ وسط صفحه رو لمس کنی و مجوز VPN اندروید رو تایید کنی تا به بهترین سرور وصل بشی." }
        ]
      },
      {
        id: "wg-android",
        name: "WireGuard",
        protocol: "WireGuard (پینگ پایین گیم)",
        note: "مناسب کاربرانی که فایل کانفیگ .conf یا QR Code اختصاصی وایرگارد دریافت کرده‌اند.",
        downloads: [
          { label: "دانلود از Google Play", url: "https://play.google.com/store/apps/details?id=com.wireguard.android", primary: true }
        ],
        steps: [
          { num: "01", title: "دریافت فایل یا QR Code", desc: "فایل کانفیگ WireGuard (با پسوند .conf) یا تصویر QR Code خودت رو از پشتیبانی یا ربات ذخیره کن." },
          { num: "02", title: "وارد کردن تونل", desc: "در برنامه WireGuard دکمه + آبی پایین صفحه رو بزن و «Import from file» یا «Scan from QR code» رو انتخاب کن." },
          { num: "03", title: "فعال‌سازی اتصال", desc: "کلید کنار نام پروفایل جدید رو روشن کن و مجوز اتصال VPN رو تایید کن." }
        ]
      }
    ]
  },
  ios: {
    apps: [
      {
        id: "streisand",
        name: "Streisand (پیشنهادی)",
        protocol: "V2Ray / VLESS / Reality",
        note: "بهترین و پایدارترین اپلیکیشن رایگان آیفون و آیپد برای اشتراک‌های والهالا گارد.",
        downloads: [
          { label: "دانلود از App Store", url: "https://apps.apple.com/app/streisand/id6450534064", primary: true }
        ],
        steps: [
          { num: "01", title: "کپی لینک اشتراک", desc: "لینک Subscription اختصاصی خودت رو از ربات @ValhallaGuard_bot کپی کن (در صورت نیاز به اپل‌آیدی با پشتیبانی در ارتباط باش)." },
          { num: "02", title: "افزودن لینک در Streisand", desc: "برنامه Streisand رو باز کن، روی علامت + بالا سمت راست بزن و گزینه Import from Clipboard رو انتخاب کن." },
          { num: "03", title: "آپدیت و روشن کردن اتصال", desc: "روی اسم اشتراک نگه دار و Update رو بزن (برای آپدیت‌های بعدی)، یک سرور رو تیک بزن و دکمه آبی بالای صفحه رو لمس کن." }
        ]
      },
      {
        id: "v2box-ios",
        name: "V2Box",
        protocol: "V2Ray / VLESS / ShadowSocks",
        note: "بسیار ساده، سریع و محبوب روی iOS با نمایش لحظه‌ای پینگ تمام سرورها.",
        downloads: [
          { label: "دانلود از App Store", url: "https://apps.apple.com/app/v2box-v2ray-client/id6446814690", primary: true }
        ],
        steps: [
          { num: "01", title: "کپی کردن لینک اشتراک", desc: "لینک اشتراک والهالا گارد رو از ربات تلگرام @ValhallaGuard_bot کپی کن." },
          { num: "02", title: "وارد کردن در تب Configs", desc: "در V2Box وارد تب Configs پایین صفحه شو، علامت + بالا سمت راست رو بزن و «Import v2ray uri from clipboard» یا «Add Subscription» رو انتخاب کن." },
          { num: "03", title: "اتصال در تب Home", desc: "روی یک سرور ضربه بزن، به تب Home برگرد و اسلایدر «Slide to Connect» رو به سمت راست بکش." }
        ]
      },
      {
        id: "wg-ios",
        name: "WireGuard",
        protocol: "WireGuard",
        note: "مصرف باتری بسیار کم و پایداری عالی برای اتصال دائمی و گیمینگ روی آیفون.",
        downloads: [
          { label: "دانلود از App Store", url: "https://apps.apple.com/app/wireguard/id1441195209", primary: true }
        ],
        steps: [
          { num: "01", title: "آماده‌سازی فایل کانفیگ", desc: "فایل کانفیگ وایرگارد (.conf) یا QR Code اختصاصی خودت رو دریافت کن." },
          { num: "02", title: "ایمپورت در اپ WireGuard", desc: "علامت + بالا سمت راست رو بزن و «Create from file or archive» یا «Create from QR code» رو انتخاب کن." },
          { num: "03", title: "تایید Face ID و اتصال", desc: "در اولین اتصال با Face ID یا رمز گوشی، افزودن پروفایل VPN رو تایید کن و سوییچ رو روشن کن." }
        ]
      }
    ]
  },
  windows: {
    apps: [
      {
        id: "hiddify-win",
        name: "Hiddify (پیشنهادی)",
        protocol: "V2Ray / Sing-box / TUN Mode",
        note: "ساده‌ترین برنامه ویندوز با پشتیبانی از کل سیستم (مرورگرها، بازی‌ها و اپ‌های دسکتاپ).",
        downloads: [
          { label: "دانلود نسخه Windows (GitHub)", url: "https://github.com/hiddify/hiddify-app/releases", primary: true }
        ],
        steps: [
          { num: "01", title: "نصب و کپی لینک اشتراک", desc: "فایل نصب Windows (.exe) رو از لینک بالا دانلود و نصب کن، سپس لینک اشتراک رو از @ValhallaGuard_bot کپی کن." },
          { num: "02", title: "افزودن پروفایل", desc: "Hiddify رو باز کن، روی New Profile (+ پروفایل جدید) کلیک کن و Add from Clipboard رو بزن." },
          { num: "03", title: "اتصال و حالت VPN", desc: "روی دکمه بزرگ Connect کلیک کن. برای بازی‌ها یا برنامه‌هایی که از پروکسی عبور نمی‌کنن، از تنظیمات حالت VPN (TUN) رو فعال کن (اجرا با Run as Administrator)." }
        ]
      },
      {
        id: "v2rayn",
        name: "v2rayN",
        protocol: "V2Ray / Xray (حرفه‌ای)",
        note: "کلاینت حرفه‌ای و دقیق برای کاربرانی که کنترل کامل روی سرورها، پورت‌ها و مسیریابی می‌خوان.",
        downloads: [
          { label: "دانلود v2rayN (GitHub)", url: "https://github.com/2dust/v2rayN/releases", primary: true }
        ],
        steps: [
          { num: "01", title: "استخراج و اجرای برنامه", desc: "فایل فشرده v2rayN-windows-64-SelfContained.zip رو دانلود، اکسترکت و v2rayN.exe رو اجرا کن." },
          { num: "02", title: "افزودن Subscription", desc: "از منوی بالا Subscription group > Subscription group setting > Add رو بزن، اسم دلخواه و لینک اشتراک رو وارد کن و Confirm بزن." },
          { num: "03", title: "آپدیت و فعال‌سازی System Proxy", desc: "از منوی Subscription group گزینه Update subscription without proxy رو بزن. یک سرور انتخاب کن و در نوار پایین برنامه، حالت System Proxy رو روی Set system proxy بذار." }
        ]
      },
      {
        id: "wg-win",
        name: "WireGuard",
        protocol: "WireGuard",
        note: "بهترین عملکرد و کمترین سربار CPU برای گیمینگ روی ویندوز.",
        downloads: [
          { label: "دانلود از سایت رسمی WireGuard", url: "https://www.wireguard.com/install/", primary: true }
        ],
        steps: [
          { num: "01", title: "نصب کلاینت رسمی", desc: "نسخه رسمی ویندوز رو از لینک بالا دانلود و نصب کن." },
          { num: "02", title: "ایمپورت فایل کانفیگ", desc: "برنامه رو باز کن، روی Import tunnel(s) from file کلیک کن و فایل .conf خودت رو انتخاب کن." },
          { num: "03", title: "اتصال فوری", desc: "روی دکمه Activate کلیک کن تا وضعیت به Active تغییر کنه." }
        ]
      }
    ]
  },
  macos: {
    apps: [
      {
        id: "hiddify-mac",
        name: "Hiddify (پیشنهادی)",
        protocol: "V2Ray / Sing-box (M1-M4 & Intel)",
        note: "کاملاً سازگار با مک‌بوک‌های اپل سیلیکون و اینتل با رابط کاربری تمیز و اتصال پایدار.",
        downloads: [
          { label: "دانلود نسخه macOS (.dmg)", url: "https://github.com/hiddify/hiddify-app/releases", primary: true }
        ],
        steps: [
          { num: "01", title: "نصب فایل DMG", desc: "فایل macOS (.dmg) رو از لینک بالا دانلود کن، بازش کن و آیکون Hiddify رو داخل پوشه Applications بکش." },
          { num: "02", title: "افزودن لینک اشتراک", desc: "لینک Subscription خودت رو از ربات @ValhallaGuard_bot کپی کن و داخل Hiddify گزینه Add from Clipboard رو بزن." },
          { num: "03", title: "تایید مجوز مک و اتصال", desc: "دکمه Connect رو بزن و در پنجره سیستم‌عامل، اجازه اضافه شدن پروفایل شبکه/پروکسی رو با رمز مک یا Touch ID تایید کن." }
        ]
      },
      {
        id: "v2box-mac",
        name: "V2Box / Streisand",
        protocol: "V2Ray (ویژه اپل سیلیکون)",
        note: "قابل نصب مستقیم از App Store مک بدون نیاز به تنظیمات دستی اضافه.",
        downloads: [
          { label: "دانلود V2Box (App Store)", url: "https://apps.apple.com/app/v2box-v2ray-client/id6446814690", primary: true },
          { label: "دانلود Streisand (App Store)", url: "https://apps.apple.com/app/streisand/id6450534064", primary: false }
        ],
        steps: [
          { num: "01", title: "نصب از App Store مک", desc: "یکی از برنامه‌های V2Box یا Streisand رو مستقیم از اپ‌استور مک نصب کن." },
          { num: "02", title: "ایمپورت لینک اشتراک", desc: "لینک اشتراک والهالا گارد رو کپی کن و در برنامه گزینه Import from Clipboard رو بزن." },
          { num: "03", title: "فعال‌سازی VPN", desc: "سرور دلخواهت رو انتخاب کن و دکمه اتصال رو بزن تا کل ترافیک مک متصل بشه." }
        ]
      },
      {
        id: "wg-mac",
        name: "WireGuard",
        protocol: "WireGuard",
        note: "سبک و بومی برای macOS با آیکون مستقیم در Menu Bar بالای مک.",
        downloads: [
          { label: "دانلود از Mac App Store", url: "https://apps.apple.com/app/wireguard/id1451685025", primary: true }
        ],
        steps: [
          { num: "01", title: "نصب از Mac App Store", desc: "اپلیکیشن رسمی WireGuard رو از اپ‌استور مک دانلود و اجرا کن." },
          { num: "02", title: "وارد کردن فایل .conf", desc: "روی Import Tunnel(s) from File کلیک کن و فایل کانفیگ خودت رو انتخاب کن." },
          { num: "03", title: "اتصال از نوار بالا", desc: "دکمه Activate رو بزن؛ از این به بعد از آیکون WireGuard در نوار بالای مک می‌تونی سریع قطع و وصلش کنی." }
        ]
      }
    ]
  }
};

/* ---------- ۳. مقالات آموزشی کانال تلگرام (@valhala_tw) ---------- */
const ARTICLES_DATA = [
  {
    cat: "ai",
    catLabel: "هوش مصنوعی",
    title: "آموزش کاربردی و حرفه‌ای ChatGPT",
    desc: "آشنایی با قابلیت‌های کلیدی ChatGPT و نحوه استفاده هوشمندانه از آن در کارهای روزمره و تخصصی.",
    url: "https://t.me/valhala_tw/63"
  },
  {
    cat: "ai",
    catLabel: "هوش مصنوعی",
    title: "قسمت اول آموزش پرامپت‌نویسی",
    desc: "چطور سوال‌ها و دستورهای دقیق بنویسیم تا بهترین و ساختاریافته‌ترین خروجی را از هوش مصنوعی بگیریم.",
    url: "https://t.me/valhala_tw/64"
  },
  {
    cat: "os",
    catLabel: "ویندوز و مک",
    title: "مدیریت و بهینه‌سازی حرفه‌ای ویندوز",
    desc: "تنظیمات کلیدی برای افزایش سرعت، کاهش مصرف منابع پس‌زمینه و روان‌تر شدن عملکرد ویندوز.",
    url: "https://t.me/valhala_tw/15"
  },
  {
    cat: "os",
    catLabel: "ویندوز و مک",
    title: "پیش‌نمایش سریع فایل‌ها در ویندوز",
    desc: "چطور شبیه قابلیت Quick Look مک‌بوک، فایل‌ها و تصاویر را در ویندوز فقط با یک کلید بدون باز کردن ببینیم.",
    url: "https://t.me/valhala_tw/16"
  },
  {
    cat: "hardware",
    catLabel: "سخت‌افزار",
    title: "ابزارها و تنظیمات
