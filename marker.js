// 캐릭터 위치 표시 (핀 + 이니셜 + 테두리)
window.CHARS={sang:{x:414,name:'W',color:'#b3121b',ink:'#ffffff'},su:{x:446,name:'O',color:'#4a4866',ink:'#ffffff'}};
window.MARK_LINE='#e8e8e8';
window.STREET_AFTER=(c)=>{const {R,P,txt,GY}=c,fy=GY+2;
 const shape=(x,f,g)=>{R(x-3-g,fy-12,7+2*g,7,f);R(x-2-g,fy-13-g,5+2*g,1+g,f);R(x-2-g,fy-5,5+2*g,1+g,f);R(x-1-g,fy-4+g,3+2*g,1,f);R(x-g,fy-3+g,1+2*g,1,f);if(g){P(x,fy-1,f);R(x-3-g,fy-12,1,7,f);}};
 for(const k in window.CHARS){const m=window.CHARS[k],x=m.x|0;
  // 테두리: 1칸 바깥으로
  R(x-4,fy-12,9,7,window.MARK_LINE);R(x-3,fy-14,7,2,window.MARK_LINE);R(x-3,fy-5,7,1,window.MARK_LINE);R(x-2,fy-4,5,1,window.MARK_LINE);R(x-1,fy-3,3,1,window.MARK_LINE);P(x,fy-2,window.MARK_LINE);
  const f=m.color;R(x-3,fy-12,7,7,f);R(x-2,fy-13,5,1,f);R(x-2,fy-5,5,1,f);R(x-1,fy-4,3,1,f);P(x,fy-3,f);txt(m.name,x-1,fy-11,m.ink)}};
