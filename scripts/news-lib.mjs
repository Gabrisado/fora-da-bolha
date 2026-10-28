export function mentionsState(text,name){
 const escaped=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`,'iu').test(text);
}
export const TOPICS={sanitation:/saneamento|esgoto|esgotamento|água potável|abastecimento de água|rede de água/i,health:/saúde|hospita(?:l|is).*?(?:atendimento|leitos|cirurgia|condenad|residência|agredid|ameaç)|(?:inaugura|amplia|reforma|obras).*hospita(?:l|is)|vacina|\bsus\b|atendimento médic|mortalidade|posto de saúde|óbito|epidemia|dengue/i,security:/segurança pública|homicíd|polícia|policiais|assassin|violência|crime|roubo|furto|assalto|prisão|tráfico|feminicíd/i,education:/educação|escola|ensino|ideb|universidade|matrícula|cursos? técnicos?|\bfies\b|\benem\b|merenda|aulas|oficina.*estudantes|alunos (?:usam|criam|aprendem|desenvolvem)/i,salary:/salário|rendimento|emprego|desemprego|remuneração|renda (?:média|do trabalho)|mercado de trabalho|carteira assinada|vagas? (?:de |para )?(?:emprego|trabalho)/i};
export const isElectionTable=title=>/resultado.*votaç|votos por local de votação/i.test(title);
export function isPromotional(url){try{return /especial-publicitario|conteudo-patrocinado|conteudo-de-marca|publieditorial|publicidade/i.test(new URL(url).pathname)}catch{return true}}
// Conservative editorial gate: classify the headline, never incidental biography or related links.
export function classifyTopics(article){
 const title=String(article.title??'');
 if(isElectionTable(title)||/morre aos|morreu aos|velório|sepultamento/i.test(title)||article.url&&isPromotional(article.url))return [];
 const incidentalHealth=/(?:a caminho|se deslocava|seguia|ia para|levado|transferido).{0,65}(?:hospital|unidade de saúde)/i.test(title)&&!/falta de atendimento|fila de|acesso ao|tratamento|cirurgia|leitos/i.test(title);
 return Object.entries(TOPICS).filter(([topic,pattern])=>!(topic==='health'&&incidentalHealth)&&pattern.test(title)&&!(topic==='education'&&/votação|zona eleitoral|seção eleitoral|local de votação/i.test(title))).map(([topic])=>topic);
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

export function feedExcerpt(value){let html=String(value??'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&amp;/g,'&');html=html.replace(/^\s*<p>\s*(?=<p)/i,'').replace(/^\s*<p[^>]*>\s*<a[^>]*>[\s\S]*?<\/a>\s*<\/p>/i,'');const opening=html.search(/<p\b/i);if(opening>=0&&!html.slice(0,opening).replace(/<[^>]*>/g,'').trim())html=html.slice(opening).replace(/^<p[^>]*>/i,'');return html.split(/<\/p>|Notícias relacionadas|\n\n/i)[0].replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,1600)}
