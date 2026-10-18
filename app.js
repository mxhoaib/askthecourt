(()=>{const $=id=>document.getElementById(id),URL0=location.origin+location.pathname;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const SENT=["Must make breakfast for {L} for 3 days straight.","Owes {W} one sincere, eye-contact apology — no 'but'.","Banned from choosing the movie for 2 weeks.","Must do the dishes tonight while humming the Law & Order theme.","Must post 'I was wrong' in the group chat (screenshot required).","Buys the next round of bubble tea.","Must say 'You were right, {W}' out loud, three times, with feeling.","Community service: folds all the laundry this weekend.","Must give a 30-second speech praising {W}'s wisdom."];
const MSG=["The judge is reviewing the evidence…","Consulting ancient relationship law…","Cross-examining the vibes…","Checking who left the dishes…"];
function local(a,b,ta,tb){// rule-based engine
 const score=t=>{t=t.toLowerCase();let s=0;
  s+=Math.min(t.split(/\s+/).length,120)/40;
  s+=(t.match(/\b(because|since|agreed|promised|fair|every time|always do|i offered|i asked)\b/g)||[]).length*1.2;
  s-=(t.match(/\b(whatever|stupid|shut up|never|always|you ALWAYS|idiot|hate)\b/gi)||[]).length*1.0;
  s-=(t.match(/!{2,}|[A-Z]{5,}/g)||[]).length*.8;
  s+=(t.match(/\b(sorry|i understand|i get that|to be fair|my bad)\b/g)||[]).length*1.5;return s};
 const sa=score(ta),sb=score(tb),d=Math.abs(sa-sb);const W=sa>=sb?a:b,L=W===a?b:a;
 const fair=Math.max(52,Math.min(97,Math.round(88-d*4+Math.random()*8)));
 const reason=d<1?`A genuinely close case. Both ${a} and ${b} made points, but ${W} edged it with a calmer, clearer argument. ${L}, the court notes you weren't wrong — just slightly less right.`:
  pick([`${W} presented a calmer, better-reasoned case with actual evidence. ${L}'s argument relied more on emotion than facts.`,`The court finds ${W}'s side more reasonable and considerate. ${L}, the court appreciates the passion but not the logic.`,`${W} showed more willingness to compromise, which this court rewards. ${L} is advised to read their own text back out loud.`]);
 return{winner:W,reasoning:reason,sentence:pick(SENT).replace(/{W}/g,W).replace(/{L}/g,L),fairness:fair}}
async function ai(a,b,ta,tb){const p=`You are a witty but fair courtroom judge settling a lighthearted personal argument. Side A (${a}): "${ta}". Side B (${b}): "${tb}". Respond ONLY with compact JSON: {"winner":"${a}" or "${b}" or "Both","reasoning":"2-3 funny but fair sentences","sentence":"one short funny harmless penalty for the loser","fairness":integer 50-99}`;
 const c=new AbortController();setTimeout(()=>c.abort(),20000);
 const r=await fetch("https://text.pollinations.ai/"+encodeURIComponent(p)+"?model=openai&seed="+Math.floor(Math.random()*1e6),{signal:c.signal});
 if(!r.ok)throw 0;const t=await r.text();const j=JSON.parse(t.slice(t.indexOf("{"),t.lastIndexOf("}")+1));
 if(!j.winner||!j.reasoning||!j.sentence)throw 0;j.fairness=Math.max(1,Math.min(100,parseInt(j.fairness)||80));return j}
function show(v,a,b){$("vCase").textContent=`${a} v. ${b}`;$("vWin").textContent=v.winner;$("vReason").textContent=v.reasoning;$("vSent").textContent=v.sentence;$("vScore").textContent=v.fairness+"/100";
 $("deliberate").classList.add("hidden");$("result").classList.remove("hidden");setTimeout(()=>$("vBar").style.width=v.fairness+"%",50);
 const u=URL0+"#v="+encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify({...v,a,b}))))),txt=`⚖️ The AI judge ruled: ${v.winner} wins ${a} v. ${b}! Sentence: ${v.sentence} Settle your own fight:`;
 $("wa").href="https://wa.me/?text="+encodeURIComponent(txt+" "+u);$("xx").href="https://x.com/intent/post?text="+encodeURIComponent(txt)+"&url="+encodeURIComponent(u);
 $("shr").onclick=()=>navigator.share?navigator.share({title:"AskTheCourt.ai verdict",text:txt,url:u}).catch(()=>{}):copy(u);$("cp").onclick=()=>copy(u);scrollTo({top:0,behavior:"smooth"})}
function copy(u){(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(()=>toast("Link copied!"),()=>prompt("Copy this link:",u))}
function toast(m){const t=$("toast");t.textContent=m;t.classList.add("on");setTimeout(()=>t.classList.remove("on"),1800)}
$("go").onclick=async()=>{const a=$("nA").value.trim()||"Plaintiff",b=$("nB").value.trim()||"Defendant",ta=$("tA").value.trim(),tb=$("tB").value.trim();
 if(ta.length<5||tb.length<5)return toast("Both sides must testify!");
 $("form").classList.add("hidden");$("deliberate").classList.remove("hidden");let i=0;const iv=setInterval(()=>$("dmsg").textContent=MSG[++i%MSG.length],1500);
 let v;try{v=await ai(a,b,ta,tb)}catch(e){v=local(a,b,ta,tb)}await new Promise(r=>setTimeout(r,1200));clearInterval(iv);show(v,a,b)};
$("ex").onclick=()=>{$("nA").value="Sam";$("tA").value="I cooked dinner, so Alex should do the dishes. That's what we agreed last month.";$("nB").value="Alex";$("tB").value="I did the dishes the last three nights and I'm exhausted. Sam ALWAYS says that!!"};
$("again").onclick=()=>{history.replaceState(null,"",URL0);$("result").classList.add("hidden");$("form").classList.remove("hidden");$("vBar").style.width=0};
$("pro").onclick=()=>toast("Detailed rulings are coming soon ⚖️");
const m=location.hash.match(/#v=(.+)/);if(m){try{const v=JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(m[1])))));$("form").classList.add("hidden");show(v,v.a,v.b)}catch(e){}}})();
