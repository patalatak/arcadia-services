
(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const menu=document.querySelector('.menu'),nav=document.querySelector('.navlinks');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';
menu.setAttribute('aria-expanded',String(open));
nav.classList.toggle('open',open);
menu.textContent=open?'Fermer':'Menu'});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){nav.classList.remove('open');
menu.setAttribute('aria-expanded','false');
menu.textContent='Menu';
menu.focus()}});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');
menu.setAttribute('aria-expanded','false');
menu.textContent='Menu'}));
const bar=document.querySelector('.scroll-progress');
addEventListener('scroll',()=>{const range=document.documentElement.scrollHeight-innerHeight;
bar.style.width=(range>0?scrollY/range*100:0)+'%'},{passive:true});
if(!reduced.matches&&'IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('reveal-in');
io.unobserve(e.target)}}),{threshold:.08});
document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el))}
const visualSelectors=['.premium-hero>picture','.info-hero','.cinema','.card-visual','.split-media','.wide-media','.feature-image','.robot-carousel','.service-photo','.infra-hero-media'];
const visualBlocks=Array.from(document.querySelectorAll(visualSelectors.join(',')));
visualBlocks.forEach((el,index)=>{el.classList.add('visual-motion');el.style.setProperty('--visual-delay',(index%5*.14)+'s')});
if(!reduced.matches&&'IntersectionObserver'in window){
  const visualObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visual-in');visualObserver.unobserve(entry.target)}
  }),{threshold:.12,rootMargin:'0px 0px -5%'});
  visualBlocks.forEach(el=>visualObserver.observe(el));
}else visualBlocks.forEach(el=>el.classList.add('visual-in'));
document.querySelectorAll('[data-carousel]').forEach(root=>{const slides=JSON.parse(root.querySelector('script[type="application/json"]').textContent);
let index=0,paused=reduced.matches,hover=false,focused=false;
const title=root.querySelector('[data-title]'),desc=root.querySelector('[data-description]'),label=root.querySelector('[data-label]'),link=root.querySelector('[data-link]'),count=root.querySelector('[data-count]'),pause=root.querySelector('[data-pause]');
function show(n){index=(n+slides.length)%slides.length;
const s=slides[index];
title.textContent=s.title;
desc.textContent=s.description;
label.textContent=s.label;
link.href=s.href;
link.textContent=s.link;
count.textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
root.dataset.frame=index}function button(){pause.textContent=paused?'▶':'Ⅱ';
pause.setAttribute('aria-label',paused?'Reprendre le diaporama':'Mettre le diaporama en pause');
pause.setAttribute('aria-pressed',String(paused))}root.querySelector('[data-prev]').addEventListener('click',()=>{paused=true;
button();
show(index-1)});
root.querySelector('[data-next]').addEventListener('click',()=>{paused=true;
button();
show(index+1)});
pause.addEventListener('click',()=>{paused=!paused;
button()});
root.addEventListener('mouseenter',()=>hover=true);
root.addEventListener('mouseleave',()=>hover=false);
root.addEventListener('focusin',()=>focused=true);
root.addEventListener('focusout',e=>{focused=root.contains(e.relatedTarget)});
reduced.addEventListener('change',e=>{if(e.matches){paused=true;
button()}});
setInterval(()=>{if(!paused&&!hover&&!focused&&!document.hidden)show(index+1)},6500);
button();
show(0)});

document.querySelectorAll('[data-robot-carousel]').forEach(root=>{
  const slides=Array.from(root.querySelectorAll('.robot-slide'));
  if(slides.length<2)return;
  let index=0;
  const count=root.querySelector('.robot-count');
  const show=next=>{
    slides[index].classList.remove('is-active');
    index=(next+slides.length)%slides.length;
    slides[index].classList.add('is-active');
    count.textContent=(index+1)+' / '+slides.length;
  };
  root.querySelector('.robot-prev').addEventListener('click',()=>show(index-1));
  root.querySelector('.robot-next').addEventListener('click',()=>show(index+1));
  if(root.classList.contains('cutout-carousel')){
    let hover=false,focused=false;
    root.addEventListener('mouseenter',()=>hover=true);
    root.addEventListener('mouseleave',()=>hover=false);
    root.addEventListener('focusin',()=>focused=true);
    root.addEventListener('focusout',e=>focused=root.contains(e.relatedTarget));
    setInterval(()=>{if(!reduced.matches&&!hover&&!focused&&!document.hidden)show(index+1)},5600);
  }
});
document.querySelectorAll('[data-infra-carousel]').forEach(root=>{
  const track=root.querySelector('.infra-carousel-track');
  const slides=Array.from(root.querySelectorAll('.infra-slide'));
  const dots=Array.from(root.querySelectorAll('.infra-carousel-dots i'));
  const count=root.querySelector('[data-infra-count]');
  const pause=root.querySelector('[data-infra-pause]');
  let index=0,paused=reduced.matches,hover=false,focused=false;
  const render=next=>{
    const maxIndex=Math.max(0,slides.length-(innerWidth<=800?1:2));
    index=(next+maxIndex+1)%(maxIndex+1);
    const gap=parseFloat(getComputedStyle(track).gap)||0;
    track.style.transform=`translateX(-${index*(slides[0].offsetWidth+gap)}px)`;
    slides.forEach((slide,i)=>slide.classList.toggle('is-active',i===index));
    slides.forEach((slide,i)=>slide.classList.toggle('is-next',i===(index+1)%slides.length));
    dots.forEach((dot,i)=>dot.classList.toggle('is-active',i===index));
    count.textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  };
  const updatePause=()=>{pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Reprendre le carrousel':'Mettre le carrousel en pause')};
  let directionTimer=null;
  const stopDirection=()=>{clearInterval(directionTimer);directionTimer=null};
  const advance=direction=>{paused=true;updatePause();render(index+direction)};
  [[root.querySelector('[data-infra-prev]'),-1],[root.querySelector('[data-infra-next]'),1]].forEach(([arrow,direction])=>{
    arrow.addEventListener('click',()=>advance(direction));
    arrow.addEventListener('pointerenter',event=>{
      if(event.pointerType!=='mouse')return;
      stopDirection();advance(direction);
      directionTimer=setInterval(()=>{if(!document.hidden)advance(direction)},1300);
    });
    arrow.addEventListener('pointerleave',stopDirection);
    arrow.addEventListener('pointercancel',stopDirection);
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopDirection()});
  window.addEventListener('blur',stopDirection);
  pause.addEventListener('click',()=>{paused=!paused;updatePause()});
  root.addEventListener('mouseenter',()=>hover=true);
  root.addEventListener('mouseleave',()=>hover=false);
  root.addEventListener('focusin',()=>focused=true);
  root.addEventListener('focusout',e=>focused=root.contains(e.relatedTarget));
  addEventListener('resize',()=>render(index),{passive:true});
  setInterval(()=>{if(!paused&&!hover&&!focused&&!document.hidden)render(index+1)},5200);
  updatePause();render(0);
});
document.querySelectorAll('.contact-form').forEach(form=>{form.addEventListener('submit',e=>{e.preventDefault();
const data=new FormData(form);
const text='Projet Arcadia — '+data.get('sujet')+'\nNom : '+data.get('nom')+'\nTéléphone : '+data.get('tel')+'\nCourriel : '+(data.get('email')||'Non indiqué')+'\n\n'+data.get('message');
const out=form.querySelector('.form-result');
out.textContent='Votre récapitulatif est prêt. Aucun message n’a été envoyé.\n\n'+text;
const copy=form.querySelector('[data-copy]');
copy.hidden=false;
copy.onclick=async()=>{try{await navigator.clipboard.writeText(text);
copy.textContent='Récapitulatif copié'}catch{out.textContent+='\nSélectionnez ce texte pour le copier.'}}})});
})();
