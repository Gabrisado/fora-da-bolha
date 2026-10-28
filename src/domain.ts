import {classifyTopics,isPromotional} from '../scripts/news-lib.mjs';
export type Topic='explore'|'health'|'security'|'education'|'salary'|'migration';
export type Row={uf:string;value:number|null;deaths?:number;population?:number};
export type Flow={from:string;to:string;value:number};
export type News={uf:string;topic:string;title:string;url:string;publishedAt:string;source:string;institutional:boolean;image?:{src:string;credit:string;originalUrl:string;permissionUrl:string};publisher?:{name:string;initials:string}};
export type Indicator={id:Topic;title:string;unit:string;direction:'lower'|'higher';period:string;source:string;sourceUrl:string;populationSourceUrl?:string;collectedAt:string;note:string;rows:Row[];status:string};
export type Visual={height:number;color:string;rank:number|null;quality:number|null};
export function rankValues(rows:Row[],direction:'lower'|'higher'):Record<string,number>{
 const valid=rows.filter((r):r is Row&{value:number}=>r.value!==null&&Number.isFinite(r.value)).sort((a,b)=>direction==='lower'?a.value-b.value:b.value-a.value);
 const ranks:Record<string,number>={};let rank=1;
 valid.forEach((r,i)=>{if(i===0||r.value!==valid[i-1].value)rank=i+1;ranks[r.uf]=rank;});return ranks;
}
export function visualValues(rows:Row[],direction:'lower'|'higher',mode:'best'|'worst',colorScale:'linear'|'rank'='linear'):Record<string,Visual>{
 const valid=rows.flatMap(r=>r.value!==null&&Number.isFinite(r.value)?[r.value]:[]);
 const min=Math.min(...valid),max=Math.max(...valid),ranks=rankValues(rows,direction);
 const distinct=[...new Set(valid)].sort((a,b)=>a-b);
 return Object.fromEntries(rows.map(r=>{
  if(r.value===null||!Number.isFinite(r.value))return[r.uf,{height:.12,color:'#343e43',rank:null,quality:null}];
  const raw=max===min?.5:(r.value-min)/(max-min),q=direction==='higher'?raw:1-raw;
  const percentile=distinct.length<=1?.5:distinct.indexOf(r.value)/(distinct.length-1);
  const colorQ=colorScale==='rank'?(direction==='higher'?percentile:1-percentile):q;
  const stops=[[112,37,48],[186,106,91],[204,204,157],[114,186,153]],position=colorQ*3,index=Math.min(2,Math.floor(position)),t=position-index;
  const color='#'+stops[index].map((c,i)=>Math.round(c+(stops[index+1][i]-c)*t).toString(16).padStart(2,'0')).join('');
  return[r.uf,{height:.13+(mode==='best'?q:1-q)*1.5,color,rank:ranks[r.uf],quality:q}];
 }));
}
export function topFlows(flows:Flow[],uf:string,direction:'in'|'out'){
 return flows.filter(f=>f.from!==f.to&&Number.isFinite(f.value)&&f.value>0&&(direction==='in'?f.to===uf:f.from===uf)).sort((a,b)=>b.value-a.value).slice(0,5);
}
export function eligibleNews(rows:News[],uf:string,topic:string,now=new Date()){
 const seen=new Set<string>();const sorted=rows.filter(n=>{
  const age=now.getTime()-Date.parse(n.publishedAt);let url:URL;try{url=new URL(n.url)}catch{return false}
  if(isPromotional(n.url)||!classifyTopics({title:n.title,url:n.url}).includes(n.topic)||n.uf!==uf||n.topic!==topic||!['https:','http:'].includes(url.protocol)||!Number.isFinite(age)||age<0||age>30*86400000||seen.has(url.href))return false;
  seen.add(url.href);return true;
 }).sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt));
 const selected=sorted.slice(0,5);const illustrated=sorted.find(n=>n.image&&now.getTime()-Date.parse(n.publishedAt)<=86400000);if(illustrated&&!selected.some(n=>n.url===illustrated.url)&&selected.length===5)selected[4]=illustrated;return selected.sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt));
}
export const formatValue=(value:number|null,topic:Topic)=>value===null?'—':new Intl.NumberFormat('pt-BR',topic==='salary'?{style:'currency',currency:'BRL',maximumFractionDigits:0}:{maximumFractionDigits:topic==='education'?1:2}).format(value);

export type SourceStatus={uf:string|null;status:string;lastSuccess:string|null};
export function newsHealth(sources:SourceStatus[]|undefined,uf:string,now=new Date()){if(!sources?.length)return 'Situação das fontes indisponível.';const local=sources.filter(s=>s.uf===uf),failed=local.some(s=>s.status!=='ok'),stale=local.some(s=>!s.lastSuccess||now.getTime()-Date.parse(s.lastSuccess)>86400000);if(failed||stale)return 'Cobertura parcial: fonte estadual indisponível ou desatualizada. Exibimos o último cache válido.';if(sources.some(s=>s.uf===null&&s.status!=='ok'))return 'Cobertura parcial: uma ou mais fontes nacionais estão indisponíveis.';return ''}

export function nationalMortality(rows:Row[]){if(!rows.length||rows.some(r=>r.deaths===undefined||r.population===undefined||!Number.isFinite(r.deaths)||!Number.isFinite(r.population)||r.deaths<0||r.population<=0))return null;return rows.reduce((sum,r)=>sum+r.deaths!,0)/rows.reduce((sum,r)=>sum+r.population!,0)*100000}
