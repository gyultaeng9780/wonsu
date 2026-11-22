// ── 주거지역 방치형 시뮬레이션: 실제 시각에 맞춰 두 사람이 움직이고, 행동 로그·상태·마주침이 쌓임
(function(){
 const $=id=>document.getElementById(id);
 if(!$('log')||!window.CHARS)return;

 // 장소별 위치(거리 좌표)
 const POS={수연이네:118,공원:292,편의점:424,마트:510,정육점:588,백화점:706,회사:860,체육관:994,상혁이네:1112};
 const CROSS=[344,882];
 // 건물 안으로 치는 장소 (공원은 바깥)
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

 // 문장 (같은 문장은 한 바퀴 다 나오기 전까지 다시 안 나옴)
 const T={
  sang:{
   sleep:['원상혁은 아직 자고 있다. 알람은 이미 두 번 꺼졌다.','원상혁은 이불을 걷어찼다. 다시 잠들었다.','원상혁은 코를 골며 자고 있다. 벽 너머까지 들린다.','원상혁은 자다가 휴대폰을 떨어뜨렸다. 줍지 않았다.','원상혁은 엎드려 자고 있다. 팔 하나가 침대 밖으로 나왔다.','원상혁은 잠결에 단톡방 알림을 무음으로 돌렸다.','원상혁은 꿈에서도 누군가를 때리는 중이다. 주먹이 움찔했다.','원상혁은 새벽에 깨서 물 한 병을 다 마셨다. 다시 잤다.'],
   morning:['원상혁은 편의점에서 단백질 음료를 집었다. 두 병이다.','원상혁은 편의점 앞에서 하품을 했다. 아직 잠이 덜 깼다.','원상혁은 계산대에 삼각김밥 세 개를 올려놨다.','원상혁은 알바생이 봉투 필요하냐고 묻기도 전에 손으로 다 들었다.','원상혁은 바나나우유를 집었다가 내려놨다. 결국 다시 집었다.','원상혁은 편의점 유리문에 비친 얼굴을 보고 머리를 대충 넘겼다.','원상혁은 컵커피를 원샷하고 빈 컵을 정확히 쓰레기통에 던졌다.'],
   gym:['원상혁은 체육관 셔터를 올렸다. 샌드백이 어제 그대로다.','원상혁은 줄넘기를 했다. 바닥이 울린다.','원상혁은 샌드백을 쳤다. 소리가 거리까지 들린다.','원상혁은 거울 앞에서 섀도복싱을 했다.','원상혁은 손에 붕대를 감았다. 이로 끝을 물어 당겼다.','원상혁은 팔굽혀펴기를 세다가 귀찮아서 그만 셌다.','원상혁은 케틀벨을 한 손으로 들어 제자리에 던져 놨다.','원상혁은 체육관 음악 볼륨을 끝까지 올렸다.','원상혁은 링 로프에 기대 물을 마셨다. 반은 얼굴에 부었다.','원상혁은 회원 단톡방에 "오늘 빠지면 죽음" 이라고 보냈다.'],
   'lunch@정육점':['원상혁은 고기를 두 근 샀다. 점심이다.','원상혁은 정육점 사장님과 부위 얘기를 했다. 목소리가 크다.','원상혁은 "그냥 제일 좋은 걸로요" 라고 했다. 가격은 안 물었다.','원상혁은 덤으로 받은 뼈를 회원들 몫이라며 챙겼다.','원상혁은 기다리는 동안 진열대 고기를 하나하나 품평했다.'],
   'lunch@마트':['원상혁은 장바구니에 닭가슴살을 쓸어 담았다.','원상혁은 계란 한 판을 들었다. 한 손으로.','원상혁은 시식 코너 만두를 세 개 먹고 아무것도 안 샀다.','원상혁은 카트를 안 쓰고 다 품에 안고 계산대로 갔다.','원상혁은 계산하며 거스름돈을 대충 받았다.','원상혁은 라면 코너 앞에서 오래 고민했다. 결국 두 봉지.'],
   coach:['원상혁은 회원에게 가드를 올리라고 소리쳤다.','원상혁은 미트를 잡아 줬다. 회원이 먼저 지쳤다.','원상혁은 스파링을 봐 줬다. 표정이 험하다.','원상혁은 체육관 바닥을 대충 닦았다. 대충이다.','원상혁은 엄살 부리는 회원에게 "그 정도로 안 죽어" 라고 했다.','원상혁은 신입 회원의 자세를 고쳐 줬다. 설명보다 손이 먼저 나갔다.','원상혁은 회비 안 낸 회원 이름을 화이트보드에 크게 적었다.','원상혁은 여자 회원 등록 문의 전화를 받고 "힘들 텐데요" 라고 했다.','원상혁은 시합 앞둔 제자 어깨를 세게 쳤다. 응원이다.','원상혁은 장부 정리를 미루고 또 미뤘다. 영수증이 서랍에 쌓였다.'],
   'night@편의점':['원상혁은 편의점에서 맥주 한 캔을 샀다.','원상혁은 편의점 앞 파라솔에 앉아 컵라면을 먹었다.','원상혁은 계산대 앞에서 담배 진열대를 보다 말았다. 끊었다.','원상혁은 알바생에게 "늦게까지 고생하네" 하고 핫바를 하나 더 샀다.','원상혁은 편의점 앞에 쪼그려 앉아 휴대폰으로 경기 하이라이트를 봤다.'],
   'night@공원':['원상혁은 공원을 몇 바퀴 뛰었다. 숨도 안 찬다.','원상혁은 가로등 아래서 스트레칭을 했다.','원상혁은 철봉에 매달려 턱걸이를 했다. 개수를 세는 사람이 없다.','원상혁은 벤치에 드러누워 하늘을 봤다. 별이 별로 없다.','원상혁은 운동기구를 하나씩 다 해 보고 다 시시하다고 했다.'],
   home:['원상혁은 집에 돌아왔다. 소파에 그대로 누웠다.','원상혁은 격투기 경기를 틀어 놓고 잠들었다.','원상혁은 냉장고를 열었다 닫았다. 먹을 게 없다.','원상혁은 붕대를 풀고 손등을 살폈다. 또 까졌다.','원상혁은 빨래를 미루기로 했다. 내일의 자기한테.','원상혁은 엄마 전화를 받고 "밥 먹었어" 라고 거짓말했다.','원상혁은 프라이팬째로 고기를 구워 먹었다. 설거지는 내일.'],
   think:['원상혁은 문득 그 까탈스러운 여자를 떠올렸다. 기분이 나빠졌다.','원상혁은 "또 마주치면 어쩌지" 생각하다가 "알 바냐" 로 끝냈다.','원상혁은 이유 없이 회계 일 하는 사람들은 다 깐깐하다고 단정했다.']},
  su:{
   sleep:['오수연은 자고 있다. 알람보다 먼저 깰 예정이다.','오수연은 잠결에 내일 일정을 떠올렸다.','오수연은 새벽에 깨서 메일함을 확인했다. 다시 잤다.','오수연은 똑바로 누워 자고 있다. 뒤척임이 없다.','오수연은 알람을 세 개 맞춰 놨다. 하나도 필요 없을 것이다.','오수연은 자다가 회사 꿈을 꿨다. 꿈에서도 숫자가 안 맞았다.'],
   work:['오수연은 장부를 펼쳤다. 숫자가 맞지 않는다.','오수연은 영수증 더미를 정리했다. 하나가 빈다.','오수연은 엑셀 수식을 고쳤다. 이번엔 맞았다.','오수연은 결재 서류를 되돌려 보냈다. 빨간 펜 자국이 선명하다.','오수연은 커피를 한 잔 더 내렸다. 오늘 세 번째다.','오수연은 팀장보다 먼저 출근했고, 팀장보다 늦게 퇴근할 예정이다.','오수연은 회의에서 예산안의 구멍을 세 개 짚었다. 회의실이 조용해졌다.','오수연은 동료가 대충 올린 보고서를 처음부터 다시 정리했다.','오수연은 포스트잇 색깔로 업무를 다섯 단계로 나눴다.','오수연은 "이건 제가 할게요" 라고 했다. 이번 주에만 네 번째다.','오수연은 1원 차이 때문에 장부를 처음부터 다시 맞췄다. 찾았다.','오수연은 점심시간 알람을 껐다. 이것만 끝내고 먹을 생각이다.'],
   lunch:['오수연은 편의점에서 삼각김밥을 먹었다. 평범한 맛이다.','오수연은 컵라면 물을 정확히 선까지 부었다.','오수연은 영수증을 접어 지갑에 넣었다. 법인카드 영수증은 따로.','오수연은 샐러드를 고르다 칼로리 대신 가격을 비교했다.','오수연은 먹으면서 휴대폰으로 거래처 메일에 답장했다.','오수연은 1+1 음료를 사서 하나를 냉장고에 넣어 둘 생각이다.'],
   'shop@마트':['오수연은 가격표를 하나하나 비교했다. 그램당 가격까지.','오수연은 할인 상품만 골라 담았다.','오수연은 영수증을 받아 합계를 다시 계산했다. 맞았다.','오수연은 장바구니 목록을 순서대로 지우며 돌았다. 동선 낭비가 없다.','오수연은 유통기한이 가장 긴 우유를 맨 뒤에서 꺼냈다.','오수연은 계산원이 바코드를 두 번 찍은 걸 그 자리에서 잡아냈다.'],
   'shop@백화점':['오수연은 백화점을 한 바퀴 돌았다. 아무것도 사지 않았다.','오수연은 정장 가격표를 보고 조용히 내려놨다.','오수연은 지하 식품관에서 반찬 두 개를 샀다.','오수연은 직원의 "잘 어울리세요" 를 듣고 바로 나왔다.','오수연은 할인 행사 안내문을 읽고 조건의 함정을 찾았다.','오수연은 구두를 신어 보고 굽 높이를 재 봤다. 출근용으로는 탈락.'],
   walk:['오수연은 공원 벤치에 앉아 일정을 정리했다.','오수연은 공원을 한 바퀴 걸었다. 정확히 20분.','오수연은 산책하다 휴대폰으로 메일을 확인했다.','오수연은 운동기구를 쓰는 사람들 사이를 빠르게 지나갔다.','오수연은 벤치에 버려진 컵을 보고 한숨 쉬며 치웠다.','오수연은 걷는 동안 다음 달 지출 계획을 머릿속으로 맞췄다.'],
   extra:['오수연은 주말인데 회사에 나왔다. 아무도 없다.','오수연은 다음 주 결산을 미리 해 뒀다.','오수연은 텅 빈 사무실이 제일 집중이 잘 된다고 생각했다.','오수연은 경비 아저씨에게 주말 출입 기록을 남겼다. 이번 달 세 번째.'],
   home:['오수연은 집에 돌아와 가계부를 썼다.','오수연은 내일 입을 옷을 미리 걸어 뒀다.','오수연은 노트북을 켰다. 퇴근은 했지만 일은 안 끝났다.','오수연은 따뜻한 차를 마셨다. 짜증이 조금 내려갔다.','오수연은 냉장고 반찬통을 유통기한 순서로 다시 줄 세웠다.','오수연은 엄마 전화를 받고 "잘 지내" 라고 했다. 사실이다.','오수연은 다이어리에 내일 할 일을 시간 단위로 적었다.'],
   think:['오수연은 문득 체육관 그 남자가 떠올랐다. 이유 없이 짜증이 났다.','오수연은 "배려라는 걸 모르는 인간" 이라고 혼잣말했다. 누군지는 안 말했다.','오수연은 그 남자 체육관 회비 체계가 엉망일 거라고 확신했다.']}
 };
 const GO={sang:['원상혁은 {p} 쪽으로 걸음을 옮겼다.','원상혁은 주머니에 손을 넣고 {p}{로} 향했다.','원상혁은 어슬렁어슬렁 {p}{로} 갔다.','원상혁은 기지개를 켜고 {p}{로} 출발했다.'],
  su:['오수연은 {p}{로} 향했다. 걸음이 빠르다.','오수연은 시간을 확인하고 {p}{로} 출발했다.','오수연은 휴대폰을 보며 {p}{로} 걸었다.','오수연은 예정보다 2분 늦게 {p}{로} 나섰다. 신경 쓰인다.']};
 const ARR={sang:['원상혁은 {p}에 도착했다.','원상혁은 {p}에 들어갔다. 문이 세게 닫혔다.','원상혁은 {p} 앞에서 하품하고 안으로 들어갔다.'],
  su:['오수연은 {p}에 도착했다. 예상 시간 그대로다.','오수연은 {p}에 들어갔다.','오수연은 {p} 문을 열기 전에 옷매무새를 정리했다.']};
 const CRS={sang:['원상혁은 횡단보도 앞에서 신호를 기다렸다. 발로 바닥을 툭툭 찼다.','원상혁은 빨간불을 보고 혀를 찼다. 그래도 기다렸다.','원상혁은 신호 기다리며 목을 좌우로 꺾었다.'],
  su:['오수연은 횡단보도 앞에서 신호를 기다렸다. 남은 초를 셌다.','오수연은 빨간불에 멈춰 서서 메일을 하나 보냈다.','오수연은 무단횡단하는 사람을 보고 미간을 좁혔다.']};
 const bags={};
 function draw(key,arr){let b=bags[key];if(!b||!b.q.length){const q=arr.slice();for(let i=q.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[q[i],q[j]]=[q[j],q[i]]}
  if(b&&q.length>1&&q[q.length-1]===b.last){q.unshift(q.pop())}bags[key]=b={q,last:b&&b.last}}const s=b.q.pop();b.last=s;return s}
 const fill=(s,p)=>s.replace(/\{p\}/g,p).replace(/\{로\}/g,ro(p));
 const pool=(who,q)=>T[who][q[2]+'@'+q[1]]||T[who][q[2]];
 const line=(who,q)=>{const P=pool(who,q);return draw(who+q[2]+q[1],P)};
 const MEET=[
  ['원상혁과 오수연이 {p}에서 마주쳤다. 공기가 싸늘해졌다.','오수연은 못 본 척 지나갔다.'],
  ['원상혁은 {p}에서 오수연을 발견했다. 혀를 찼다.','오수연은 들리게 한숨을 쉬었다.'],
  ['오수연이 {p}에서 원상혁과 눈이 마주쳤다.','둘 다 먼저 고개를 돌리지 않았다.'],
  ['원상혁이 {p} 입구를 막고 섰다.','오수연은 비키라고 말 대신 눈으로 말했다.'],
  ['{p}에서 둘이 같은 물건에 손을 뻗었다.','원상혁이 먼저 놓았다. 표정은 지지 않았다.'],
  ['원상혁이 {p}에서 "또 너냐" 라고 했다.','오수연은 "그쪽이 왜 여기 있어요" 라고 받아쳤다.'],
  ['오수연은 {p}에서 원상혁을 보자마자 방향을 틀었다.','원상혁은 그게 더 거슬렸다.'],
  ['{p}에서 원상혁이 오수연 어깨를 스치고 지나갔다.','오수연은 사과를 기다렸다. 오지 않았다.'],
  ['원상혁은 {p}에서 오수연에게 "그렇게 깐깐하게 살면 안 피곤하냐" 고 했다.','오수연은 "생각 없이 사는 것보단요" 라고 했다.'],
  ['오수연이 {p}에서 원상혁의 말을 끝까지 듣지 않고 걸어갔다.','원상혁은 뒤에다 대고 뭐라 했다. 들리지 않았다. 일부러.'],
  ['{p}에서 둘이 동시에 "먼저 가세요" 를 말하지 않았다.','둘 다 그대로 서 있었다. 30초쯤.'],
  ['원상혁은 {p}에서 오수연의 장바구니를 보고 피식 웃었다.','오수연은 그 웃음을 오늘 하루 내내 기억할 것이다.'],
  ['오수연은 {p}에서 원상혁의 운동복 차림을 위아래로 훑었다.','원상혁은 "뭘 봐" 라고 했다. 오수연은 "아무것도요" 라고 했다.']];
 const meetLine=p=>{const all=MEET.concat(MEETP[p]||[]);return draw('meet'+p,all)};
 const MEETP={
  '편의점':[['{p} 계산대 줄에 둘이 앞뒤로 섰다.','원상혁이 뒤에서 한숨을 쉬었다. 오수연이 돌아보지 않고 받아쳤다. "급하면 먼저 하세요."']],
  '마트':[['{p} 마지막 할인 상품을 둘이 동시에 집었다.','오수연이 가져갔다. 원상혁은 "치사하게" 라고 했다.']],
  '공원':[['{p} 벤치 하나에 둘이 양 끝에 앉게 됐다.','먼저 일어난 쪽이 지는 것 같아서 둘 다 일어나지 않았다.']],
  '정육점':[['{p}에서 오수연이 원상혁 뒤에 줄을 섰다.','원상혁이 고기를 너무 오래 골라서 오수연이 시계를 세 번 봤다.']],
  '백화점':[['{p} 엘리베이터에 둘만 탔다.','층수 표시만 쳐다봤다. 아주 긴 7초였다.']],
  '회사':[['{p} 건물 앞에서 원상혁이 오수연을 발견했다. "여기 다니냐"','오수연은 대답하지 않고 출입증을 찍었다.']],
  '체육관':[['오수연이 {p} 앞을 지나갔다. 원상혁이 셔터를 내리다 멈췄다.','"등록하게?" 오수연은 "절대요" 라고 했다.']]};

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
    if(q[0]>0)ev.push([q[0]+off,fill(draw('go'+who,GO[who]),q[1])]);
    const n=Math.min(2,Math.floor((end-q[0])/40));
    for(let j=1;j<=n;j++){const tt=q[0]+Math.round(j*(end-q[0])/(n+1));if(tt<=until)ev.push([tt+off,line(who,q)])}})}
   // 일정상 같은 곳에 있었던 시간 = 마주침 (오늘 것만 횟수에 셈)
   for(let t=1;t<=until;t+=5){const a=slotAt('sang',day,t),b=slotAt('su',day,t);if(a[1]===b[1]&&a[1]!=='상혁이네'&&a[1]!=='수연이네'){
    const st=Math.max(a[0],b[0]);if(off===0)addMeet(mm2(st+3),a[1]);const L=meetLine(a[1]);ev.push([st+3+off,fill(L[0],a[1])]);ev.push([st+4+off,L[1]]);t=st+60}}}
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
   if(s!==L.slot&&(s[1]!==L.slot[1]||s[2]!==L.slot[2])){if(s[1]!==L.slot[1])log(fill(draw('go'+who,GO[who]),s[1]),hm(d));L.slot=s;L.to=POS[s[1]];L.crossed={}}
   if(L.wait>0){L.wait-=dt}else if(Math.abs(L.x-L.to)>1){const dir=Math.sign(L.to-L.x);
    for(const cx of CROSS){if(!L.crossed[cx]&&(L.x-cx)*(L.x+dir*25*dt-cx)<=0){L.crossed[cx]=1;if(hash(cx+m+who.length)<.45){L.wait=2;log(draw('cr'+who,CRS[who]),hm(d))}}}
    if(L.wait<=0){L.x+=dir*Math.min(25*dt,Math.abs(L.to-L.x));if(Math.abs(L.x-L.to)<=1){L.x=L.to;log(fill(draw('ar'+who,ARR[who]),s[1]),hm(d));L.next=Date.now()+4000+Math.random()*4000}}}
   CHARS[who].x=L.x;CHARS[who].inside=Math.abs(L.x-L.to)<=1&&ROOF[L.slot[1]]!=null;place(who);
   if(Date.now()>L.next&&Math.abs(L.x-L.to)<=1){log(Math.random()<.08&&L.slot[2]!=='sleep'?draw('th'+who,T[who].think):line(who,L.slot),hm(d));L.next=Date.now()+5000+Math.random()*5000}}
  // 마주침
  const gap=Math.abs(live.sang.x-live.su.x);
  if(gap<22&&!near){near=true;const p=nearest((live.sang.x+live.su.x)/2);
   if(p!=='상혁이네'&&p!=='수연이네'&&addMeet(hm(d),p)){const L=meetLine(p);log(fill(L[0],p),hm(d));setTimeout(()=>log(L[1],hm(now())),2500);S.sang.hit+=18;S.su.hit+=22}}
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
