// HF multilingual player: one silent video + one audio track per language, kept in sync.
document.querySelectorAll('.mlp').forEach(box=>{
  const v=box.querySelector('video'), a=new Audio(), base=box.dataset.base;
  a.preload='auto';
  const btns=box.querySelectorAll('.mlp-lang button[data-a]');
  if(window.HF_SUBS&&!v.textTracks.length){Object.entries(window.HF_SUBS).forEach(([l,cs])=>{const t=v.addTextTrack('subtitles',l.toUpperCase(),l);t.mode='hidden';cs.forEach(c=>t.addCue(new VTTCue(c[0],c[1],c[2])));t.mode='disabled'})}
  let cur='fr', ccOn=false; const cc=box.querySelector('.cc');
  const subs=()=>{[...v.textTracks].forEach(t=>t.mode=(ccOn&&t.language===cur)?'showing':'disabled');if(cc)cc.classList.toggle('on',ccOn)};
  if(cc)cc.onclick=()=>{ccOn=!ccOn;subs()};
  const setTrack=l=>{cur=l;subs();const t=v.currentTime,play=!v.paused;a.src=base+'-'+l+'.mp3';a.currentTime=t;if(play)a.play().catch(()=>{});btns.forEach(b=>b.dataset.a&&b.classList.toggle('on',b.dataset.a===l))};
  btns.forEach(b=>b.onclick=()=>setTrack(b.dataset.a));
  v.addEventListener('play',()=>{a.currentTime=v.currentTime;a.play().catch(()=>{})});
  v.addEventListener('pause',()=>a.pause());
  v.addEventListener('seeked',()=>{a.currentTime=v.currentTime});
  v.addEventListener('waiting',()=>a.pause());
  v.addEventListener('playing',()=>{if(a.paused)a.play().catch(()=>{})});
  v.addEventListener('volumechange',()=>{a.volume=v.volume;a.muted=v.muted;if((v.muted||v.volume===0)&&!ccOn){ccOn=true;subs()}});
  v.addEventListener('timeupdate',()=>{if(!v.paused&&Math.abs(a.currentTime-v.currentTime)>0.25)a.currentTime=v.currentTime});
  v.addEventListener('ended',()=>a.pause());
  document.addEventListener('hf-lang',e=>setTrack(e.detail));
  const site=(localStorage.getItem('hf-l')||'fr');
  setTrack(['fr','ru','en','es','pt','ar','zh'].includes(site)?site:'fr');
});
