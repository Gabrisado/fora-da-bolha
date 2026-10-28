import {mkdir,readFile,writeFile,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../public/data/',import.meta.url),raw=new URL('../data/raw/',import.meta.url);
await mkdir(root,{recursive:true});await mkdir(raw,{recursive:true});
const now=new Date().toISOString();
async function get(url){const r=await fetch(url,{signal:AbortSignal.timeout(45000)});if(!r.ok)throw Error(`HTTP ${r.status}: ${url}`);return r;}
async function save(name,value){const data=JSON.stringify(value);await writeFile(new URL(name+'.tmp',root),data);await rename(new URL(name+'.tmp',root),new URL(name,root));}
async function json(url,name){const text=await(await get(url)).text();const data=JSON.parse(text);await writeFile(new URL(name,raw),text);return data;}
const errors=[];
const attempts=await Promise.allSettled([
 (async()=>{const url='https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?intrarregiao=UF&formato=application/vnd.geo%2Bjson&qualidade=minima';const d=await json(url,'ufs.json');if(d.features?.length!==27)throw Error('Malha não contém 27 UFs');await save('brazil.json',d);console.log('Malha: 27 UFs');})(),
 (async()=>{const d=await json('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson','world.json');await save('neighbors.json',{type:'FeatureCollection',features:d.features.filter(f=>f.properties.CONTINENT==='South America'&&f.properties.ADM0_A3!=='BRA')});console.log('Vizinhos: Natural Earth');})(),
 (async()=>{const d=await json('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome','states.json');await save('states.json',d.map(s=>({id:String(s.id),uf:s.sigla,name:s.nome})));})()
]);attempts.forEach(r=>{if(r.status==='rejected')errors.push(String(r.reason))});
let old={indicators:[]};try{old=JSON.parse(await readFile(new URL('indicators.json',root),'utf8'))}catch{}
const states=JSON.parse(await readFile(new URL('states.json',root),'utf8'));const uf=id=>states.find(s=>s.id===String(id))?.uf;
const collected=[];
try{
 const url='https://www.ipea.gov.br/dados-api/series-values/20/3';const d=await json(url,'security.json');
 const years=[...new Set(d.map(r=>r.periodo.slice(0,4)))].sort().reverse();let rows,year;
 for(const y of years){const items=d.filter(r=>r.periodo.startsWith(y)&&uf(r.regiao_id));if(new Set(items.map(r=>r.regiao_id)).size===27){rows=items.map(r=>({uf:uf(r.regiao_id),value:Number(r.valor)}));year=y;break}}
 if(!rows)throw Error('Nenhum ano completo com 27 UFs');
 collected.push({id:'security',title:'Homicídios registrados',unit:'por 100 mil habitantes',direction:'lower',period:year,source:'Ipea · Atlas da Violência / SIM',sourceUrl:'https://www.ipea.gov.br/atlasviolencia/',collectedAt:now,note:'Óbitos por residência. CID-10 X85–Y09 e Y35; inclui intervenções legais. Não equivale a todos os crimes ou à taxa policial de homicídios dolosos.',rows,status:'verified'});
 console.log('Segurança:',year,rows.length);
}catch(e){errors.push('Segurança: '+e.message)}
try{
 const meta=await json('https://servicodados.ibge.gov.br/api/v3/agregados/7444/metadados','salary-meta.json');const year=String(meta.periodicidade.fim);
 const url=`https://servicodados.ibge.gov.br/api/v3/agregados/7444/periodos/${year}/variaveis/10774?localidades=N3[all]&classificacao=2[6794]`;
 const d=await json(url,'salary.json');const rows=d[0].resultados[0].series.map(s=>({uf:uf(s.localidade.id),value:Number(s.serie[year])}));
 if(rows.length!==27||rows.some(r=>!r.uf||!Number.isFinite(r.value)||r.value<=0))throw Error('Série anual incompleta');
 collected.push({id:'salary',title:'Rendimento médio do trabalho',unit:'mensais · média anual real',direction:'higher',period:year,source:'IBGE · PNAD Contínua anual',sourceUrl:'https://sidra.ibge.gov.br/tabela/7444',collectedAt:now,note:`Pessoas de 14 anos ou mais ocupadas com rendimento de trabalho; habitual de todos os trabalhos, sexo total, a preços médios de ${year}. Não é renda domiciliar per capita nem apenas salário de empregados.`,rows,status:'verified'});
 console.log('Salário:',year,rows.length);
}catch(e){errors.push('Salário: '+e.message)}
const pending=[{id:'health',title:'Mortalidade infantil',unit:'óbitos por mil nascidos vivos',direction:'lower',source:'Ministério da Saúde · SIM/SINASC',sourceUrl:'https://www.gov.br/saude/pt-br/acesso-a-informacao/sic/dados-em-transparencia-ativa/svsa/mortalidade'},{id:'education',title:'Ideb · Ensino médio público',unit:'pontos · escala de 0 a 10',direction:'higher',source:'Inep · Ideb',sourceUrl:'https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb/resultados'}];
for(const p of pending)collected.push(old.indicators.find(i=>i.id===p.id&&i.status==='verified')??{...p,period:'Não coletado',collectedAt:null,note:'Fonte em validação. Nenhum valor foi estimado para preencher a ausência.',rows:states.map(s=>({uf:s.uf,value:null})),status:'pending'});
for(const id of ['security','salary','sanitation'])if(!collected.some(i=>i.id===id)&&old.indicators.some(i=>i.id===id))collected.push(old.indicators.find(i=>i.id===id));
await save('indicators.json',{updatedAt:now,indicators:collected,errors});
try{await readFile(new URL('migration.json',root))}catch{await save('migration.json',{status:'pending',period:'2017–2022',source:'IBGE · Censo 2022',sourceUrl:'https://biblioteca.ibge.gov.br/visualizacao/livros/liv102187.pdf',note:'Matriz oficial origem–destino ainda não coletada. Totais parciais não são usados para inventar trajetos.',flows:[]})}
await save('collection-log.json',{attemptedAt:now,errors});console.log('Coleta concluída. Problemas:',errors.length);

try{await import('./import-health-sanitation.mjs')}catch(error){console.error('Vida/saneamento: preservado snapshot anterior:',error.message)}
