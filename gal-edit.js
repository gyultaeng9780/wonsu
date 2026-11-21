// ── 갤러리 그리기 + 이미지 편집 (분류 이동 · 이름 수정 · 삭제 · 드래그 순서)
// 저장: QNA_URL(구글 시트)이 있으면 시트에, 없으면 이 브라우저에만 저장
(function(){
 const CATS=[['frame','페어틀'],['pair','공원'],['sang','상혁이네'],['su','수연이네'],['shop','소품샵']];
 const LS='wonsu_gal';
 const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 CATS.forEach(([k])=>{if(!GAL[k])GAL[k]=[]});
 let pf=0;

 // 같은 묶음(g)은 한 칸으로 — 첫 장만 보이고 누르면 묶음 안에서 넘겨 봄
 function tiles(arr){const seen=new Set(),out=[];arr.forEach(x=>{if(x.g){if(seen.has(x.g))return;seen.add(x.g);out.push(arr.filter(y=>y.g===x.g))}else out.push([x])});return out}
 const badge=m=>m.length>1?`<b class="gstack">${m.length}</b>`:'';
 function render(){
  document.querySelectorAll('.gal[data-g]').forEach(el=>{const T=tiles(GAL[el.dataset.g]||[]);
   el.innerHTML=T.length?T.map((m,i)=>{const x=m[0];return `<div class="gi${m.length>1?' grp':''}" data-i="${i}"><img src="${x.src}" alt="${esc(x.t)}" loading="lazy" width="${x.w}" height="${x.h}">${badge(m)}<span>${esc(x.t)}${m.length>1?` 외 ${m.length-1}장`:''}</span></div>`}).join(''):'<div class="gnone">아직 이미지가 없어요</div>';
   const F=T.flat(),st0=T.map(m=>F.indexOf(m[0]));el.querySelectorAll('.gi').forEach(g=>g.onclick=()=>openLB(F,st0[+g.dataset.i]))});
  const sh=document.querySelector('[data-shop]');
  if(sh){const T=tiles(GAL.shop);sh.innerHTML=T.map((m,i)=>`<div class="it${m.length>1?' grp':''}" data-i="${i}" style="cursor:zoom-in"><div class="im"><img src="${m[0].src}" alt="${esc(m[0].t)}" loading="lazy">${badge(m)}</div><div class="tx">${esc(m[0].t)}<small>커미션${m.length>1?` · ${m.length}장`:''}</small></div></div>`).join('');
   const F=T.flat(),st0=T.map(m=>F.indexOf(m[0]));sh.querySelectorAll('.it').forEach(g=>g.onclick=()=>openLB(F,st0[+g.dataset.i]))}
  slide(0);
 }
 // 페어틀 넘겨보기
 const im=document.getElementById('pf-img'),n=document.getElementById('pf-n');
 function slide(d){if(!im)return;const L=GAL.frame;const box=im.closest('.pf');box.style.display=L.length?'':'none';if(!L.length)return;
  pf=(pf+d+L.length)%L.length;im.src=L[pf].src;im.alt=L[pf].t;n.textContent=(pf+1)+' / '+L.length;
  document.getElementById('pf-p').style.visibility=document.getElementById('pf-x').style.visibility=L.length>1?'':'hidden'}
 if(im){document.getElementById('pf-p').onclick=()=>slide(-1);document.getElementById('pf-x').onclick=()=>slide(1);im.onclick=()=>openLB(GAL.frame,pf)}

 function apply(g){if(!g)return;CATS.forEach(([k])=>{if(Array.isArray(g[k]))GAL[k]=g[k]})}
 async function load(){
  try{if(typeof QNA_URL!=='undefined'&&QNA_URL){const r=await fetch(QNA_URL+'?type=gal');const j=await r.json();if(j.gal)apply(j.gal)}
   else{const v=localStorage.getItem(LS);if(v)apply(JSON.parse(v))}}catch(e){}
  render()}

 // 편집 창
 const ov=document.createElement('div');ov.className='ge';ov.innerHTML=`<div class="ge-w">
  <div class="ge-h"><b>이미지 편집</b><div class="ge-tabs">${CATS.map(([k,l])=>`<button data-k="${k}">${l}</button>`).join('')}</div></div>
  <div class="ge-bar"><p class="ge-tip">드래그로 순서 바꾸기 · 분류를 고르면 그 칸으로 옮겨져요 · 동그라미로 골라 묶을 수 있어요</p><div class="ge-gb"><button class="ge-grp">선택 묶기</button><button class="ge-ungrp">묶음 풀기</button></div></div>
  <div class="ge-list"></div>
  <div class="ge-f"><span class="ge-st"></span><button class="ge-x ghost">취소</button><button class="ge-s">저장</button></div>
  <div class="ge-pw"><div class="qpwb"><b>비밀번호</b><input type="password" placeholder="편집하려면 비밀번호"><div class="qpwr"><button class="ghost ge-pwx">취소</button><button class="ge-pwok">확인</button></div></div></div></div>`;
 document.body.appendChild(ov);
 const list=ov.querySelector('.ge-list'),st=ov.querySelector('.ge-st'),pwb=ov.querySelector('.ge-pw'),pwi=pwb.querySelector('input');
 let W=null,tab='frame',drag=null,sel=new Set();
 const gcol=g=>{let h=0;for(const c of g)h=h*31+c.charCodeAt(0)>>>0;return ['#b3121b','#4a6ab8','#3f8f6b','#b07a1e','#7a4ab0','#2f8d9c','#a8507a','#6b6b6b'][h%8]};

 function draw(){
  ov.querySelectorAll('.ge-tabs button').forEach(b=>{b.classList.toggle('on',b.dataset.k==tab);b.innerHTML=`<span>${CATS.find(c=>c[0]==b.dataset.k)[1]}</span><i>${W[b.dataset.k].length}</i>`});
  const arr=W[tab];
  list.innerHTML=arr.length?arr.map((x,i)=>`<div class="ge-c${x.g?' ing':''}${sel.has(x)?' sel':''}" draggable="true" data-i="${i}" style="${x.g?`--gc:${gcol(x.g)}`:''}">
   <div class="ge-t"><img src="${x.src}" alt="" draggable="false"><span class="ge-no">${i+1}</span><button class="ge-sel${sel.has(x)?' on':''}" title="고르기"></button>${x.g?`<span class="ge-gt" style="background:${gcol(x.g)}">묶음</span>`:''}<button class="ge-del" title="삭제"><svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true"><path d="M3 3L13 13M13 3L3 13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button></div>
   <input class="ge-n" value="${esc(x.t)}" placeholder="이름">
   <select class="ge-k">${CATS.map(([k,l])=>`<option value="${k}"${k==tab?' selected':''}>${l}</option>`).join('')}</select></div>`).join('')
   :'<div class="gnone">이 분류에는 이미지가 없어요</div>';
  list.querySelectorAll('.ge-c').forEach(c=>{const i=+c.dataset.i;
   c.querySelector('.ge-n').oninput=e=>arr[i].t=e.target.value;
   c.querySelector('.ge-k').onchange=e=>{const x=arr[i];const mv=x.g?arr.filter(y=>y.g===x.g):[x];W[tab]=arr.filter(y=>!mv.includes(y));W[e.target.value].push(...mv);sel.clear();draw()};
   c.querySelector('.ge-sel').onclick=e=>{e.stopPropagation();sel.has(arr[i])?sel.delete(arr[i]):sel.add(arr[i]);draw()};
   c.querySelector('.ge-del').onclick=()=>{if(confirm(`'${arr[i].t}' 이미지를 목록에서 뺄까요?`)){arr.splice(i,1);draw()}};
   c.ondragstart=e=>{drag=i;c.classList.add('dr');e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',i)};
   c.ondragend=()=>{drag=null;c.classList.remove('dr');list.querySelectorAll('.ov').forEach(o=>o.classList.remove('ov'))};
   c.ondragover=e=>{if(drag===null)return;e.preventDefault();list.querySelectorAll('.ov').forEach(o=>o!==c&&o.classList.remove('ov'));if(drag!==i)c.classList.add('ov')};
   c.ondrop=e=>{e.preventDefault();if(drag===null||drag===i)return;const [x]=arr.splice(drag,1);arr.splice(i,0,x);drag=null;draw()}});
 }
 ov.querySelectorAll('.ge-tabs button').forEach(b=>b.onclick=()=>{tab=b.dataset.k;sel.clear();draw()});
 ov.querySelector('.ge-grp').onclick=()=>{const arr=W[tab],picked=arr.filter(x=>sel.has(x));if(picked.length<2){st.textContent='두 장 이상 골라 주세요';return}
  const g='g'+Date.now().toString(36);const first=arr.indexOf(picked[0]);const rest=arr.filter(x=>!sel.has(x));picked.forEach(x=>x.g=g);
  const pos=rest.filter((x,k)=>arr.indexOf(x)<first).length;rest.splice(pos,0,...picked);W[tab]=rest;sel.clear();st.textContent='';draw()};
 ov.querySelector('.ge-ungrp').onclick=()=>{const arr=W[tab];const gs=new Set(arr.filter(x=>sel.has(x)&&x.g).map(x=>x.g));if(!gs.size){st.textContent='풀 묶음의 이미지를 골라 주세요';return}
  arr.forEach(x=>{if(gs.has(x.g))delete x.g});sel.clear();st.textContent='';draw()};
 function openEd(k){tab=k||'frame';W=JSON.parse(JSON.stringify(GAL));sel=new Set();st.textContent='';draw();ov.classList.add('on');
  if(!sessionStorage.getItem('wonsu_pw')&&typeof QNA_URL!=='undefined'&&QNA_URL){pwb.classList.add('on');pwi.value='';setTimeout(()=>pwi.focus(),50)}}
 const close=()=>ov.classList.remove('on');
 pwb.querySelector('.ge-pwx').onclick=()=>{pwb.classList.remove('on');close()};
 const pwok=()=>{if(!pwi.value)return;sessionStorage.setItem('wonsu_pw',pwi.value);pwb.classList.remove('on')};
 pwb.querySelector('.ge-pwok').onclick=pwok;pwi.onkeydown=e=>{if(e.key=='Enter')pwok()};
 ov.querySelector('.ge-x').onclick=close;
 ov.querySelector('.ge-s').onclick=async()=>{
  const g={};CATS.forEach(([k])=>g[k]=W[k]);
  if(typeof QNA_URL!=='undefined'&&QNA_URL){st.textContent='저장 중…';
   try{const r=await fetch(QNA_URL,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({type:'gal',pw:sessionStorage.getItem('wonsu_pw')||'',gal:g})});const j=await r.json();
    if(!j.ok){st.textContent='비밀번호가 달라요';sessionStorage.removeItem('wonsu_pw');pwb.classList.add('on');return}}catch(e){st.textContent='저장 실패 · 다시 눌러 주세요';return}}
  else localStorage.setItem(LS,JSON.stringify(g));
  apply(g);render();close()};
 document.querySelectorAll('.ge-open').forEach(b=>b.onclick=()=>openEd(b.dataset.tab));
 addEventListener('keydown',e=>{if(e.key=='Escape'&&ov.classList.contains('on')&&!document.getElementById('lb').classList.contains('on'))close()});

 render();load();
})();
