(() => {
"use strict";
const $=id=>document.getElementById(id), root=$("valhallaPlayer");
if(!root)return;
const audio=$("audioElement"), seek=$("seekBar"), canvas=$("equalizer"), ctx=canvas.getContext("2d");
let playlist=[], index=-1, repeat=false, sleepTimer=null, sleepMinutes=0, audioCtx=null, analyser=null, bins=null, raf=0, msgTimer=0;
const fmt=n=>{if(!Number.isFinite(n)||n<0)return"00:00";n=Math.floor(n);return`${String(Math.floor(n/60)).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`};
function notify(s){$("playerMessage").textContent=s;$("playerMessage").classList.add("show");clearTimeout(msgTimer);msgTimer=setTimeout(()=>$("playerMessage").classList.remove("show"),2600)}
function setPodcastLogo(src){
 const img=$("podcastLogo");
 if(!img)return;
 const path=src||"";
 img.hidden=true;
 img.removeAttribute("src");
 if(!path)return;
 img.onload=()=>{img.hidden=false};
 img.onerror=()=>{img.hidden=true;img.removeAttribute("src");notify("لوگوی این پادکست پیدا نشد؛ مسیر cover در playlist.js را بررسی کنید.")};
 img.src=path;
}
const podcastLogo=$("podcastLogo");if(podcastLogo){podcastLogo.hidden=true;podcastLogo.removeAttribute("src");podcastLogo.addEventListener("error",()=>{podcastLogo.hidden=true;notify("فایل لوگوی پادکست پیدا نشد؛ نام و مسیر فایل را بررسی کنید.")});}

function renderPodcastMenu(){
 const list=$("podcastList");
 if(!list)return;
 list.replaceChildren();
 if(!playlist.length){
   const empty=document.createElement("p");
   empty.className="podcast-list-empty";
   empty.textContent="هنوز پادکستی به فهرست اضافه نشده است.";
   list.appendChild(empty);
   return;
 }
 playlist.forEach((item,i)=>{
   const row=document.createElement("div");
   const current=(i===index);
   const playing=current&&!audio.paused&&!audio.ended&&!!audio.src;
   row.className="podcast-list-item"+(current?" is-current":"");
   const title=document.createElement("span");
   title.className="podcast-list-title";
   title.textContent=item.title;
   const button=document.createElement("button");
   button.type="button";
   button.className="podcast-list-play";
   button.dataset.playIndex=String(i);
   button.textContent=playing?"در حال پخش":(current?"متوقف":"پخش");
   button.setAttribute("aria-label",`${button.textContent}: ${item.title}`);
   row.append(title,button);
   list.appendChild(row);
 });
}
function state(){
 const p=!audio.paused&&!audio.ended&&!!audio.src;
 $("playSymbol").classList.toggle("is-playing",p);
 $("playButton").setAttribute("aria-label",p?"توقف موقت":"پخش");
 $("statusText").textContent=p?"در حال پخش":"متوقف";
 $("statusButton").classList.toggle("is-playing",p);
 renderPodcastMenu();
}
function setupAudioGraph(){
 if(audioCtx){if(audioCtx.state==="suspended")audioCtx.resume().catch(()=>{});return}
 const AC=window.AudioContext||window.webkitAudioContext;if(!AC){notify("مرورگر از اکولایزر زنده پشتیبانی نمی‌کند.");return}
 try{audioCtx=new AC();analyser=audioCtx.createAnalyser();analyser.fftSize=128;analyser.smoothingTimeConstant=.82;bins=new Uint8Array(analyser.frequencyBinCount);audioCtx.createMediaElementSource(audio).connect(analyser);analyser.connect(audioCtx.destination);audioCtx.resume().catch(()=>{})}
 catch(e){audioCtx=null;analyser=null;notify("راه‌اندازی اکولایزر ممکن نشد.")}
}
function resize(){let r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,r.width*d);canvas.height=Math.max(1,r.height*d);ctx.setTransform(d,0,0,d,0,0)}
function draw(){
 const w=canvas.clientWidth,h=canvas.clientHeight;if(w&&h){ctx.clearRect(0,0,w,h);if(analyser&&!audio.paused)analyser.getByteFrequencyData(bins);
 const count=48,gap=Math.max(2,w*.006),bw=(w-gap*(count-1))/count;
 for(let i=0;i<count;i++){let v=analyser&&!audio.paused?bins[Math.min(bins.length-1,Math.floor(i/count*bins.length))]/255:.055+((Math.sin(i*.72)+1)*.018);let bh=Math.max(3,v*h*.92),x=i*(bw+gap),y=h-2-bh,g=ctx.createLinearGradient(0,y,0,h);g.addColorStop(0,"#fff1bd");g.addColorStop(.3,"#ffb94f");g.addColorStop(.65,"#00efff");g.addColorStop(1,"rgba(0,180,255,.25)");ctx.fillStyle=g;ctx.shadowBlur=analyser&&!audio.paused?12:3;ctx.shadowColor=i%5===0?"#ffb94f":"#00dfff";ctx.beginPath();ctx.roundRect(x,y,bw,bh,Math.min(3,bw/2));ctx.fill()}ctx.shadowBlur=0}
 raf=requestAnimationFrame(draw)
}
function track(item){
 if(typeof item==="string")return {src:item,title:item.split("/").pop().replace(/\.[^.]+$/,""),cover:""};
 if(!item||!item.src)return null;
 return {
   src:item.src,
   title:item.title||item.src.split("/").pop(),
   cover:item.cover||item.logo||item.image||""
 };
}
function selectTrack(n,autoplay=false){
 if(!playlist.length)return false;
 index=((n%playlist.length)+playlist.length)%playlist.length;
 const t=playlist[index];
 audio.src=t.src;
 audio.load();
 $("trackTitle").textContent=t.title;
 setPodcastLogo(t.cover);
 $("currentTime").textContent=$("duration").textContent="00:00";
 seek.value=0;
 state();
 if(autoplay){
   setupAudioGraph();
   audio.play().then(state).catch(()=>notify(`پخش «${t.title}» ممکن نشد؛ فایل را بررسی کنید.`));
 }
 return true;
}
async function play(){
  if(!audio.src){
    notify("ابتدا فایل صوتی را انتخاب کنید.");
    return;
  }

  if(!audio.paused){
    audio.pause();
    state();
    return;
  }

  try{
    setupAudioGraph();
    await audio.play();
  }catch(e){
    notify("پخش ممکن نشد؛ مسیر فایل صوتی را بررسی کنید.");
  }

  state();
}

const podcastMenuToggle=$("podcastLibraryToggle"),podcastListPanel=$("podcastListPanel"),podcastList=$("podcastList");
if(podcastMenuToggle&&podcastListPanel){
 podcastMenuToggle.addEventListener("click",()=>{
   const expanded=podcastMenuToggle.getAttribute("aria-expanded")==="true";
   podcastMenuToggle.setAttribute("aria-expanded",String(!expanded));
   podcastListPanel.hidden=expanded;
 });
}
if(podcastList){
 podcastList.addEventListener("click",e=>{
   const button=e.target.closest("button[data-play-index]");
   if(!button)return;
   const target=Number(button.dataset.playIndex);
   if(!Number.isInteger(target)||target<0||target>=playlist.length)return;
   if(target===index&&audio.src&&!audio.paused&&!audio.ended){
     audio.pause();
     state();
   }else{
     selectTrack(target,true);
   }
 });
}

$("playButton").addEventListener("click",play);$("statusButton").addEventListener("click",play);
$("rewindButton").addEventListener("click",()=>{if(Number.isFinite(audio.duration))audio.currentTime=Math.max(0,audio.currentTime-15);else notify("فایل صوتی هنوز آماده نیست.")});
$("forwardButton").addEventListener("click",()=>{if(Number.isFinite(audio.duration))audio.currentTime=Math.min(audio.duration,audio.currentTime+30);else notify("فایل صوتی هنوز آماده نیست.")});
$("speedSelect").addEventListener("change",e=>{audio.playbackRate=Number(e.target.value);notify(`سرعت پخش: ${e.target.value}x`)});
$("volumeBar").addEventListener("input",e=>{audio.volume=Number(e.target.value);audio.muted=audio.volume===0});
seek.addEventListener("input",()=>{if(Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=Number(seek.value)/1000*audio.duration});
audio.addEventListener("timeupdate",()=>{$("currentTime").textContent=fmt(audio.currentTime);if(!seek.matches(":active")&&audio.duration>0)seek.value=Math.round(audio.currentTime/audio.duration*1000)});
audio.addEventListener("loadedmetadata",()=>{$("duration").textContent=fmt(audio.duration)});
audio.addEventListener("play",state);audio.addEventListener("pause",state);
audio.addEventListener("ended",()=>{state();if(repeat){audio.currentTime=0;audio.play().catch(()=>{})}else if(playlist.length>1)selectTrack(index+1,true)});
audio.addEventListener("error",()=>notify("فایل صوتی پیدا نشد؛ مسیر آن را در playlist.js بررسی کنید."));
$("previousButton").addEventListener("click",()=>{if(!playlist.length){if(Number.isFinite(audio.duration))audio.currentTime=0;else notify("فهرست پخش خالی است.");return}if(audio.currentTime>3)audio.currentTime=0;else selectTrack(index-1,true)});
$("nextButton").addEventListener("click",()=>playlist.length?selectTrack(index+1,true):notify("فهرست پخش خالی است."));
$("repeatButton").addEventListener("click",()=>{repeat=!repeat;audio.loop=repeat;$("repeatButton").style.color=repeat?"#00efff":"#f5fbff";$("repeatButton").setAttribute("aria-label",repeat?"تکرار روشن":"تکرار خاموش");notify(repeat?"تکرار روشن شد.":"تکرار خاموش شد.")});
$("sleepButton").addEventListener("click",()=>{let opts=[0,15,30,45,60];sleepMinutes=opts[(opts.indexOf(sleepMinutes)+1)%opts.length];clearTimeout(sleepTimer);$("sleepValue").textContent=sleepMinutes?sleepMinutes+" دقیقه":"خاموش";if(sleepMinutes){sleepTimer=setTimeout(()=>{audio.pause();sleepMinutes=0;$("sleepValue").textContent="خاموش";notify("زمان توقف خودکار فرا رسید.")},sleepMinutes*60000);notify(`توقف خودکار پس از ${sleepMinutes} دقیقه`)}else notify("توقف خودکار خاموش شد.")});
$("shareButton").addEventListener("click",async()=>{try{if(navigator.share)await navigator.share({title:"Valhalla Audio",url:location.href});else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(location.href);notify("پیوند صفحه کپی شد.")}else notify("اشتراک‌گذاری پشتیبانی نمی‌شود.")}catch(e){if(e.name!=="AbortError")notify("اشتراک‌گذاری انجام نشد.")}});
window.ValhallaPlayer={
 setAudio(src,title="",cover=""){
   playlist=[];
   index=-1;
   audio.pause();
   audio.removeAttribute("src");
   audio.load();
   $("trackTitle").textContent="هیچ پادکستی انتخاب نشده";
   $("currentTime").textContent=$("duration").textContent="00:00";
   seek.value=0;
   setPodcastLogo("");
   renderPodcastMenu();
   if(src){playlist=[{src,title:title||src.split("/").pop(),cover:cover||""}];renderPodcastMenu()}
 },
 setPlaylist(items,start=0){
   playlist=Array.isArray(items)?items.map(track).filter(Boolean):[];
   index=-1;
   audio.pause();
   audio.removeAttribute("src");
   audio.load();
   $("trackTitle").textContent="هیچ پادکستی انتخاب نشده";
   $("currentTime").textContent=$("duration").textContent="00:00";
   seek.value=0;
   setPodcastLogo("");
   renderPodcastMenu();
 },
 play,
 pause(){audio.pause()},
 next(){if(playlist.length)selectTrack(index<0?0:index+1,true)},
 previous(){if(playlist.length)selectTrack(index<0?0:index-1,true)},
 get playlist(){return playlist.map(x=>({...x}))},
 get currentIndex(){return index},
 get audio(){return audio}
};
if("ResizeObserver"in window)new ResizeObserver(resize).observe(canvas);else addEventListener("resize",resize);
resize();renderPodcastMenu();if(!raf)raf=requestAnimationFrame(draw);state();
})();
