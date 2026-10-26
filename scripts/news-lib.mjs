export function mentionsState(text,name){
 const escaped=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`,'iu').test(text);
}
export const TOPICS={health:/saúde|hospital|vacina|\bsus\b|médic|mortalidade|posto de saúde|óbito/i,security:/segurança pública|homicíd|polícia|assassin|violência|crime|roubo|furto|assalto|prisão|preso/i,education:/educação|escola|ensino|ideb|professor|universidade|estudant/i,salary:/salário|rendimento|emprego|renda|trabalho|desemprego|remuneração/i};
export const isElectionTable=title=>/resultado da votação|votos por local de votação/i.test(title);
export function classifyTopics(article){
 const title=article.title??'',text=title+' '+(article.description??'');
 if(isElectionTable(title))return [];
 return Object.entries(TOPICS).filter(([topic,pattern])=>{
  if(!pattern.test(text))return false;
  if(topic==='education'&&/votação|zona eleitoral|seção eleitoral|local de votação|turno/i.test(title)&&!/ensino|ideb|professor|educação|aula|aluno|estudant|matrícula|universidade/i.test(title))return false;
  return true;
 }).map(([topic])=>topic);
}
export function normalizeArticle(article,now=new Date()){
 const entities={amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',nbsp:' '};
 const clean=value=>String(value??'').replace(/<[^>]*>/g,' ').replace(/&(amp|quot|apos|lt|gt|nbsp);/g,(_,key)=>entities[key]).replace(/\s+/g,' ').trim();
 const title=clean(article.title),description=clean(article.description);const date=new Date(article.date);let url;
 try{url=new URL(String(article.url))}catch{return null}
 const age=now.getTime()-date.getTime();if(!title||!['https:','http:'].includes(url.protocol)||!Number.isFinite(age)||age<0||age>30*86400000)return null;
 return{title,description,url:url.href,publishedAt:date.toISOString()};
}
export function mergeNewsCache(previous,fresh,now=new Date()){
 const map=new Map();
 for(const item of [...previous,...fresh]){const article=normalizeArticle({title:item.title,url:item.url,date:item.publishedAt},now);if(!article)continue;map.set(item.uf+'|'+item.topic+'|'+article.url,{...item,title:article.title,url:article.url,publishedAt:article.publishedAt})}
 const titles=new Set();return [...map.values()].sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).filter(item=>{const key=item.uf+'|'+item.topic+'|'+item.title.toLocaleLowerCase('pt-BR');if(titles.has(key))return false;titles.add(key);return true});
}
