// فایل‌های MP3 را در assets/tracks قرار دهید و نام مسیرها را اینجا مطابق فایل‌ها بنویسید.
window.ValhallaPlaylist = [
  { title: "قطعه ۱", src: "assets/tracks/track-01.mp3" },
  { title: "قطعه ۲", src: "assets/tracks/track-02.mp3" },
  { title: "قطعه ۳", src: "assets/tracks/track-03.mp3" },
  { title: "قطعه ۴", src: "assets/tracks/track-04.mp3" },
  { title: "قطعه ۵", src: "assets/tracks/track-05.mp3" }
];
window.ValhallaPlayer?.setPlaylist(window.ValhallaPlaylist);
