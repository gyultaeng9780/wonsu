// 원수 동네 — 도트 거리 (내부 해상도 304x112, 3배 확대)
(function(){
const W=304,H=112,WORLD=1170,GY=92; // GY: 인도 시작 높이
const BASE={
 sky:['#0e0e10','#0e0e10','#0e0e10','#0e0e10','#0e0e10'],
 star:'#bfb6c8',moon:'#e9e2cf',moon2:'#c9c1ab',
 far1:'#26262a',far1w:'#26262a',far2:'#333338',far2w:'#333338',
 ol:'#08070a',
 brick:'#7e5c54',brick2:'#4a3430',brickH:'#a48478',mortar:'#6a5048',
 con:'#4a4750',con2:'#3c3a42',conH:'#5c5964',
 glass:'#44506a',glass2:'#2a3244',glassH:'#6a7a98',
 cream:'#8a8070',cream2:'#5a5448',creamH:'#b4aa98',
 gym:'#55555e',gym2:'#303036',gymH:'#7a7a86',
 win:'#24232a',lit:'#3a3a42',lit2:'#323238',litD:'#2c2c32',warm:'#48484f',
 red:'#c4161f',redH:'#ff4b52',redD:'#7d0d13',
 white:'#e8e4dc',gray:'#8d8a92',
 leaf:'#2f4a35',leaf2:'#3d5f42',leafH:'#567a55',trunk:'#3a2a22',grass:'#26382a',grass2:'#304634',
 walk:'#3a3638',walk2:'#2f2c2e',curb:'#57534f',road:'#151418',road2:'#1b1a1f',lane:'#8a7f5a',
 lamp:'#6a6a70',glow:'#f2c879'
};
let C=BASE,x,ox=0,TH='night';
const THEMES={
 night:{},
 dusk:{sky:['#2b1d3a','#4a2a48','#7a3a4a','#b8584a','#e08a5a'],star:'#2b1d3a',moon:'#f4d8a0',moon2:'#e0b880',far1:'#3a2638',far1w:'#5a3a48',far2:'#4a2a38',far2w:'#e0a060',lit:'#ffd08a',warm:'#fff0c0',road:'#2a2028',road2:'#33262e',walk:'#4a3a3c',walk2:'#3e3032'},
 rain:{sky:['#07080d','#0b0d14','#0f121a','#141722','#191c28'],star:'#07080d',moon:'#07080d',moon2:'#07080d',far1:'#14161e',far2:'#1a1c26',far2w:'#3a4a6a',road:'#0e1016',road2:'#151924',walk:'#262a32',walk2:'#1e2128',lit:'#ffcf7a',red:'#ff2433',redH:'#ff6a72'},
 day:{sky:['#5aa0e0','#6eb0e8','#86c0ee','#a2d0f2','#c0e0f6'],star:'nostar',moon:'#fff3b0',moon2:'#ffe680',glass:'#5a7a9a',glass2:'#4a6a8a',glassH:'#8ab0d0',far1:'#8aa8c4',far1w:'#9ab8d4',far2:'#9cb4c8',far2w:'#aac4d8',win:'#2a3a4e',lit:'#7aa0c8',lit2:'#5a80a8',warm:'#c8e0f4',litD:'#4a6a8a',road:'#3a3a40',road2:'#424248',walk:'#8a8682',walk2:'#7a7672',curb:'#a09c96',glow:'#fff6d0',leaf:'#3a6a3a',leaf2:'#4a8a48',leafH:'#6aaa5a',grass:'#4a7a3a',grass2:'#5a8a48',ol:'#1a1a22'},
 snow:{sky:['#0e1220','#141a2c','#1a2236','#222a40','#2c3448'],far1:'#1e2434',far2:'#262c3e',far2w:'#8a9ab8',walk:'#c8ccd6',walk2:'#b0b6c2',curb:'#e0e4ec',road:'#2a2e3a',road2:'#343846',grass:'#d8dce6',grass2:'#c0c6d2',leaf:'#4a5a5a',leaf2:'#c8d0dc',leafH:'#eef2f8'},
 pastel:{sky:['#f7c6d9','#f9d3df','#fbdfe4','#fde9e6','#fff2e8'],star:'nostar',moon:'#fff8e0',moon2:'#ffe9b0',far1:'#e8c3d6',far1w:'#f2d6e2',far2:'#dfb8cf',far2w:'#f6e0ea',ol:'#6a4a62',brick:'#e89a9a',brick2:'#d88a8e',brickH:'#f4b4b0',mortar:'#c97f86',con:'#c9b8d6',con2:'#b8a6c8',conH:'#dccbe6',glass:'#9cc8e8',glass2:'#88b6da',glassH:'#c4e2f6',cream:'#fbe3c4',cream2:'#efcfaa',creamH:'#fff0d8',gym:'#8c84b0',gym2:'#7a729e',gymH:'#a49cc6',win:'#7a6a9a',lit:'#fff4c0',lit2:'#ffe08a',litD:'#e8c27a',warm:'#ffffff',red:'#f26a8a',redH:'#ff9ab0',redD:'#c84a6a',leaf:'#7cc48a',leaf2:'#96d6a0',leafH:'#bfeac0',trunk:'#b08070',grass:'#a8dca8',grass2:'#bce6b8',walk:'#e6d6e0',walk2:'#d8c6d2',curb:'#f2e6ee',road:'#b0a0b8',road2:'#a898b0',lane:'#fff6d0',lamp:'#8a7a9a',glow:'#fff4c0',gray:'#a898b0',white:'#fff'},
 neon:{sky:['#07021a','#0d0428','#160636','#200a44','#2c0e50'],star:'#6a4ab0',moon:'#ff4fd8',moon2:'#ff9ae8',far1:'#120830',far1w:'#3ae0ff',far2:'#1a0c3e',far2w:'#ff4fd8',ol:'#000',brick:'#24123a',brick2:'#1c0e2e',brickH:'#3a1e5a',mortar:'#140a24',con:'#2a1a4a',con2:'#20143a',conH:'#4a2a7a',glass:'#0e1838',glass2:'#0a1230',glassH:'#2a4aa0',cream:'#1c1440',cream2:'#160f34',creamH:'#2c2060',gym:'#140c2c',gym2:'#100824',gymH:'#24164a',win:'#120a26',lit:'#3ae0ff',lit2:'#1ab0d8',litD:'#0a7090',warm:'#b0f6ff',red:'#ff2fa8',redH:'#ff8ad8',redD:'#9a0a6a',leaf:'#0e3a3a',leaf2:'#126060',leafH:'#1aa0a0',trunk:'#1a0e2a',grass:'#0c2a2a',grass2:'#104040',walk:'#1a1030',walk2:'#140c26',curb:'#3a2a6a',road:'#0a0618',road2:'#120a26',lane:'#ff2fa8',lamp:'#2a1a4a',glow:'#3ae0ff',gray:'#4a3a7a',white:'#ffe0ff'},
 mono:{sky:['#0c0c0c','#121212','#181818','#1e1e1e','#242424'],star:'#9a9a9a',moon:'#d8d8d8',moon2:'#aaaaaa',far1:'#1a1a1a',far1w:'#333',far2:'#222',far2w:'#444',brick:'#3a3a3a',brick2:'#2e2e2e',brickH:'#4a4a4a',mortar:'#262626',con:'#444',con2:'#383838',conH:'#555',glass:'#2a2a2a',glass2:'#222',glassH:'#3a3a3a',cream:'#5a5a5a',cream2:'#4a4a4a',creamH:'#6a6a6a',gym:'#262626',gym2:'#1e1e1e',gymH:'#333',lit:'#d8d8d8',lit2:'#aaaaaa',litD:'#777',warm:'#f0f0f0',leaf:'#2e2e2e',leaf2:'#3a3a3a',leafH:'#4e4e4e',grass:'#262626',grass2:'#2e2e2e',trunk:'#1e1e1e',walk:'#2e2e2e',walk2:'#262626',curb:'#444',road:'#111',road2:'#161616',lane:'#666',glow:'#d8d8d8',gray:'#666',white:'#e8e8e8'}
};
const P=(a,b,c)=>{x.fillStyle=c;x.fillRect(a-ox,b,1,1)};
const R=(a,b,w,h,c)=>{if(c===C.ol&&FLAT)return;x.fillStyle=c;x.fillRect(a-ox,b,w,h)};const FLAT=true;
const D=(a,b,w,h,c1,c2)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)P(a+i,b+j,((i+j)&1)?c1:c2)};
// 3x5 픽셀 글꼴
const F={A:'010101111101101',D:'110101101101110',E:'111100110100111',G:'011100101101011',M:'101111111101101',N:'110101101101101',O:'010101101101010',P:'110101110100100',R:'110101110101101',S:'011100010001110',T:'111010010010010',W:'101101111111101',Y:'101101010010010',' ':'000000000000000','0':'111101101101111','4':'101101111001001','2':'110001010100111','9':'111101111001111','1':'010110010010111','3':'111001011001111',C:'011100100100011',H:'101101111101101',I:'111010010010111',K:'101101110101101',L:'100100100100111',U:'101101101101111',B:'110101110101110',F:'111100110100100',V:'101101101101010',X:'101101010101101','2':'110001010100111','4':'101101111001001'};
const txt=(s,a,b,c)=>{[...s].forEach((ch,k)=>{const g=F[ch]||F[' '];for(let i=0;i<15;i++)if(g[i]=='1')P(a+k*4+(i%3),b+((i/3)|0),c)})};
// 창문 (테두리 + 불빛)
function win(a,b,w,h,on,frame){if(frame!==C.ol)R(a-1,b-1,w+2,h+2,frame);R(a,b,w,h,C.win)}
function building(a,b,w,h,base,shade,hi){R(a,b,w,h,base);R(a,b,w,2,hi);}

function sky(){const bands=[0,18,36,54,72];bands.forEach((y,i)=>{x.fillStyle=C.sky[i];x.fillRect(0,y,W,18)});
 for(let i=1;i<bands.length;i++){for(let k=0;k<W;k++)if(k%2==0){x.fillStyle=C.sky[i];x.fillRect(k,bands[i]-1,1,1)}else{x.fillStyle=C.sky[i-1];x.fillRect(k,bands[i],1,1)}}
 if(C.star!='nostar')for(let i=0;i<46;i++){const sx=((i*53-ox*.1)%W+W)%W,sy=(i*29)%44;x.fillStyle=i%5?C.star:'#ffffff';x.fillRect(sx|0,sy,1,1)}
 // 달
 const mx=250-((ox*.05)|0),my=14;x.fillStyle=C.moon;x.fillRect(mx-3,my-5,7,11);x.fillRect(mx-5,my-3,11,7);x.fillRect(mx-4,my-4,9,9);x.fillStyle=C.moon2;x.fillRect(mx+1,my-1,2,2);x.fillRect(mx-2,my+2,1,1);if(TH!='day'){x.fillStyle=C.sky[0];x.fillRect(mx+2,my-5,3,4);x.fillRect(mx+4,my-4,2,6);}
}
function skyline(){
 const o1=ox*.35,o2=ox*.6;
 for(let i=0;i<40;i++){const bx=i*22-(o1%22)-22+(((ox*.35/22)|0)*0),w=14+(i*7)%9,h=22+((i*37)%28),bxx=((i*22-o1)%(W+44)+W+44)%(W+44)-22;x.fillStyle=C.far1;x.fillRect(bxx,GY-h,w,h);x.fillStyle=C.far1w;for(let j=0;j<h-4;j+=4)for(let k=2;k<w-2;k+=3)if((i*j+k)%7==0)x.fillRect(bxx+k,GY-h+2+j,1,1)}
 for(let i=0;i<30;i++){const w=18+(i*5)%10,h=14+((i*23)%18),bxx=((i*31-o2)%(W+62)+W+62)%(W+62)-31;x.fillStyle=C.far2;x.fillRect(bxx,GY-h,w,h);x.fillStyle=C.far2w;for(let j=0;j<h-4;j+=4)for(let k=2;k<w-2;k+=4)if((i+j+k)%5==0)x.fillRect(bxx+k,GY-h+2+j,2,1)}
}
// 상혁이네 — 벽돌 빌라
function villaA(a){const b=46,w=86,h=GY-b;building(a,b,w,h,C.brick,C.brick2,C.brickH);
 for(let j=2;j<h;j+=3){R(a,b+j,w,1,C.mortar);const off=((j/3)&1)?3:0;for(let k=off;k<=w/2;k+=6){R(a+k,b+j-2,1,2,C.mortar);R(a+w-1-k,b+j-2,1,2,C.mortar)}}
 R(a-3,b-4,w+6,4,C.con2);R(a-3,b-4,w+6,1,C.conH);R(a+8,b-11,12,7,C.con);R(a+8,b-11,12,1,C.conH);R(a+60,b-14,1,10,C.gray);R(a+57,b-14,7,1,C.gray);
 for(let f=0;f<3;f++){const y=b+5+f*13;[6,22,w-32,w-16].forEach(wx=>{win(a+wx,y,10,7,0,C.ol);R(a+wx-1,y+8,12,1,C.conH)})}
 R(a+37,b+29,12,h-29,'#2a1f1c');R(a+38,b+30,4,h-31,C.litD);R(a+44,b+30,4,h-31,C.litD);R(a+40,b+24,6,3,C.conH);R(a+33,GY-2,20,2,C.curb);
}
// 수연이네 — 유리 오피스텔
function tower(a,b=12){const w=57,h=GY-b;building(a,b,w,h,C.glass,C.glass2,C.glassH);
 for(let y=b+6;y+4<=GY-20;y+=7)for(let c=0;c<7;c++){R(a+5+c*7,y,5,4,C.glass2)}
 R(a-2,b-3,w+4,3,C.con);R(a+20,b-8,16,5,C.con2);R(a+28,b-14,1,6,C.gray);P(a+28,b-15,C.redH);
 R(a+5,GY-11,w-10,11,C.litD);R(a+6,GY-10,w-12,9,C.lit);R(a+28,GY-10,1,9,C.lit2);R(a+2,GY-14,w-4,2,C.con2);
}
// 아파트 (수연이네 단지)
function apt(a,b,num){const w=51,h=GY-b;building(a,b,w,h,C.cream,C.cream2,C.creamH);
 R(a-1,b-2,w+2,2,C.cream2);R(a+16,b-7,19,5,C.cream2);R(a+20,b-10,11,3,C.con2);
 txtC(num,a,w,b+3,C.cream2);
 for(let y=b+11;y+4<=GY-10;y+=5)for(let u=0;u<3;u++){const ux=a+3+u*15;R(ux,y,14,3,C.win);R(ux,y+3,14,1,C.creamH);R(ux+6,y,1,3,C.cream2)}
 R(a,GY-9,w,9,C.cream2);for(const cx of [2,14,35,47])R(a+cx,GY-9,2,9,C.cream);R(a+20,GY-8,11,8,C.glass);R(a+25,GY-8,1,8,C.cream2);}
// 공원
function tree(a,s){const t=GY;R(a+s,t-10,2,10,C.trunk);
 const r=s;for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){if(i*i+j*j<=r*r){const c=(j<-r/3&&i<0)?C.leafH:(j>r/3||i>r/2)?C.leaf:C.leaf2;P(a+s+i,t-12-r+j,C.leaf2)}}}
function park(a){R(a,GY-3,116,3,C.grass);for(let i=0;i<116;i+=2)P(a+i,GY-4,(i%6)?C.grass2:C.grass);
 tree(a+4,9);tree(a+28,9);tree(a+52,9);tree(a+76,9);tree(a+100,9);
 for(let i=0;i<116;i+=5){R(a+i,GY-8,1,6,C.gray)}R(a,GY-7,116,1,C.gray);
 R(a+44,GY-7,14,2,'#6a4a32');R(a+44,GY-9,14,1,'#7d5a3c');R(a+45,GY-5,1,3,C.ol);R(a+56,GY-5,1,3,C.ol);
}
// 백화점
function store(a){const b=10,w=160,h=GY-b;building(a,b,w,h,C.cream,C.cream2,C.creamH);
 R(a-2,b-3,w+4,3,C.con2);R(a-2,b-3,w+4,1,C.conH);
 R(a+41,b+4,78,9,C.red);txtC('DEPT STORE',a,w,b+6,C.white);
 for(let f=0;f<5;f++){const y=b+20+f*10;R(a+2,y+7,w-4,1,C.cream2);for(let k=0;k<12;k++)win(a+4+k*13,y,9,5,0,C.cream2)}
 for(let k=0;k<5;k++){R(a+31+k*20,GY-13,18,13,C.lit);R(a+39+k*20,GY-13,2,13,C.lit2)}
 for(let k=0;k<20;k++)R(a+30+k*5,GY-18,5,3,k%2?C.red:C.white);R(a+30,GY-15,100,1,C.redD);
 R(a+6,GY-24,1,24,C.gray);R(a+7,GY-24,6,9,C.redD);R(a+w-7,GY-24,1,24,C.gray);R(a+w-13,GY-24,6,9,C.redD);
}
const txtC=(s,a,w,b,c)=>txt(s,a+Math.floor((w-(s.length*4-1))/2),b,c);
// 편의점
function cvs(a){const b=62,w=62,h=GY-b;building(a,b,w,h,C.con,C.con2,C.conH);
 R(a,b,w,8,C.gray);txtC('CVS 24',a,w,b+2,C.white);
 R(a+4,b+12,20,h-12,C.glass2);R(a+w-24,b+12,20,h-12,C.glass2);
 for(const yy of [16,22]){R(a+6,b+yy,16,1,C.glassH);R(a+w-22,b+yy,16,1,C.glassH)}
 R(a+26,b+12,10,h-12,C.glass);R(a+30,b+12,2,h-12,C.con2);
 R(a-6,GY-8,5,8,C.gray);R(a-6,GY-8,5,2,C.conH);}
// 마트
function mart(a){const b=50,w=84,h=GY-b;building(a,b,w,h,C.cream,C.cream2,C.creamH);
 R(a+10,b+4,64,10,C.cream2);txtC('MART',a,w,b+7,C.white);
 for(let k=0;k<5;k++)R(a+9+k*14,b+20,10,6,C.win);
 R(a+6,GY-16,72,16,C.glass2);R(a+38,GY-16,8,16,C.glass);
 for(let k=0;k<3;k++){R(a-22+k*8,GY-6,7,6,C.trunk);R(a-22+k*8,GY-6,7,1,C.conH)}}
// 정육점
function butcher(a){const b=58,w=52,h=GY-b;building(a,b,w,h,C.brick,C.brick2,C.brickH);
 for(let j=2;j<h-18;j+=3)R(a,b+j,w,1,C.mortar);
 R(a+6,b+3,40,8,C.con2);txtC('MEAT',a,w,b+5,C.white);
 for(let k=0;k<10;k++)R(a+1+k*5,GY-21,5,3,k%2?C.white:C.gray);R(a+1,GY-18,50,1,C.con2);
 for(const wx of [3,33]){R(a+wx,GY-16,16,16,C.glass2);for(let k=0;k<2;k++){R(a+wx+4+k*6,GY-15,1,3,C.gray);R(a+wx+2+k*6,GY-12,5,6,C.brickH)}}
 R(a+21,GY-16,10,16,C.con2);}
let SIG=[];
function signals(){for(const p of SIG){R(p,GY-13,1,15,'#5c5c62');R(p-1,GY+1,3,1,'#5c5c62');R(p-2,GY-22,5,9,'#141416');R(p-2,GY-22,5,1,'#3a3a40');
 R(p-1,GY-20,3,3,'#d8d8d8');R(p-1,GY-16,3,3,'#2c2c30');R(p+1,GY-8,2,2,'#3a3a40')}}
// 횡단보도 + 신호등
function cross(a){R(a,GY+5,38,H-GY-5,C.road);for(let y=GY+6;y<H-1;y+=3)R(a,y,38,2,C.gray);
 SIG.push(a-4);}
// 수연이네 회사
function office(a){const b=6,w=76,h=GY-b;building(a,b,w,h,C.con,C.con2,C.conH);
 R(a-2,b-3,w+4,3,C.con2);R(a+28,b-8,20,5,C.con2);
 R(a+14,b+4,48,9,C.gray);txtC('OFFICE',a,w,b+6,C.white);
 for(let y=b+18;y+3<=GY-22;y+=6){R(a+4,y,w-8,3,C.glass2);for(let k=1;k<6;k++)R(a+4+k*((w-8)/6|0),y,1,3,C.con)}
 R(a+2,GY-20,w-4,2,C.conH);R(a+18,GY-16,40,16,C.glass2);R(a+32,GY-16,12,16,C.glass);R(a+37,GY-16,2,16,C.con2);
 R(a+8,GY-10,4,10,C.gray);R(a+w-12,GY-10,4,10,C.gray);}
// 체육관
function gym(a){const b=40,w=120,h=GY-b;building(a,b,w,h,C.gym,C.gym2,C.gymH);
 for(let j=3;j<h;j+=4)R(a,b+j,w,1,C.gym2);
 R(a-2,b-3,w+4,3,C.con2);R(a+21,b-9,78,6,C.red);txtC('WON GYM',a,w,b-8,C.white);
 for(let k=0;k<4;k++){const wx=a+4+k*30;R(wx,b+8,22,14,C.win);R(wx+10,b+8,2,4,C.gymH);R(wx+8,b+12,6,8,C.gymH)}
 R(a+49,GY-15,10,15,C.glass);R(a+61,GY-15,10,15,C.glass);R(a+50,GY-14,2,10,C.glassH);R(a+68,GY-14,2,10,C.glassH);
}
function street(){R(ox,GY,W,4,C.walk);for(let i=0;i<WORLD;i+=8){R(i,GY,1,4,C.walk2)}R(ox,GY+4,W,1,C.curb);R(ox,GY+5,W,H-GY-5,C.road);D(ox,GY+5,W,1,C.road,C.road2);
 for(let i=0;i<WORLD;i+=20)R(i,GY+12,10,1,C.lane);
 for(const i of [24,206,460,556,617,789,1058,1160]){R(i,GY-26,1,26,C.lamp);R(i,GY-27,5,1,C.lamp);R(i+4,GY-27,2,2,C.glow);}
 
}
const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
const PALS={gb:['#0f380f','#306230','#8bac0f','#9bbc0f'],pc98:['#000000','#14103a','#2c2470','#5a3aa0','#9a5ac8','#e888c8','#ffc8b0','#fff4e0','#1c4a7a','#3a8ab8','#8a1a3a','#e0485a','#f0b040','#3a6a3a'],bit:['#0c0c0c','#e8e4dc'],gray:Array.from({length:16},(_,i)=>{const v=Math.round(13+i*(220-13)/15).toString(16).padStart(2,'0');return '#'+v+v+v})};
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
function post(){const S=window.STREET_STYLE===undefined?'gray':window.STREET_STYLE;if(!S)return;const cv=x.canvas;
 if(S=='nes'){const t=document.createElement('canvas');t.width=W/2;t.height=H/2;const tx=t.getContext('2d');tx.imageSmoothingEnabled=false;tx.drawImage(cv,0,0,W/2,H/2);x.imageSmoothingEnabled=false;x.drawImage(t,0,0,W,H);return}
 const pal=PALS[S].map(hex),img=x.getImageData(0,0,W,H),d=img.data;
 for(let i=0;i<W*H;i++){const px=i%W,py=(i/W)|0,o=i*4;let r=d[o],g=d[o+1],b=d[o+2];const th=(BAY[(py&3)*4+(px&3)]/16-.5);
  if(S=='bit'){if(r>120&&r>g*1.8&&r>b*1.8){const c=pal[0];d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];continue}const l=(r*.3+g*.59+b*.11)/255+th*.5;const c=l>.42?pal[1]:pal[0];d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];continue}
  if(S=='gray'){if(r>100&&r>g*1.8&&r>b*1.8){const c=pal[4];d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];continue}const n=pal.length;const l=Math.min(.999,Math.max(0,Math.pow((r*.3+g*.59+b*.11)/255,.85)+(FLAT?0:th/(n-1))));const c=pal[(l*n)|0];d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];continue}
  if(S=='gb'){const l=Math.min(.999,Math.max(0,(r*.3+g*.59+b*.11)/255*1.25+th*.25));const c=pal[(l*4)|0];d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];continue}
  r+=th*40;g+=th*40;b+=th*40;let best=0,bd=1e9;for(let k=0;k<pal.length;k++){const q=pal[k],dd=(r-q[0])**2+(g-q[1])**2+(b-q[2])**2;if(dd<bd){bd=dd;best=k}}const c=pal[best];d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2]}
 x.putImageData(img,0,0)}
function fx(){const t=(Date.now()/16)|0;
 if(TH=='rain'){ // 젖은 도로 반사 + 비
  for(const [a,w,c] of [[30,40,C.lit],[110,56,C.lit],[340,100,C.lit],[516,72,C.red],[200,80,C.leaf2]]){for(let j=0;j<7;j++)for(let i=0;i<w;i+=2){if((i+j*3+t)%5<2){x.fillStyle=c;x.globalAlpha=.25-j*.03;x.fillRect(a+i-ox,GY+5+j*2,1,1)}}}x.globalAlpha=1;
  x.fillStyle='#aab6d0';for(let i=0;i<140;i++){const rx=(i*41+t*2)%W,ry=(i*23+t*5)%H;x.globalAlpha=.5;x.fillRect(rx,ry,1,3)}x.globalAlpha=1}
 if(TH=='snow'){ // 지붕 눈 + 눈송이
  for(const [a,y,w] of [[40,40,51],[95,32,51],[150,46,51],[394,62,62],[466,50,84],[562,58,52],[620,7,164],[794,3,80],[930,37,124],[1061,42,92]]){R(a,y-1,w,2,'#eef2f8');for(let i=0;i<w;i+=3)P(a+i,y-2,'#dfe4ee')}
  const hs=n=>{n=Math.imul(n^61,2654435761)>>>0;n^=n>>>15;return (n%10000)/10000};for(let i=0;i<110;i++){const sx=((hs(i)*W+t*.25*(1+i%3)+Math.sin(t/30+i)*2)%W+W)%W|0,sy=((hs(i+999)*H+t*(.4+(i%3)*.25))%H)|0;x.fillStyle='#fff';x.globalAlpha=i%3?.8:.5;x.fillRect(sx,sy,i%4?1:2,i%4?1:2)}x.globalAlpha=1}
 if(TH=='mono'){ // 빨강 포인트만 남기기
 }
}
const ZONES=[[0,'수연이네'],[210,'공원'],[390,'편의점'],[464,'마트'],[558,'정육점'],[620,'백화점'],[792,'회사'],[928,'체육관'],[1060,'상혁이네']];
window.Street={W,H,WORLD,ZONES,draw(ctx,o,th){TH=th||window.STREET_THEME||'night';C=Object.assign({},BASE,THEMES[TH]);x=ctx;ox=Math.round(o);x.imageSmoothingEnabled=false;sky();skyline();apt(40,40,'101');apt(95,32,'102');apt(150,46,'103');park(214);cvs(394);mart(466);butcher(562);store(622);office(796);gym(932);villaA(1064);street();SIG=[];cross(344);cross(882);if(window.STREET_CHARS)window.STREET_CHARS({x,ox,R,P,GY,txt});fx();post();signals();if(window.STREET_AFTER)window.STREET_AFTER({x,ox,R,P,GY,txt});}};
})();
