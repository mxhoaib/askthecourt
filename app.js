'use strict';
const $=s=>document.querySelector(s),cv=$('#card'),x=cv.getContext('2d');
const pick=(a,r)=>a[Math.floor(r()*a.length)%a.length];
function rng(seed){let h=2166136261;for(const c of seed)h=Math.imul(h^c.charCodeAt(0),16777619);return()=>{h^=h<<13;h^=h>>>17;h^=h<<5;return((h>>>0)%10000)/10000}}
const TOPICS=[[/dish|fork|spoon|plate|sink/i,'Kitchen Crimes'],[/toilet|seat|towel|shower/i,'Bathroom Affairs'],[/pizza|pineapple|food|eat|cook|fries|snack/i,'Culinary Disputes'],[/temp|thermostat|cold|hot|ac|heat|window/i,'Climate Control'],[/text|reply|phone|seen|message|emoji/i,'Digital Etiquette'],[/late|time|minutes|early/i,'Punctuality'],[/remote|tv|show|movie|netflix|spoil/i,'Screen Rights'],[/car|drive|park|seat|music/i,'Vehicular Matters']];
function score(t){let s=Math.min(t.length,200)/40;
 if(/because|since|therefore|evidence|study|science/i.test(t))s+=3;if(/obviously|clearly|everyone knows|literally/i.test(t))s-=1.5;
 if(/!{2,}|[A-Z]{5,}/.test(t))s-=1;if(/\?/.test(t))s+=.5;if(/always|never/i.test(t))s-=1;if(/sorry|fair|compromise|both/i.test(t))s+=2;return s}
const OPEN=['Having reviewed the evidence and one (1) snack,','After a lengthy recess for tea,','Following careful deliberation and an eye-roll,','The Court, having heard more than it wanted to,'];
const WIN=['finds in favour of {w}.','rules decisively for {w}.','sides, reluctantly, with {w}.','declares {w} correct, and slightly smug.'];
const WHY={reason:'{w} used actual reasoning, which shocked the bench.',calm:'{l} said "obviously", which is not evidence.',shout:'{l} raised their voice in text form.',abs:'{l} used "always" or "never". The Court never trusts that.',kind:'{w} showed willingness to compromise, a rare and beautiful thing.',len:'{w} simply brought more argument to the argument.'};
const PEN=['{l} must make the next round of tea.','{l} owes {w} one (1) public "you were right".','{l} is sentenced to 3 days of silent dishwasher loading.','{l} must let {w} pick the next movie, no vetoes.','{l} shall carry all the groceries this week.','{l} must compliment {w}\'s taste, sincerely, twice.'];
const TIE=['The Court finds both parties equally ridiculous. Case dismissed; hug it out.','Hung jury. Rock-paper-scissors, best of three, is hereby ordered.'];
let last=null;
function verdict(seedAdd){const n1=$('#n1').value.trim()||'Plaintiff',n2=$('#n2').value.trim()||'Defendant',a1=$('#a1').value.trim(),a2=$('#a2').value.trim();
 if(!a1||!a2){alert('Both sides must present an argument.');return null}
 const r=rng(n1+a1+n2+a2+(seedAdd||''));const s1=score(a1)+r()*1.5,s2=score(a2)+r()*1.5;
 const topic=(TOPICS.find(([re])=>re.test(a1+' '+a2))||[0,'General Pettiness'])[1];
 if(Math.abs(s1-s2)<.3)return{topic,text:pick(TIE,r),winner:'Nobody',why:'',pen:'',case:Math.floor(r()*9000+1000)};
 const [w,l,aw,al]=s1>s2?[n1,n2,a1,a2]:[n2,n1,a2,a1];
 const why=/because|since|evidence|science|study/i.test(aw)?WHY.reason:/obviously|clearly|everyone knows/i.test(al)?WHY.calm:/!{2,}|[A-Z]{5,}/.test(al)?WHY.shout:/always|never/i.test(al)?WHY.abs:/sorry|fair|compromise|both/i.test(aw)?WHY.kind:WHY.len;
 const f=s=>s.replace(/\{w\}/g,w).replace(/\{l\}/g,l);
 return{topic,winner:w,text:pick(OPEN,r)+' the Court '+f(pick(WIN,r)),why:f(why),pen:'Sentence: '+f(pick(PEN,r)),case:Math.floor(r()*9000+1000)}}
function wrap(t,X,y,max,lh){const w=t.split(' ');let line='';for(const word of w){const tt=line+word+' ';if(x.measureText(tt).width>max&&line){x.fillText(line.trim(),X,y);line=word+' ';y+=lh}else line=tt}if(line)x.fillText(line.trim(),X,y);return y+lh}
function render(v){const S=1080;x.fillStyle='#f5f5f7';x.fillRect(0,0,S,S);x.fillStyle='#fff';x.beginPath();x.roundRect(60,60,S-120,S-120,48);x.fill();
 x.textAlign='center';x.fillStyle='#6e6e73';x.font='600 30px -apple-system,Helvetica,Arial';x.fillText('THE HONOURABLE COURT OF PETTY DISPUTES',S/2,150);
 x.font='26px -apple-system,Helvetica,Arial';x.fillText(`Case No. ${v.case} · ${v.topic}`,S/2,195);x.font='120px serif';x.fillText('⚖️',S/2,340);
 x.fillStyle='#1d1d1f';x.font='bold 84px -apple-system,Helvetica,Arial';x.fillText(v.winner==='Nobody'?'NO WINNER':v.winner.toUpperCase()+' WINS',S/2,470);
 x.font='38px -apple-system,Helvetica,Arial';let y=wrap(v.text,S/2,560,820,52);x.fillStyle='#6e6e73';x.font='italic 32px Georgia,serif';if(v.why)y=wrap(v.why,S/2,y+20,820,46);
 x.fillStyle='#0071e3';x.font='600 34px -apple-system,Helvetica,Arial';if(v.pen)wrap(v.pen,S/2,y+30,820,48);
 x.fillStyle='#6e6e73';x.font='24px -apple-system,Helvetica,Arial';x.fillText('SO ORDERED · '+new Date().toLocaleDateString(),S/2,960)}
let tries=0;function go(add){const v=verdict(add);if(!v)return;last=v;render(v);$('#out').hidden=false;$('#again').hidden=false;$('#out').scrollIntoView({behavior:'smooth',block:'center'})}
$('#judge').onclick=()=>{tries=0;go('')};$('#again').onclick=()=>go('appeal'+(++tries));
const toast=t=>{$('#toast').textContent=t;setTimeout(()=>$('#toast').textContent='',2500)};
$('#dl').onclick=()=>cv.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='verdict.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
$('#share').onclick=async()=>{const txt=`⚖️ ${last.winner==='Nobody'?'No winner':last.winner+' wins'} — ${last.text} ${last.pen}`;
 try{const b=await new Promise(r=>cv.toBlob(r));const f=new File([b],'verdict.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],text:txt});return}if(navigator.share){await navigator.share({text:txt,url:location.href});return}await navigator.clipboard.writeText(txt+' '+location.href);toast('Verdict copied!')}catch(e){toast('Share cancelled')}};
