// ── 문답 (구글 시트 연결)
// 1) 구글 시트 Apps Script를 배포한 뒤 받은 주소를 아래 QNA_URL에 붙여 넣으세요.
const QNA_URL='https://script.google.com/macros/s/AKfycbyEK4nuZF8_gemkHODn9m_smaiXJEpvPxM9TGJx3uFAICTTJrQFjHlseKd3kYjkNN4U/exec';
const QNA_DEFAULT=[
 ['첫 만남','상대의 첫인상은?'],['첫 만남','직접 보기 전에 들은 상대의 소문이나 정보는?'],['첫 만남','처음 싸운 이유는?'],
 ['지금','상대의 직업에 대해 한마디'],['지금','억지로라도 상대의 장점 하나'],['지금','상대의 단점 (끝없이)'],['지금','휴대폰에 저장된 상대 이름은?'],['지금','길에서 상대를 마주치면?'],
 ['만약에','같은 편의점에 들어갔다면?'],['만약에','상대가 아파서 쓰러져 있다면?'],['만약에','둘이 엘리베이터에 갇혔다면?'],['만약에','상대에게 돈을 빌려야 한다면?'],
 ['취향','상대가 좋아할 것 같은 음식'],['취향','상대에게 어울리는 동물'],['취향','상대 플레이리스트 첫 곡 추측'],
 ['마지막','상대가 이사 간다면?'],['마지막','10년 뒤 상대는?'],['마지막','상대에게 하고 싶은 한마디']
].map(([g,q],i)=>({id:'q'+(i+1),g,q,sang:'',su:''}));
(function(){
 const root=document.getElementById('qna-list');if(!root)return;
 let rows=QNA_DEFAULT.map(r=>({...r})),edit=false,pw='';
 const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const st=document.getElementById('qna-st');
 const render=()=>{const groups=[...new Set(rows.map(r=>r.g||'추가'))];
  root.innerHTML=groups.map(g=>`<div class="qg"><div class="qgh">${esc(g)}</div>${rows.filter(r=>(r.g||'추가')==g).map(r=>`<div class="qa2" data-id="${r.id}"><h4>Q. ${esc(r.q)}</h4><div class="qans">
   <div class="qw"><small>원상혁</small>${edit?`<textarea data-k="sang">${esc(r.sang)}</textarea>`:(r.sang?esc(r.sang):'<span class="qe">아직 답이 없어요</span>')}</div>
   <div class="qo"><small>오수연</small>${edit?`<textarea data-k="su">${esc(r.su)}</textarea>`:(r.su?esc(r.su):'<span class="qe">아직 답이 없어요</span>')}</div></div>
   ${edit?`<div class="qbtn"><button data-save="${r.id}">저장</button></div>`:''}</div>`).join('')}</div>`).join('')
  +(edit?`<div class="qadd"><input id="qnew" placeholder="새 질문을 적어 주세요"><button id="qaddb">질문 추가</button></div>`:'');
  root.querySelectorAll('[data-save]').forEach(b=>b.onclick=()=>save(b.dataset.save,b));
  const ab=document.getElementById('qaddb');if(ab)ab.onclick=()=>{const v=document.getElementById('qnew').value.trim();if(!v)return;const r={id:'q'+Date.now(),g:'추가',q:v,sang:'',su:''};rows.push(r);render();save(r.id)}};
 async function load(){if(!QNA_URL){st.textContent='구글 시트 연결 전 · 예시 질문만 보여요';render();return}
  st.textContent='불러오는 중…';try{const r=await fetch(QNA_URL);const j=await r.json();const m=new Map(j.rows.map(x=>[x.id,x]));
   rows=QNA_DEFAULT.map(d=>({...d,...(m.get(d.id)||{})}));j.rows.filter(x=>!QNA_DEFAULT.some(d=>d.id==x.id)).forEach(x=>rows.push({g:'추가',...x}));st.textContent='';}catch(e){st.textContent='불러오지 못했어요 · 잠시 뒤 다시 열어 주세요'}render()}
 async function save(id,btn){const el=root.querySelector(`[data-id="${id}"]`),r=rows.find(x=>x.id==id);if(el)el.querySelectorAll('textarea').forEach(t=>r[t.dataset.k]=t.value);
  if(!QNA_URL){if(btn){btn.textContent='연결 전이라 저장 안 됨';setTimeout(()=>btn.textContent='저장',1500)}return}
  if(btn)btn.textContent='저장 중…';try{const res=await fetch(QNA_URL,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({pw,id:r.id,g:r.g,q:r.q,sang:r.sang,su:r.su})});const j=await res.json();
   if(btn)btn.textContent=j.ok?'저장됨':'비밀번호가 달라요';}catch(e){if(btn)btn.textContent='저장 실패'}if(btn)setTimeout(()=>btn.textContent='저장',1500)}
 document.getElementById('qna-edit').onclick=()=>{if(edit){edit=false;document.getElementById('qna-edit').textContent='답 쓰기';render();return}
  document.getElementById('qna-pw').classList.add('on');document.getElementById('qna-pwi').focus()};
 document.getElementById('qna-pwok').onclick=()=>{pw=document.getElementById('qna-pwi').value;if(!pw)return;edit=true;document.getElementById('qna-pw').classList.remove('on');document.getElementById('qna-edit').textContent='쓰기 끝내기';render()};
 document.getElementById('qna-pwx').onclick=()=>document.getElementById('qna-pw').classList.remove('on');
 load();
})();
