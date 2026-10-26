import {readFile,writeFile,rename} from 'node:fs/promises';
const root=new URL('../public/data/',import.meta.url),states=JSON.parse(await readFile(new URL('states.json',root),'utf8'));
const url='https://servicodados.ibge.gov.br/api/v3/agregados/10159/periodos/2022/variaveis/13339?localidades=N3[all]&classificacao=2083[all]';
const response=await fetch(url,{signal:AbortSignal.timeout(45000)});if(!response.ok)throw Error('HTTP '+response.status);const data=await response.json();
const flows=[];let knownTotal=0;
for(const result of data[0].resultados){const name=Object.values(result.classificacoes[0].categoria)[0],from=states.find(s=>s.name===name)?.uf;if(!from)continue;
for(const item of result.series){const to=states.find(s=>s.id===item.localidade.id)?.uf;if(!to||to===from)continue;const text=item.serie['2022'];if(text==='...'||text==='..'||text==='X')throw Error('Célula ausente ou suprimida não pode virar zero');const value=text==='-'?0:Number(text);if(!Number.isFinite(value)||value<0)throw Error('Fluxo inválido');flows.push({from,to,value});knownTotal+=value}}
if(new Set(flows.map(f=>f.from)).size!==27||new Set(flows.map(f=>f.to)).size!==27||flows.length!==702)throw Error(`Matriz incompleta: ${flows.length} pares`);
const totals=states.map(s=>{const incoming=flows.filter(f=>f.to===s.uf).reduce((n,f)=>n+f.value,0),outgoing=flows.filter(f=>f.from===s.uf).reduce((n,f)=>n+f.value,0);return{uf:s.uf,incoming,outgoing,balance:incoming-outgoing}});
if(totals.reduce((n,t)=>n+t.incoming,0)!==totals.reduce((n,t)=>n+t.outgoing,0))throw Error('Totais não reconciliados');
const snapshot={status:'verified',period:'2017–2022',source:'IBGE · Censo 2022 · SIDRA 10159',sourceUrl:'https://sidra.ibge.gov.br/tabela/10159',collectedAt:new Date().toISOString(),note:'Pessoas de 5 anos ou mais com residência em outra UF cinco anos antes de 2022. Resultados da amostra; excluídos exterior, Brasil sem especificação e sem declaração. Totais abaixo são somas das origens conhecidas; não incluem crianças menores de 5 anos nem mudanças intermediárias.',flows,totals,knownTotal};
await writeFile(new URL('migration.json.tmp',root),JSON.stringify(snapshot));await rename(new URL('migration.json.tmp',root),new URL('migration.json',root));console.log('Migração:',flows.length,'pares;',knownTotal,'pessoas; totais reconciliados.');
