import {readFile,writeFile,mkdir} from 'node:fs/promises';
const dir=new URL('../public/flags/',import.meta.url);await mkdir(dir,{recursive:true});
const base='https://raw.githubusercontent.com/akagabi/bandeira-dos-estados-do-brasil/93624a385c870dc11a2ca686a89d3ab73b43538e/';
const license=await(await fetch(base+'LICENSE')).text();if(!license.includes('MIT License'))throw Error('Licença não confirmada');await writeFile(new URL('LICENSE.txt',dir),license);
const states=JSON.parse(await readFile(new URL('../public/data/states.json',import.meta.url),'utf8'));
for(const s of states){const r=await fetch(base+s.uf.toLowerCase()+'.svg');if(!r.ok)throw Error(s.uf);const text=await r.text();if(/<script|onload=|javascript:|href=["']https?:/i.test(text))throw Error('SVG com conteúdo externo: '+s.uf);await writeFile(new URL(s.uf+'.svg',dir),text)}
console.log('27 bandeiras SVG verificadas e licença preservada.');
