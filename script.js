const downloads = {
  wireguard: {
    android: [{ label: "دانلود رسمی WireGuard", href: "https://www.wireguard.com/install/" }],
    ios: [{ label: "دانلود رسمی WireGuard برای iPhone", href: "https://www.wireguard.com/install/" }],
    windows: [{ label: "دانلود رسمی WireGuard برای Windows", href: "https://www.wireguard.com/install/" }],
    mac: [{ label: "دانلود رسمی WireGuard برای macOS", href: "https://www.wireguard.com/install/" }],
  },
  v2ray: {
    android: [
      { label: "Hiddify · نصب برای همهٔ دستگاه‌ها", href: "https://hiddify.com/fa/app/How-to-install-Hiddify-app/" },
      { label: "v2rayNG · انتشارهای رسمی", href: "https://github.com/2dust/v2rayNG/releases" },
    ],
    ios: [{ label: "Hiddify · نصب برای iPhone / iOS", href: "https://hiddify.com/fa/app/How-to-install-Hiddify-app/" }],
    windows: [
      { label: "Hiddify · نصب برای Windows", href: "https://hiddify.com/fa/app/How-to-install-Hiddify-app/" },
      { label: "v2rayN · انتشارهای رسمی", href: "https://github.com/2dust/v2rayN/releases" },
    ],
    mac: [{ label: "Hiddify · نصب برای macOS", href: "https://hiddify.com/fa/app/How-to-install-Hiddify-app/" }],
  },
};

const content = {
  v2ray: {
    android: {
      title: "راه‌اندازی روی اندروید",
      steps: [
        ["برنامه را نصب کن", "Hiddify یا v2rayNG را فقط از پیوند رسمی بالا دریافت و نصب کن."],
        ["لینک اشتراک را کپی کن", "لینک Subscription را از پیام سرویس خودت کامل کپی کن."],
        ["اشتراک را اضافه کن", "در Hiddify روی افزودن کانفیگ/اشتراک بزن؛ در v2rayNG از بخش Subscription استفاده کن و لینک را وارد کن."],
        ["فهرست سرورها را تازه کن", "Update یا Refresh را بزن تا سرورها بارگذاری شوند."],
        ["سرور را انتخاب و وصل شو", "یک سرور را انتخاب کن و دکمهٔ اتصال را بزن. اگر مجوز VPN خواسته شد، نام برنامه را بررسی کن."],
      ],
      callout: "اشتراک‌ها ممکن است با توجه به برنامه و نسخه کمی متفاوت نمایش داده شوند. اگر گزینه‌ای را پیدا نکردی، راهنمای خود برنامه را ببین.",
    },
    ios: {
      title: "راه‌اندازی روی iPhone / iOS",
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

  const targets = document.querySelectorAll(".offer-card, .academy-card, .podcast-feature, .faq-item, .contact-card, [data-service], [data-platform]");
  for (const target of targets) {
    const title = target.querySelector("h3, summary, .contact-card strong, .service-text strong")?.textContent.trim() || target.textContent.trim();
    const detail = target.querySelector(".offer-description, .academy-card p, .podcast-copy p, .faq-item p, .contact-card small, .service-text span")?.textContent.trim() || "";
    const kind = target.matches(".academy-card") ? "academy"
      : target.matches(".podcast-feature") ? "podcast"
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

const motionTargets = [...document.querySelectorAll(".section-heading, .service-card, .step-item, .offer-card, .academy-card, .podcast-feature, .faq-item, .contact-card, .privacy-strip")];
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


// Custom Valhalla podcast deck: Hall of Echoes — playback, skip, volume, repeat, share.
(() => {
  const audio = document.querySelector("#podcast-audio");
  if (!audio) return;
  const playButton = document.querySelector("#audio-play-toggle");
  const progress = document.querySelector("#audio-progress");
  const current = document.querySelector("#audio-current-time");
  const duration = document.querySelector("#audio-duration");
  const mute = document.querySelector("#audio-mute");
  const volume = document.querySelector("#audio-volume");
  const repeat = document.querySelector("#audio-repeat");
  const share = document.querySelector("#audio-share");
  const skipBack = document.querySelector("#audio-skip-back");
  const skipForward = document.querySelector("#audio-skip-forward");
  const speed = document.querySelector("#audio-speed");
  const sleep = document.querySelector("#audio-sleep");
  const deck = document.querySelector(".rune-deck");
  let sleepTimer = null;
  const statusLabel = document.querySelector("#audio-status-label span");
  audio.volume = Number(volume?.value ?? 0.8);

  const format = (seconds) => {
    if (!Number.isFinite(seconds)) return "00:00";
    const value = Math.max(0, Math.floor(seconds));
    return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
  };

  const setStatus = (text) => {
    if (statusLabel) statusLabel.textContent = text;
  };

  const sync = () => {
    if (!current || !duration || !progress || !playButton) return;
    current.textContent = format(audio.currentTime);
    duration.textContent = Number.isFinite(audio.duration) ? format(audio.duration) : "15:10";
    progress.value = Number.isFinite(audio.duration) && audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    progress.style.setProperty("--progress", `${progress.value}%`);
    playButton.setAttribute("aria-label", audio.paused ? "پخش پادکست" : "مکث پادکست");
    playButton.classList.toggle("is-playing", !audio.paused);
    deck?.classList.toggle("is-playing", !audio.paused);
    if (mute) mute.setAttribute("aria-label", audio.muted || audio.volume === 0 ? "فعال‌کردن صدا" : "بی‌صدا کردن");
    if (!audio.paused) setStatus("TRANSMISSION LIVE");
    else if (audio.currentTime > 0.4) setStatus("SIGNAL PAUSED");
    else setStatus("AWAITING SIGNAL");
  };

  playButton?.addEventListener("click", async () => {
    if (audio.paused) {
      setStatus("CONNECTING…");
      try {
        await audio.play();
      } catch {
        document.querySelector(".audio-fallback")?.classList.add("is-visible");
        setStatus("SIGNAL FAILED");
      }
    } else {
      audio.pause();
    }
  });

  progress?.addEventListener("input", () => {
    if (Number.isFinite(audio.duration)) audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  });

  const skip = (delta) => {
    if (!Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + delta));
    sync();
  };
  skipBack?.addEventListener("click", () => skip(-15));
  skipForward?.addEventListener("click", () => skip(15));

  mute?.addEventListener("click", () => { audio.muted = !audio.muted; sync(); });
  volume?.addEventListener("input", () => {
    audio.volume = Number(volume.value);
    audio.muted = audio.volume === 0;
    sync();
  });
  repeat?.addEventListener("click", () => {
    audio.loop = !audio.loop;
    repeat.setAttribute("aria-pressed", String(audio.loop));
    repeat.setAttribute("aria-label", audio.loop ? "تکرار روشن" : "تکرار خاموش");
  });

  speed?.addEventListener("change", () => {
    audio.playbackRate = Number(speed.value) || 1;
  });

  sleep?.addEventListener("change", () => {
    if (sleepTimer) window.clearTimeout(sleepTimer);
    sleepTimer = null;
    const minutes = Number(sleep.value);
    if (minutes > 0) {
      sleepTimer = window.setTimeout(() => {
        audio.pause();
        if (sleep) sleep.value = "0";
        setStatus("SLEEP TIMER COMPLETE");
        sync();
      }, minutes * 60 * 1000);
    }
  });
  share?.addEventListener("click", async () => {
    const shareData = { title: "پادکست والهالا · آموزش پرامپت‌نویسی", url: "https://t.me/valhala_tw/64" };
    try {
      if (navigator.share) await navigator.share(shareData);
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        share.setAttribute("aria-label", "پیوند پادکست کپی شد");
      }
    } catch {}
  });

  ["loadedmetadata", "durationchange", "timeupdate", "play", "pause", "volumechange", "ended", "waiting", "playing"].forEach((event) => {
    audio.addEventListener(event, () => {
      if (event === "waiting") setStatus("BUFFERING…");
      if (event === "ended") setStatus("TRANSMISSION COMPLETE");
      sync();
    });
  });
  sync();
})();
