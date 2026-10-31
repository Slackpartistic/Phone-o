// Phone-o scoring: plain maths, no AI. The same answers always give the same phones.
// Each phone has 0-10 ratings; answers turn into weights; phones are filtered, scored and ranked.
(function(){
const FACTORS=["camera","battery","performance","display","durability"];
const LABELS={camera:"great camera",battery:"long battery life",performance:"fast for games and apps",display:"excellent screen",durability:"tough and water resistant",size:"the size you wanted",updates:"updates for as long as you'll keep it"};
function sizeScore(s,pref){const t={small:6.1,regular:6.4,large:6.8}[pref];return t?Math.max(0,10-Math.abs(s-t)*10):null}
function recommend(PHONES,a,region="AU",top=3){
  const out=[];
  for(const p of PHONES){
    const r=p.regions[region]; if(!r||!r.available) continue;
    if(a.budget&&r.price>a.budget) continue;
    if(a.platform!=="either"&&p.os!==a.platform) continue;
    if(!a.refurbishedOk&&p.condition==="refurbished") continue;
    const parts={};
    for(const f of FACTORS) parts[f]={w:1+2*Number(a[f]??1),v:p.ratings[f]};
    const s=sizeScore(p.screen_in,a.size); if(s!==null) parts.size={w:4,v:s};
    parts.updates={w:a.keepYears>=6?5:a.keepYears>=4?3:1,v:Math.min(10,p.updates_years/a.keepYears*10)};
    let sum=0,ws=0; for(const k in parts){sum+=parts[k].w*parts[k].v;ws+=parts[k].w}
    const reasons=Object.entries(parts).filter(([,x])=>x.v>=8).sort((x,y)=>y[1].w*y[1].v-x[1].w*x[1].v).slice(0,2).map(([k])=>LABELS[k]);
    out.push({p,r,score:sum/ws,reasons});
  }
  out.sort((x,y)=>y.score-x.score||x.r.price-y.r.price||x.p.name.localeCompare(y.p.name));
  return out.slice(0,top);
}

const api={recommend,LABELS};
if(typeof module!=="undefined"&&module.exports) module.exports=api; else window.PhoneoScoring=api;
})();
