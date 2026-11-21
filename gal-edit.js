// ── 갤러리 그리기 + 이미지 편집 (분류 이동 · 이름 수정 · 삭제 · 드래그 순서)
// 저장: QNA_URL(구글 시트)이 있으면 시트에, 없으면 이 브라우저에만 저장
(function(){
 const CATS=[['frame','페어틀'],['pair','함께'],['sang','상혁이네'],['su','수연이네'],['shop','소품샵']];
 const LS='wonsu_gal';
 const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 CATS.forEach(([k])=>{if(!GAL[k])GAL[k]=[]});
 let pf=0;

 function render(){
  document.querySelectorAll('.gal[data-g]').forEach(el=>{const arr=GAL[el.dataset.g]||[];
   el.innerHTML=arr.length?arr.map((x,i)=>`<div class="gi" data-i="${i}"><img src="${x.src}" alt="${esc(x.t)}" loading="lazy" width="${x.w}" height="${x.h}"><span>${esc(x.t)}</span></div>`).join(''):'<div class="gnone">아직 이미지가 없어요</div>';
   el.querySelectorAll('.gi').forEach(g=>g.onclick=()=>openLB(arr,+g.dataset.i))});
  const sh=document.querySelector('[data-shop]');
  if(sh){sh.innerHTML=GAL.shop.map((x,i)=>`<div class="it" data-i="${i}" style="cursor:zoom-in"><div class="im"><img src="${x.src}" alt="${esc(x.t)}" loading="lazy"></div><div class="tx">${esc(x.t)}<small>커미션</small></div></div>`).join('');
   sh.querySelectorAll('.it').forEach(g=>g.onclick=()=>openLB(GAL.shop,+g.dataset.i))}
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
  <p class="ge-tip">드래그로 순서 바꾸기 · 분류를 고르면 그 칸으로 옮겨져요</p>
  <div class="ge-list"></div>
  <div class="ge-f"><span class="ge-st"></span><button class="ge-x ghost">취소</button><button class="ge-s">저장</button></div>
  <div class="ge-pw"><div class="qpwb"><b>비밀번호</b><input type="password" placeholder="편집하려면 비밀번호"><div class="qpwr"><button class="ghost ge-pwx">취소</button><button class="ge-pwok">확인</button></div></div></div></div>`;
 document.body.appendChild(ov);
 const list=ov.querySelector('.ge-list'),st=ov.querySelector('.ge-st'),pwb=ov.querySelector('.ge-pw'),pwi=pwb.querySelector('input');
 let W=null,tab='frame',drag=null;

 function draw(){
  ov.querySelectorAll('.ge-tabs button').forEach(b=>{b.classList.toggle('on',b.dataset.k==tab);b.innerHTML=`<span>${CATS.find(c=>c[0]==b.dataset.k)[1]}</span><i>${W[b.dataset.k].length}</i>`});
  const arr=W[tab];
  list.innerHTML=arr.length?arr.map((x,i)=>`<div class="ge-c" draggable="true" data-i="${i}">
   <div class="ge-t"><img src="${x.src}" alt="" draggable="false"><span class="ge-no">${i+1}</span><button class="ge-del" title="삭제">×</button></div>
   <input class="ge-n" value="${esc(x.t)}" placeholder="이름">
   <select class="ge-k">${CATS.map(([k,l])=>`<option value="${k}"${k==tab?' selected':''}>${l}</option>`).join('')}</select></div>`).join('')
   :'<div class="gnone">이 분류에는 이미지가 없어요</div>';
  list.querySelectorAll('.ge-c').forEach(c=>{const i=+c.dataset.i;
   c.querySelector('.ge-n').oninput=e=>arr[i].t=e.target.value;
   c.querySelector('.ge-k').onchange=e=>{const [x]=arr.splice(i,1);W[e.target.value].push(x);draw()};
   c.querySelector('.ge-del').onclick=()=>{if(confirm(`'${arr[i].t}' 이미지를 목록에서 뺄까요?`)){arr.splice(i,1);draw()}};
   c.ondragstart=e=>{drag=i;c.classList.add('dr');e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',i)};
   c.ondragend=()=>{drag=null;c.classList.remove('dr');list.querySelectorAll('.ov').forEach(o=>o.classList.remove('ov'))};
   c.ondragover=e=>{if(drag===null)return;e.preventDefault();list.querySelectorAll('.ov').forEach(o=>o!==c&&o.classList.remove('ov'));if(drag!==i)c.classList.add('ov')};
   c.ondrop=e=>{e.preventDefault();if(drag===null||drag===i)return;const [x]=arr.splice(drag,1);arr.splice(i,0,x);drag=null;draw()}});
 }
 ov.querySelectorAll('.ge-tabs button').forEach(b=>b.onclick=()=>{tab=b.dataset.k;draw()});
 function openEd(k){tab=k||'frame';W=JSON.parse(JSON.stringify(GAL));st.textContent='';draw();ov.classList.add('on');
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
