import {writeFile,readFile} from 'node:fs/promises';
const root=new URL('../data/raw/',import.meta.url);
const form=await readFile(new URL('tabnet-mortality-form.html',root),'latin1');
const fields={};
for(const m of form.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/gi)){
 const name=m[1].match(/name\s*=\s*["']?([^\s"'>]+)/i)?.[1];
 const value=[...m[2].matchAll(/<option\b([^>]*)>/gi)].find(o=>/\bselected\b/i.test(o[1]))?.[1].match(/value\s*=\s*"([^"]*)"/i)?.[1];
 if(name&&value)fields[name]=value;
}
Object.assign(fields,{Linha:'Unidade_da_Federação',Coluna:'Ano_do_Óbito',Incremento:'Óbitos_p/Residênc',Arquivos:'obtuf24.dbf',formato:'prn',mostre:'Mostra'});
const encode=s=>[...Buffer.from(s,'latin1')].map(b=>/[A-Za-z0-9_.~-]/.test(String.fromCharCode(b))?String.fromCharCode(b):'%'+b.toString(16).padStart(2,'0')).join('');
const body=Object.entries(fields).map(([k,v])=>encode(k)+'='+encode(v)).join('&');
await writeFile(new URL('mortality-query.txt',root),body);
const r=await fetch('https://tabnet.datasus.gov.br/cgi/tabcgi.exe?sim/cnv/obt10uf.def',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body,signal:AbortSignal.timeout(55000)});
if(!r.ok)throw Error('Tabnet HTTP '+r.status);const bytes=Buffer.from(await r.arrayBuffer());await writeFile(new URL('mortality-2024-result.html',root),bytes);console.log(bytes.toString('latin1').slice(-15000));
