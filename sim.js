// ── 주거지역 방치형 시뮬레이션: 실제 시각에 맞춰 두 사람이 움직이고, 행동 로그·상태·마주침이 쌓임
(function(){
 const $=id=>document.getElementById(id);
 if(!$('log')||!window.CHARS)return;

 // 장소별 위치(거리 좌표)
 const POS={수연이네:118,공원:292,편의점:424,마트:510,정육점:588,백화점:706,회사:860,체육관:994,상혁이네:1112};
 const CROSS=[344,882];
 // 건물 안에 있을 때 핀을 올릴 지붕 높이 (거리 그림 기준, 숫자가 작을수록 위)
 const ROOF={수연이네:31,편의점:61,마트:49,정육점:57,백화점:16,회사:16,체육관:39,상혁이네:45};
 const ro=w=>{const c=w.charCodeAt(w.length-1)-0xAC00;const j=c%28;return (j===0||j===8)?'로':'으로'};
 const NAME={sang:'원상혁',su:'오수연'};

 // 날짜별로 고정되는 난수 (같은 날은 같은 하루)
 // 동네 시간은 빠르게 흐름: 실제 1초 = 동네 1분 (하루가 24분)
 const SPEED=60,T0=Date.now();
 const now=()=>new Date(T0+(Date.now()-T0)*SPEED);
 const dkey=d=>d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();
 const hash=n=>{n=Math.imul(n^0x5bd1e995,2654435761)>>>0;n^=n>>>15;n=Math.imul(n,2246822519)>>>0;n=(n^(n>>>13))>>>0;return n/4294967296};
 const pick=(arr,seed)=>arr[Math.floor(hash(seed)*arr.length)%arr.length];

 // 하루 일정 [시작(분), 장소, 하는 일]
 function plan(who,d){
  const k=dkey(d),wk=d.getDay()===0||d.getDay()===6,r=s=>hash(k*7+s);
  if(who==='sang'){
   const lunch=r(1)<.5?'정육점':'마트',night=r(2)<.5?'편의점':'공원';
   return [[0,'상혁이네','sleep'],[565+Math.floor(r(3)*25),'편의점','morning'],[605,'체육관','gym'],[730,lunch,'lunch'],[790,'체육관','coach'],[1150,night,'night'],[1260,'상혁이네','home']];
  }
  if(wk){
   const out=r(4)<.5?'백화점':'마트';
   return [[0,'수연이네','sleep'],[600,'공원','walk'],[670,out,'shop'],[830,'편의점','lunch'],[880,'회사','extra'],[1080,'공원','walk'],[1140,'수연이네','home']];
  }
  const after=r(5)<.5?'마트':'백화점';
  return [[0,'수연이네','sleep'],[455,'회사','work'],[720,'편의점','lunch'],[765,'회사','work'],[1160+Math.floor(r(6)*30),after,'shop'],[1240,'공원','walk'],[1290,'수연이네','home']];
 }
 const slotAt=(who,d,m)=>{const p=plan(who,d);let s=p[0];for(const q of p)if(q[0]<=m)s=q;return s};

 // 문장
 const T={
  sang:{
   sleep:['원상혁은 아직 자고 있다. 알람은 이미 두 번 꺼졌다.','원상혁은 이불을 걷어찼다. 다시 잠들었다.','원상혁은 코를 골며 자고 있다.','원상혁은 자다가 휴대폰을 떨어뜨렸다. 줍지 않았다.'],
   morning:['원상혁은 편의점에서 단백질 음료를 집었다. 두 병이다.','원상혁은 편의점 앞에서 하품을 했다. 아직 잠이 덜 깼다.','원상혁은 계산대에 삼각김밥 세 개를 올려놨다.'],
   gym:['원상혁은 체육관 셔터를 올렸다. 샌드백이 어제 그대로다.','원상혁은 줄넘기를 했다. 바닥이 울린다.','원상혁은 샌드백을 쳤다. 소리가 거리까지 들린다.','원상혁은 거울 앞에서 섀도복싱을 했다.'],
   'lunch@정육점':['원상혁은 고기를 두 근 샀다. 점심이다.','원상혁은 정육점 사장님과 부위 얘기를 했다.','원상혁은 계산하며 거스름돈을 대충 받았다.'],
   'lunch@마트':['원상혁은 장바구니에 닭가슴살을 쓸어 담았다.','원상혁은 계란 한 판을 들었다. 한 손으로.','원상혁은 계산하며 거스름돈을 대충 받았다.'],
   coach:['원상혁은 회원에게 가드를 올리라고 소리쳤다.','원상혁은 미트를 잡아 줬다. 회원이 먼저 지쳤다.','원상혁은 스파링을 봐 줬다. 표정이 험하다.','원상혁은 체육관 바닥을 대충 닦았다.'],
   'night@편의점':['원상혁은 편의점에서 맥주 한 캔을 샀다.','원상혁은 편의점 앞 파라솔에 앉아 컵라면을 먹었다.','원상혁은 계산대 앞에서 담배 진열대를 보다 말았다.'],
   'night@공원':['원상혁은 공원을 몇 바퀴 뛰었다. 숨도 안 찬다.','원상혁은 가로등 아래서 스트레칭을 했다.','원상혁은 철봉에 매달려 턱걸이를 했다.'],
   home:['원상혁은 집에 돌아왔다. 소파에 그대로 누웠다.','원상혁은 격투기 경기를 틀어 놓고 잠들었다.','원상혁은 냉장고를 열었다 닫았다. 먹을 게 없다.','원상혁은 붕대를 풀고 손등을 살폈다.']},
  su:{
   sleep:['오수연은 자고 있다. 알람보다 먼저 깰 예정이다.','오수연은 잠결에 내일 일정을 떠올렸다.','오수연은 새벽에 깨서 메일함을 확인했다. 다시 잤다.','오수연은 똑바로 누워 자고 있다. 뒤척임이 없다.'],
   work:['오수연은 장부를 펼쳤다. 숫자가 맞지 않는다.','오수연은 영수증 더미를 정리했다. 하나가 빈다.','오수연은 엑셀 수식을 고쳤다. 이번엔 맞았다.','오수연은 결재 서류를 되돌려 보냈다. 빨간 펜 자국이 선명하다.','오수연은 커피를 한 잔 더 내렸다. 오늘 세 번째다.'],
   lunch:['오수연은 편의점에서 삼각김밥을 먹었다. 평범한 맛이다.','오수연은 컵라면 물을 정확히 선까지 부었다.','오수연은 영수증을 접어 지갑에 넣었다.'],
   'shop@마트':['오수연은 가격표를 하나하나 비교했다.','오수연은 할인 상품만 골라 담았다.','오수연은 영수증을 받아 합계를 다시 계산했다.'],
   'shop@백화점':['오수연은 백화점을 한 바퀴 돌았다. 아무것도 사지 않았다.','오수연은 정장 가격표를 보고 조용히 내려놨다.','오수연은 지하 식품관에서 반찬 두 개를 샀다.'],
   walk:['오수연은 공원 벤치에 앉아 일정을 정리했다.','오수연은 공원을 한 바퀴 걸었다. 정확히 20분.','오수연은 산책하다 휴대폰으로 메일을 확인했다.'],
   extra:['오수연은 주말인데 회사에 나왔다. 아무도 없다.','오수연은 다음 주 결산을 미리 해 뒀다.'],
   home:['오수연은 집에 돌아와 가계부를 썼다.','오수연은 내일 입을 옷을 미리 걸어 뒀다.','오수연은 노트북을 켰다. 퇴근은 했지만 일은 안 끝났다.','오수연은 따뜻한 차를 마셨다. 짜증이 조금 내려갔다.']}
 };
 const pool=(who,q)=>T[who][q[2]+'@'+q[1]]||T[who][q[2]];
 const MEET=[
  ['원상혁과 오수연이 {p}에서 마주쳤다. 공기가 싸늘해졌다.','오수연은 못 본 척 지나갔다.'],
  ['원상혁은 {p}에서 오수연을 발견했다. 혀를 찼다.','오수연은 들리게 한숨을 쉬었다.'],
  ['오수연이 {p}에서 원상혁과 눈이 마주쳤다.','둘 다 먼저 고개를 돌리지 않았다.'],
  ['원상혁이 {p}에서 길을 막고 섰다.','오수연은 비키라고 말 대신 눈으로 말했다.'],
  ['{p}에서 둘이 같은 물건에 손을 뻗었다.','원상혁이 먼저 놓았다. 표정은 지지 않았다.']];

 // 로그
 const ul=$('log');ul.innerHTML='';
 const hm=d=>String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
 const mm2=m=>String(Math.floor(m/60)%24).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
 function log(text,t){const li=document.createElement('li');li.innerHTML=`<span class="tm">${t}</span><span class="msg">${text}</span>`;ul.prepend(li);while(ul.children.length>60)ul.lastChild.remove()}
 const lt=document.querySelector('.log .lt');if(lt)lt.textContent='×60 빠르게';

 // 마주침 기록 (하루 단위로 이 브라우저에 저장)
 let meets=[];
 const rowsEl=(()=>{const ex=document.querySelector('.ex');if(!ex)return null;ex.querySelectorAll('.row').forEach(r=>r.remove());const d=document.createElement('div');d.id='meet-rows';ex.appendChild(d);return d})();
 function drawMeets(){const m=$('meet');if(m)m.innerHTML=`${meets.length}<small> 회 마주침</small>`;
  if(rowsEl)rowsEl.innerHTML=meets.length?meets.slice(-3).map(x=>`<div class="row"><span>${x.t}</span><span>${x.p}</span></div>`).join(''):'<div class="row none"><span>아직 마주치지 않았다</span></div>'}
 function addMeet(t,p,live){if(meets.some(x=>x.t===t&&x.p===p))return false;meets.push({t,p});meets.sort((a,b)=>a.t<b.t?-1:1);drawMeets();return true}

 // 오늘 지금까지 있었던 일 미리 채우기
 (function backfill(){
  const d=now(),m=d.getHours()*60+d.getMinutes(),ev=[];
  const y=new Date(d.getTime()-864e5);
  // 어제 저녁부터 지금까지 있었던 일 (어제 것은 -1440분)
  for(const [day,off,until] of [[y,-1440,1440],[d,0,m]]){const k=dkey(day);
   for(const who of ['sang','su']){const p=plan(who,day);p.forEach((q,i)=>{const end=p[i+1]?p[i+1][0]:1440;
    if(q[0]>until)return;
    if(q[0]>0)ev.push([q[0]+off,`${NAME[who]}은 ${q[1]}${ro(q[1])} 향했다.`]);
    const n=Math.min(2,Math.floor((end-q[0])/40));
    for(let j=1;j<=n;j++){const tt=q[0]+Math.round(j*(end-q[0])/(n+1));if(tt<=until){const P=pool(who,q);let s=Math.floor(hash(k*31+i*7)*P.length);ev.push([tt+off,P[(s+j)%P.length]])}}})}
   // 일정상 같은 곳에 있었던 시간 = 마주침 (오늘 것만 횟수에 셈)
   for(let t=1;t<=until;t+=5){const a=slotAt('sang',day,t),b=slotAt('su',day,t);if(a[1]===b[1]&&a[1]!=='상혁이네'&&a[1]!=='수연이네'){
    const st=Math.max(a[0],b[0]);if(off===0)addMeet(mm2(st+3),a[1]);const L=pick(MEET,k+st);ev.push([st+3+off,L[0].replace('{p}',a[1])]);ev.push([st+4+off,L[1]]);t=st+60}}}
  ev.filter(e=>e[0]>m-1440).sort((x,z)=>x[0]-z[0]).slice(-14).forEach(e=>log(e[1],mm2((e[0]+1440)%1440)));
 })();
 drawMeets();

 // 상태값 (시간대 + 마주침 영향)
 const S={sang:{hp:80,md:50,ft:20,ir:60,hit:0},su:{hp:60,md:45,ft:30,ir:70,hit:0}};
 function stats(){const d=now(),m=d.getHours()*60+d.getMinutes()+d.getSeconds()/60,k=dkey(d);
  for(const who of ['sang','su']){const s=S[who],slot=slotAt(who,d,Math.floor(m))[2],day=Math.max(0,Math.min(1,(m-420)/900));
   const n=i=>(hash(k*13+i+Math.floor(m/10))-.5)*6;
   const base=who==='sang'?{hp:92-day*35,ft:15+day*55,md:55,ir:55}:{hp:75-day*30,ft:25+day*60,md:45,ir:62};
   if(slot==='sleep'){base.hp=95;base.ft=10}
   if(slot==='gym'||slot==='coach'){base.hp-=8;base.md+=10}
   if(slot==='work'){base.ir+=8;base.md-=5}
   if(slot==='walk'||slot==='home'){base.md+=8;base.ir-=8}
   s.hit*=.9995;
   const v=[base.hp+n(1),base.md-s.hit*.6+n(2),base.ft+n(3),base.ir+s.hit+n(4)].map(x=>Math.max(3,Math.min(99,Math.round(x))));
   v.forEach((x,i)=>{const b=$(`b-${who}-${i}`),e=$(`v-${who}-${i}`);if(b)b.style.width=x+'%';if(e)e.textContent=x})}}

 // 실시간 이동
 const ACT={sleep:'자는 중',morning:'아침 사는 중',gym:'훈련 중',lunch:'점심 해결 중',coach:'회원 지도 중',night:'밤 시간',home:'집에서 쉬는 중',work:'일하는 중',shop:'장 보는 중',walk:'산책 중',extra:'주말 출근 중'};
 const live={};
 for(const who of ['sang','su']){const d=now(),s=slotAt(who,d,d.getHours()*60+d.getMinutes());live[who]={slot:s,x:POS[s[1]],to:POS[s[1]],wait:0,next:Date.now()+2000+hash(dkey(d)+who.length)*4000,crossed:{}};CHARS[who].x=live[who].x}
 let near=Math.abs(live.sang.x-live.su.x)<22;
 function place(who){const L=live[who];const s=L.slot;const moving=Math.abs(L.x-L.to)>1;
  const pl=$('pl-'+who),ac=$('ac-'+who);if(pl)pl.textContent=moving?`${s[1]}${ro(s[1])} 가는 중`:s[1];if(ac)ac.textContent=moving?'걷는 중':ACT[s[2]]}
 let last=performance.now();
 function tick(t){const dt=Math.min(.25,(t-last)/1000);last=t;const d=now(),m=d.getHours()*60+d.getMinutes();
  for(const who of ['sang','su']){const L=live[who],s=slotAt(who,d,m);
   if(s!==L.slot&&(s[1]!==L.slot[1]||s[2]!==L.slot[2])){if(s[1]!==L.slot[1])log(`${NAME[who]}은 ${s[1]}${ro(s[1])} 향했다.`,hm(d));L.slot=s;L.to=POS[s[1]];L.crossed={}}
   if(L.wait>0){L.wait-=dt}else if(Math.abs(L.x-L.to)>1){const dir=Math.sign(L.to-L.x);
    for(const cx of CROSS){if(!L.crossed[cx]&&(L.x-cx)*(L.x+dir*25*dt-cx)<=0){L.crossed[cx]=1;if(hash(cx+m+who.length)<.45){L.wait=2;log(`${NAME[who]}은 횡단보도 앞에서 신호를 기다렸다.`,hm(d))}}}
    if(L.wait<=0){L.x+=dir*Math.min(25*dt,Math.abs(L.to-L.x));if(Math.abs(L.x-L.to)<=1){L.x=L.to;log(`${NAME[who]}은 ${s[1]}에 도착했다.`,hm(d));L.next=Date.now()+4000+Math.random()*4000}}}
   CHARS[who].x=L.x;CHARS[who].y=(Math.abs(L.x-L.to)<=1&&ROOF[L.slot[1]]!=null)?ROOF[L.slot[1]]:null;place(who);
   if(Date.now()>L.next&&Math.abs(L.x-L.to)<=1){{const P=pool(who,L.slot);let s;do{s=P[Math.floor(Math.random()*P.length)]}while(P.length>1&&s===L.lastLine);L.lastLine=s;log(s,hm(d))};L.next=Date.now()+5000+Math.random()*5000}}
  // 마주침
  const gap=Math.abs(live.sang.x-live.su.x);
  if(gap<22&&!near){near=true;const p=nearest((live.sang.x+live.su.x)/2);
   if(p!=='상혁이네'&&p!=='수연이네'&&addMeet(hm(d),p)){const L=MEET[Math.floor(Math.random()*MEET.length)];log(L[0].replace('{p}',p),hm(d));setTimeout(()=>log(L[1],hm(now())),2500);S.sang.hit+=18;S.su.hit+=22}}
  if(gap>60)near=false;
  requestAnimationFrame(tick)}
 const nearest=x=>{let b='',bd=1e9;for(const k in POS){const v=Math.abs(POS[k]-x);if(v<bd){bd=v;b=k}}return b};
 requestAnimationFrame(tick);

 // 시계·상태 매초
 const clk=$('clock');
 setInterval(()=>{if(clk)clk.textContent=hm(now());stats()},250);if(clk)clk.textContent=hm(now());stats();
 // 날짜가 바뀌면 새 하루로
 let day0=dkey(now());setInterval(()=>{const d=now();if(dkey(d)!==day0){day0=dkey(d);meets=[];drawMeets();log('— 새 하루가 시작됐다 —',hm(d))}},500);
})();
