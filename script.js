/* =========================================================
   Valhalla — Unified Interactive App Script
   Liquid Glass Controls | Academy Filter & Expand | VPN Guide | Search | Motion
   ========================================================= */

/* ---------- داده‌های راهنمای اتصال VPN (V2Ray & WireGuard) ---------- */
const VPN_GUIDES = {
  v2ray: {
    label: "V2Ray (VLESS / Reality)",
    platforms: {
      android: {
        title: "راه‌اندازی V2Ray روی اندروید",
        kicker: "V2RAY · ANDROID",
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
        title: "راه‌اندازی V2Ray روی آیفون و آیپد (iOS)",
        kicker: "V2RAY · IOS",
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
        title: "راه‌اندازی V2Ray روی ویندوز",
        kicker: "V2RAY · WINDOWS",
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
      mac: {
        title: "راه‌اندازی V2Ray روی مک (macOS)",
        kicker: "V2RAY · MACOS",
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
        title: "راه‌اندازی WireGuard روی اندروید",
        kicker: "WIREGUARD · ANDROID",
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
        title: "راه‌اندازی WireGuard روی آیفون و آیپد",
        kicker: "WIREGUARD · IOS",
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
        title: "راه‌اندازی WireGuard روی ویندوز",
        kicker: "WIREGUARD · WINDOWS",
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
      mac: {
        title: "راه‌اندازی WireGuard روی مک (macOS)",
        kicker: "WIREGUARD · MACOS",
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

/* ---------- استایل همگام‌سازی پلیر پادکست درون audio-player/ با رنگ‌های رسمی والهالا ---------- */
const PODCAST_IFRAME_CSS = `
  :root {
    color-scheme: dark !important;
    --vp-bg: #161A1B !important;
    --vp-bg-alt: #111314 !important;
    --vp-surface: rgba(25, 31, 33, 0.86) !important;
    --vp-surface-hover: rgba(33, 41, 44, 0.94) !important;
    --vp-inset: #111314 !important;
    --vp-border: rgba(253, 254, 254, 0.11) !important;
    --vp-border-strong: rgba(22, 208, 186, 0.34) !important;
    --vp-accent: #16D0BA !important;
    --vp-accent-hover: #24E2CB !important;
    --vp-accent-bright: #5AF0DD !important;
    --vp-accent-text: #16D0BA !important;
    --vp-accent-surface: rgba(22, 208, 186, 0.12) !important;
    --vp-accent-border: rgba(22, 208, 186, 0.38) !important;
    --vp-text: #FDFEFE !important;
    --vp-text-secondary: rgba(253, 254, 254, 0.72) !important;
    --vp-text-muted: rgba(253, 254, 254, 0.48) !important;
    --vp-on-accent: #111314 !important;
  }

  html, body {
    background: #161A1B !important;
    color: #FDFEFE !important;
    font-family: "Vazirmatn", system-ui, -apple-system, sans-serif !important;
  }
`;

function syncPodcastPlayerTheme() {
  const frameWrap = document.querySelector(".podcast-player-frame");
  if (!frameWrap) return;

  if (!frameWrap.parentElement?.classList.contains("podcast-shell")) {
    const shell = document.createElement("div");
    shell.className = "podcast-shell reveal is-visible";

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

      let styleTag = doc.getElementById("valhalla-podcast-brand-theme");
      if (!styleTag) {
        styleTag = doc.createElement("style");
        styleTag.id = "valhalla-podcast-brand-theme";
        doc.head.appendChild(styleTag);
      }
      styleTag.textContent = PODCAST_IFRAME_CSS;

      const adjustHeight = () => {
        const contentH = doc.documentElement?.scrollHeight || doc.body?.scrollHeight || 0;
        if (contentH >= 360 && contentH <= 860) {
          iframe.style.height = `${contentH + 8}px`;
        }
      };
      setTimeout(adjustHeight, 250);
      setTimeout(adjustHeight, 900);
    } catch {
      // بدون خطا در صورت دسترسی Cross-Origin
    }
  };

  iframe.addEventListener("load", injectStyles);
  if (iframe.contentDocument?.readyState === "complete") {
    injectStyles();
  }
}

/* ---------- وضعیت سراسری اپلیکیشن ---------- */
let currentVpnService = "v2ray";
let currentVpnPlatform = "android";
let currentAcademyFilter = "all";
let isAcademyExpanded = false;
let searchIndex = [];
let activeSearchIdx = -1;

const FEATURED_DEFAULT_COUNT = 6;

/* ---------- فیلتر و نمایش مینیمال مقالات (نمایش ۶ عنوان منتخب در حالت پیش‌فرض، بازشدن کامل با کلیک) ---------- */
function updateAcademyDisplay() {
  const cards = Array.from(document.querySelectorAll(".academy-grid .academy-card"));
  const moreRow = document.getElementById("academy-more-row");
  const expandBtn = document.getElementById("academy-expand-btn");
  if (!cards.length) return;

  if (currentAcademyFilter === "all") {
    const featuredCards = [];
    const standardCards = [];

    cards.forEach((card) => {
      card.hidden = false;
      if (card.classList.contains("prompt-article")) {
        featuredCards.push(card);
      } else {
        standardCards.push(card);
      }
    });

    const visibleSet = new Set([
      ...featuredCards,
      ...standardCards.slice(0, Math.max(0, FEATURED_DEFAULT_COUNT - featuredCards.length))
    ]);

    cards.forEach((card) => {
      const shouldCollapseHide = !isAcademyExpanded && !visibleSet.has(card);
      card.classList.toggle("is-collapsed-hidden", shouldCollapseHide);
    });

    if (moreRow) moreRow.hidden = cards.length <= FEATURED_DEFAULT_COUNT;
    if (expandBtn) {
      expandBtn.setAttribute("aria-expanded", String(isAcademyExpanded));
      expandBtn.innerHTML = isAcademyExpanded
        ? `<span>نمایش خلاصه‌تر</span><span aria-hidden="true">↑</span>`
        : `<span>مشاهده همهٔ ${cards.length.toLocaleString("fa-IR")} مقاله و آموزش</span><span aria-hidden="true">↓</span>`;
    }
  } else {
    cards.forEach((card) => {
      const cat = (card.dataset.category || "").toLowerCase();
      const match = cat.split(/[\s,]+/).includes(currentAcademyFilter);
      card.hidden = !match;
      card.classList.remove("is-collapsed-hidden");
    });
    if (moreRow) moreRow.hidden = true;
  }
}

/* ---------- مدیریت نمای اصلی و نمای راهنمای VPN (#vpn-guide) ---------- */
function switchSiteView(viewName, scrollTargetId = null) {
  const vpnView = document.getElementById("vpn-guide");
  const homeView = document.querySelector(".home-view");
  const vpnTabs = document.querySelectorAll('.vpn-tab, [data-vpn-tab], a[href="#vpn-guide"]');

  if (vpnView && homeView) {
    const showVpn = viewName === "vpn-guide";
    vpnView.hidden = !showVpn;
    homeView.hidden = showVpn;

    vpnTabs.forEach((tab) => {
      tab.setAttribute("aria-current", showVpn ? "page" : "false");
    });

    if (showVpn) {
      renderVpnGuidePanel();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (scrollTargetId) {
      const target = document.getElementById(scrollTargetId);
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 40);
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
  const panel = document.getElementById("guide-panel") || document.querySelector(".guide-panel");
  if (!panel) return;

  const serviceData = VPN_GUIDES[currentVpnService] || VPN_GUIDES.v2ray;
  const normalizedPlatform = currentVpnPlatform === "macos" ? "mac" : currentVpnPlatform;
  const platformData = serviceData.platforms[normalizedPlatform] || serviceData.platforms.android;

  const kickerEl = document.getElementById("guide-kicker") || panel.querySelector(".panel-kicker");
  const titleEl = document.getElementById("guide-subtitle") || panel.querySelector("h4, h3");
  const downloadsEl = document.getElementById("download-links") || panel.querySelector(".download-links");
  const stepsEl = document.getElementById("steps-list") || panel.querySelector(".steps-list");
  const calloutEl = document.getElementById("guide-callout") || panel.querySelector(".guide-callout");

  if (kickerEl) kickerEl.textContent = platformData.kicker;
  if (titleEl) titleEl.textContent = platformData.title;

  if (downloadsEl) {
    downloadsEl.innerHTML = platformData.downloads
      .map(
        (item) => `
        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="download-link">
          <span>${item.name}</span>
          <span aria-hidden="true">↗</span>
        </a>`
      )
      .join("");
  }

  if (stepsEl) {
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
  }

  if (calloutEl) {
    calloutEl.innerHTML = `<span>✦</span><p>${platformData.callout}</p>`;
  }
}

/* ---------- مدیریت تب‌های سیم‌کارت فیزیکی ---------- */
function activateSimTab(tabBtn) {
  const container = tabBtn.closest(".physical-sim-card") || document;
  const tabs = Array.from(container.querySelectorAll(".sim-tab"));
  const panels = Array.from(container.querySelectorAll(".sim-panel"));
  const targetId = tabBtn.getAttribute("aria-controls") || tabBtn.dataset.simTab;

  tabs.forEach((t) => {
    const active = t === tabBtn;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", String(active));
    t.tabIndex = active ? 0 : -1;
  });

  panels.forEach((panel) => {
    const match = panel.id === targetId || panel.dataset.simPanel === targetId;
    panel.hidden = !match;
    panel.classList.toggle("is-active", match);
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

    const inVpnView = Boolean(el.closest("#vpn-guide"));
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
  const panel = document.getElementById("site-search") || document.querySelector(".quick-search");
  const toggleBtn = document.getElementById("search-toggle");
  const input = document.getElementById("site-search-input") || panel?.querySelector("input");
  if (!panel) return;

  const isOpen = !panel.hidden;
  const next = typeof forceOpen === "boolean" ? forceOpen : !isOpen;
  panel.hidden = !next;
  if (toggleBtn) toggleBtn.setAttribute("aria-expanded", String(next));
  if (input) input.setAttribute("aria-expanded", String(next));

  if (next) {
    input?.focus();
    renderSearchResults(input?.value || "");
  } else {
    activeSearchIdx = -1;
  }
}

function renderSearchResults(query) {
  const resultsEl = document.getElementById("search-results") || document.querySelector(".search-results");
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

    if (el.classList.contains("academy-card")) {
      currentAcademyFilter = "all";
      isAcademyExpanded = true;
      document.querySelectorAll(".academy-filter").forEach((f) => {
        const isAll = f.dataset.filter === "all";
        f.classList.toggle("is-active", isAll);
        f.setAttribute("aria-pressed", String(isAll));
      });
      updateAcademyDisplay();
    }

    if (el.hidden) el.hidden = false;
    if (el.tagName === "DETAILS") el.open = true;

    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 30);
  }, 60);
}

/* ---------- جلوه‌های حرکتی ظریف (Scroll Reveal + Progress Bar + Cursor Spotlight) ---------- */
function initMotionEffects() {
  const progressEl = document.getElementById("scroll-progress");
  if (progressEl) {
    const updateScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0;
      progressEl.style.setProperty("--scroll-pct", pct.toFixed(4));
    };
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
  }

  const revealTargets = document.querySelectorAll(".reveal, .offer-card, .academy-card");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  // افکت نور دنبال‌گر موس روی کارت‌های خدمات و مقالات
  document.addEventListener(
    "pointermove",
    (e) => {
      const card = e.target.closest?.(".offer-card, .academy-card");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    },
    { passive: true }
  );
}

/* ---------- Event Delegation سراسری ---------- */
document.addEventListener("click", (e) => {
  // ۱. فیلترهای آکادمی و مقالات
  const filterBtn = e.target.closest(".academy-filter");
  if (filterBtn) {
    e.preventDefault();
    currentAcademyFilter = (filterBtn.dataset.filter || "all").toLowerCase();
    document.querySelectorAll(".academy-filter").forEach((btn) => {
      const active = btn === filterBtn;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    updateAcademyDisplay();
    return;
  }

  // ۲. دکمه مشاهده همه / خلاصه مقالات
  const expandBtn = e.target.closest("#academy-expand-btn");
  if (expandBtn) {
    e.preventDefault();
    isAcademyExpanded = !isAcademyExpanded;
    updateAcademyDisplay();
    return;
  }

  // ۳. منوی موبایل
  const mobileToggle = e.target.closest("#mobile-toggle");
  if (mobileToggle) {
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) {
      const nextOpen = mobileMenu.hidden;
      mobileMenu.hidden = !nextOpen;
      mobileToggle.setAttribute("aria-expanded", String(nextOpen));
    }
    return;
  }

  if (e.target.closest(".mobile-link")) {
    const mobileMenu = document.getElementById("mobile-menu");
    const toggle = document.getElementById("mobile-toggle");
    if (mobileMenu) mobileMenu.hidden = true;
    toggle?.setAttribute("aria-expanded", "false");
  }

  // ۴. جست‌وجوی سریع
  const searchToggle = e.target.closest("#search-toggle");
  if (searchToggle) {
    e.preventDefault();
    toggleQuickSearch();
    return;
  }

  if (e.target.closest("#search-close")) {
    e.preventDefault();
    toggleQuickSearch(false);
    return;
  }

  const searchResultBtn = e.target.closest(".search-result");
  if (searchResultBtn) {
    navigateToSearchResult(searchResultBtn);
    return;
  }

  const quickSearch = document.getElementById("site-search");
  if (quickSearch && !quickSearch.hidden && !e.target.closest("#site-search, #search-toggle")) {
    toggleQuickSearch(false);
  }

  // ۵. تب‌های سیم‌کارت فیزیکی
  const simTab = e.target.closest(".sim-tab");
  if (simTab) {
    e.preventDefault();
    activateSimTab(simTab);
    return;
  }

  // ۶. جابه‌جایی به نمای راهنمای VPN و بازگشت به صفحه اصلی
  const vpnLink = e.target.closest('.vpn-tab, [data-vpn-tab], a[href="#vpn-guide"]');
  if (vpnLink) {
    const vpnView = document.getElementById("vpn-guide");
    const homeView = document.querySelector(".home-view");
    if (vpnView && homeView) {
      e.preventDefault();
      const mobileMenu = document.getElementById("mobile-menu");
      if (mobileMenu) mobileMenu.hidden = true;
      document.getElementById("mobile-toggle")?.setAttribute("aria-expanded", "false");
      switchSiteView("vpn-guide");
      history.replaceState(null, "", "#vpn-guide");
      return;
    }
  }

  const homeLink = e.target.closest('[data-home-link], .brand, .top-nav a[href^="#"], .mobile-link[href^="#"], .quick-pill[href^="#"], .footer-col a[href^="#"]');
  if (homeLink) {
    const href = homeLink.getAttribute("href") || "";
    if (href !== "#vpn-guide") {
      const vpnView = document.getElementById("vpn-guide");
      const homeView = document.querySelector(".home-view");
      if (vpnView && homeView && !vpnView.hidden) {
        e.preventDefault();
        const targetId = href.startsWith("#") && href.length > 1 ? href.slice(1) : null;
        switchSiteView("home", targetId);
        if (href.startsWith("#")) history.replaceState(null, "", href);
        return;
      }
    }
  }

  // ۷. انتخاب سرویس (V2Ray / WireGuard)
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

  // ۸. انتخاب پلتفرم در راهنمای VPN
  const platformTab = e.target.closest(".platform-tab");
  if (platformTab) {
    document.querySelectorAll(".platform-tab").forEach((t) => {
      const active = t === platformTab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
    });
    currentVpnPlatform = platformTab.dataset.platform || "android";
    renderVpnGuidePanel();
  }
});

/* ---------- راه‌اندازی اولیه ---------- */
function initValhallaApp() {
  syncPodcastPlayerTheme();
  updateAcademyDisplay();
  buildSearchIndex();
  initMotionEffects();

  const searchInput = document.getElementById("site-search-input");
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
      const modal = document.getElementById("valhalla-3d-modal");
      if (modal && !modal.hidden) {
        document.getElementById("v3d-modal-close")?.click();
      } else {
        window.__valhallaToggleChat?.(false);
      }
    }
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
