import {readFile,writeFile,rename} from 'node:fs/promises';
import {XMLParser} from 'fast-xml-parser';
import {feedExcerpt,mentionsState,TOPICS,classifyTopics,isElectionTable,normalizeArticle,mergeNewsCache} from './news-lib.mjs';
import {newsFeeds} from './news-feeds.mjs';
const root=new URL('../public/data/',import.meta.url),now=new Date();
const states=JSON.parse(await readFile(new URL('states.json',root),'utf8')),feeds=newsFeeds(states);
let previous={items:[],updatedAt:null,sourceStatus:[]};try{previous=JSON.parse(await readFile(new URL('news.json',root),'utf8'))}catch{}
const errors=[],fresh=[],sourceStatus=[],parser=new XMLParser({processEntities:false,ignoreAttributes:false});let index=0,successes=0;
function ibgeDate(value){const m=String(value).match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2}:\d{2})$/);return m?`${m[3]}-${m[2]}-${m[1]}T${m[4]}-03:00`:value}
async function collect(feed){
 try{
  const response=await fetch(feed.url,{signal:AbortSignal.timeout(20000),headers:{'User-Agent':'FolhaDaBolha/0.1 (public RSS cache; no article scraping)'}});if(!response.ok)throw Error(`HTTP ${response.status}`);
  let articles;
  if(feed.type==='ibge'){const d=await response.json();if(!Array.isArray(d.items))throw Error('API sem itens');articles=d.items.map(i=>({title:i.titulo,description:i.introducao,url:i.link,date:ibgeDate(i.data_publicacao)}))}
  else{const parsed=parser.parse(await response.text()),channel=parsed.rss?.channel;if(!channel?.item)throw Error('Feed RSS sem itens');if(feed.uf&&!mentionsState(String(channel.title),feed.stateName))throw Error('Canal recebido não confirma a UF esperada');articles=(Array.isArray(channel.item)?channel.item:[channel.item]).map(i=>({title:i.title,description:String(i['atom:subtitle']??'')+' '+feedExcerpt(i.description),url:i.link,date:i.pubDate}))}
  let accepted=0;
  for(const raw of articles){const article=normalizeArticle(raw,now);if(!article)continue;const text=article.title+' '+article.description;
   const url=new URL(article.url),pathUf=url.hostname==='g1.globo.com'?url.pathname.split('/')[1]?.toUpperCase():null;
   const scopedUf=states.some(s=>s.uf===pathUf)?pathUf:null;
   for(const state of states){if(scopedUf?state.uf!==scopedUf:!mentionsState(text,state.name))continue;if(feed.uf&&state.uf!==feed.uf)continue;
    for(const topic of classifyTopics(article)){fresh.push({uf:state.uf,topic,title:article.title,url:article.url,publishedAt:article.publishedAt,source:feed.name,sourceUrl:feed.url,institutional:feed.institutional,classificationVersion:3});accepted++}
   }
  }
  successes++;sourceStatus.push({url:feed.url,name:feed.name,uf:feed.uf??null,lastSuccess:now.toISOString(),accepted,status:'ok'});
 }catch(e){errors.push({source:feed.name,error:e.message});const old=previous.sourceStatus?.find(s=>s.url===feed.url);sourceStatus.push({url:feed.url,name:feed.name,uf:feed.uf??null,lastSuccess:old?.lastSuccess??null,accepted:0,status:'failed'})}
}
// Bounded concurrency and one request per feed per cycle, never per map click.
await Promise.all(Array.from({length:4},async()=>{while(index<feeds.length){const feed=feeds[index++];await collect(feed)}}));
const validPrevious=previous.items.filter(n=>{
 if(!normalizeArticle({title:n.title,url:n.url,date:n.publishedAt},now))return false;
 if(isElectionTable(n.title))return false;
 const url=new URL(n.url),pathUf=url.hostname==='g1.globo.com'?url.pathname.split('/')[1]?.toUpperCase():null;
 if(states.some(s=>s.uf===pathUf)&&n.uf!==pathUf)return false;
 return n.classificationVersion===3||(classifyTopics({title:n.title}).includes(n.topic)&&(pathUf===n.uf||mentionsState(n.title,states.find(s=>s.uf===n.uf)?.name??'UF inválida')));
});
if(!successes)throw Error('Todas as fontes falharam: snapshot anterior preservado.');
const items=mergeNewsCache(validPrevious,fresh,now);
const coverage=Object.fromEntries(states.map(s=>[s.uf,Object.fromEntries(Object.keys(TOPICS).map(t=>[t,items.filter(i=>i.uf===s.uf&&i.topic===t).length]))]));
const result={updatedAt:successes?now.toISOString():previous.updatedAt,attemptedAt:now.toISOString(),items,errors,sources:feeds,sourceStatus,coverage};
await writeFile(new URL('news.json.tmp',root),JSON.stringify(result));await rename(new URL('news.json.tmp',root),new URL('news.json',root));
console.log('Notícias:',items.length,'combinações UF/tema/link;',successes+'/'+feeds.length,'fontes responderam. Falhas:',errors);
