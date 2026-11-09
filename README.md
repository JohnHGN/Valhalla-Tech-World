# Valhalla Audio Player — Final skin

## فایل پوسته
`assets/valhalla-glass-player.css`

## نصب
1. از نسخه فعلی سایت backup بگیر.
2. فایل‌های `index.html`، `styles.css` و `script.js` این بسته را در ریشه پروژه جایگزین کن.
3. فایل `assets/valhalla-glass-player.css` را در پوشه `assets` قرار بده.
4. فایل صوتی فعلی را در مسیر `assets/valhalla-chatgpt-prompting-part-1.m4a` نگه دار.
5. تغییرات را commit و روی GitHub Pages منتشر کن.

## اطلاعات هر پادکست
برای تغییر لوگو، عنوان و موضوع، ویژگی‌های `data-podcast-title`، `data-podcast-category`، `data-podcast-subtitle` و `data-podcast-cover` روی عنصر `#valhalla-audio-player` را تغییر بده. مقدار `data-podcast-cover` باید مسیر فایل لوگوی همان قسمت باشد. خالی گذاشتن آن، قاب دایره‌ای را بدون لوگو نگه می‌دارد.

برای تغییر پادکست در زمان اجرا (مثلاً با کلیک روی یک آیتم فهرست):

```js
window.ValhallaAudio.setPodcast({
  title: 'عنوان پادکست',
  category: '02 · AI & TECHNOLOGY',
  subtitle: 'موضوع یا توضیح کوتاه',
  cover: 'assets/podcast-02-logo.png',
  audio: 'assets/podcast-02.m4a',
  shareUrl: 'https://example.com/podcast-02'
});
```

فیلدهای `title`، `category`، `subtitle`، `cover`، `audio` و `shareUrl` اختیاری‌اند. برای خالی‌کردن جای لوگو مقدار `cover: ''` بده.

## نکته
پوسته بیرونی صفحه/کارت پادکست شفاف و بدون قاب اضافی است؛ قاب شیشه‌ای نورانی خود پلیر بخشی از طراحی است. اکولایزر فعلاً انیمیشن بصری همگام با وضعیت پخش است و تحلیل طیف فرکانسی زنده نیست.
