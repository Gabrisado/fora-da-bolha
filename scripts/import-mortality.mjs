import {readFile,writeFile} from 'node:fs/promises';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true}});
try{
 const {mortalityRate}=await server.ssrLoadModule('/src/mortality.ts');
 const raw=new URL('../data/raw/',import.meta.url),out=new URL('../public/data/',import.meta.url);
 const mortality=JSON.parse(await readFile(new URL('mortality-2024-aggregated.json',raw),'utf8'));
 const populationData=JSON.parse(await readFile(new URL('population-2024.json',raw),'utf8'));
 const states=JSON.parse(await readFile(new URL('states.json',out),'utf8'));
 if(populationData[0].id!=='9324'||mortality.year!=='2024')throw Error('Séries incompatíveis');
 const rows=states.map(s=>{const series=populationData[0].resultados[0].series.find(r=>r.localidade.id===s.id);const population=Number(series?.serie['2024']),deaths=mortality.deaths[s.uf];return{uf:s.uf,value:Number(mortalityRate(deaths,population).toFixed(2)),deaths,population}});
 if(rows.length!==27||rows.reduce((n,r)=>n+r.deaths,0)!==mortality.totalResidentDeaths)throw Error('Totais não reconciliados');
 const sourceUrl=mortality.sourceUrl,populationSourceUrl='https://sidra.ibge.gov.br/tabela/6579';
 const indicator={id:'health',title:'Mortalidade geral · taxa bruta',unit:'óbitos por 100 mil habitantes',direction:'lower',period:'2024',source:'Ministério da Saúde · SIM / IBGE',sourceUrl,populationSourceUrl,collectedAt:new Date().toISOString(),status:'verified',note:'Óbitos não fetais de residentes (SIM, CODMUNRES, ano do óbito 2024) ÷ população residente estimada pelo IBGE em 2024 × 100.000. Taxa bruta, sem ajuste por idade: envelhecimento e estrutura etária influenciam a comparação. Menor taxa não prova melhor assistência ou qualidade de vida. Snapshot DO24OPEN do portal oficial; sua equivalência à extração final do Tabnet não foi confirmada. Não mistura 2025 preliminar ou prévias de 2026.',rows};
 const data=JSON.parse(await readFile(new URL('indicators.json',out),'utf8'));data.indicators=data.indicators.map(i=>i.id==='health'?indicator:i);data.updatedAt=new Date().toISOString();await writeFile(new URL('indicators.json',out),JSON.stringify(data));
 await writeFile(new URL('mortality-2024-audit.json',out),JSON.stringify({...mortality,populationSourceUrl,populationTotal:rows.reduce((n,r)=>n+r.population,0),collectedAt:indicator.collectedAt},null,2));
 const csv=['UF;Estado;Ano;Obitos_residentes_nao_fetais;Populacao_estimada;Taxa_por_100_mil;Fonte_obitos;Fonte_populacao',...rows.map(r=>[r.uf,states.find(s=>s.uf===r.uf).name,'2024',r.deaths,r.population,String(r.value).replace('.',','),sourceUrl,populationSourceUrl].join(';'))].join('\n');await writeFile(new URL('mortality-2024.csv',out),'\ufeff'+csv);
 console.log('Mortalidade geral:',rows.length,'UFs;',mortality.totalResidentDeaths,'óbitos residentes; população',rows.reduce((n,r)=>n+r.population,0));
}finally{await server.close()}
