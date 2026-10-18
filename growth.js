'use strict';
/* Growth hooks: shareable verdict links, share card, poster CTA. */
(function(){
Viral.init({slug:'askthecourt',name:'Ask The Court',url:'https://mxhoaib.github.io/askthecourt/',emoji:'⚖️',c1:'#0071e3',c2:'#5e5ce6',light:true});
Viral.heroPay(document.querySelector('header.hero'),{item:'poster',cta:'🖼 Order a verdict poster',price:9,note:'Print-ready, via PayPal'});
const bar=Viral.payBar({item:'poster',label:'Frame the ruling',cta:'Verdict poster',price:9});
const old=$('#share');if(old)old.remove();
const mount=document.createElement('div');mount.style.cssText='max-width:560px;margin:0 auto';$('#out').appendChild(mount);
function caseUrl(){return Viral.challengeUrl({n1:$('#n1').value.trim(),a1:$('#a1').value.trim(),n2:$('#n2').value.trim(),a2:$('#a2').value.trim(),k:tries})}
const panel=Viral.sharePanel(mount,()=>last?{kicker:`Case No. ${last.case} · ${last.topic}`,big:last.winner==='Nobody'?'No winner':last.winner+' wins',line:last.text,sub:last.pen||last.why,cta:'Take your case to court',
 text:`⚖️ The Court has ruled: ${last.winner==='Nobody'?'no winner':last.winner+' wins'}. See the verdict, or appeal:`,url:caseUrl()}:{},{title:'Send the verdict to the other side',copyLabel:'🔗 Copy verdict link',noName:true});
const _go=go;
go=function(add){_go(add);if(!last||$('#out').hidden)return;panel.update();bar.show();Viral.count('verdict','Verdict issued')};
const ch=Viral.readChallenge();
if(ch&&typeof ch.a1==='string'&&typeof ch.a2==='string'&&ch.a1.trim()&&ch.a2.trim()){
 $('#n1').value=Viral.clean(ch.n1,30);$('#a1').value=Viral.clean(ch.a1,240);$('#n2').value=Viral.clean(ch.n2,30);$('#a2').value=Viral.clean(ch.a2,240);
 const k=Math.max(0,Math.min(50,parseInt(ch.k,10)||0));tries=k;go(k?'appeal'+k:'');
 Viral.banner(`⚖️ ${$('#n1').value||'Plaintiff'} vs ${$('#n2').value||'Defendant'}: the Court has ruled. Got your own petty dispute?`,'Present your own case',()=>{['#n1','#a1','#n2','#a2'].forEach(s=>$(s).value='');$('#court').scrollIntoView({behavior:'smooth'});$('#n1').focus()},$('header.hero'));
}
})();
