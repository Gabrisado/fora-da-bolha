import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const assets=[
 ['health','https://cdn.freesound.org/previews/240/240676_3763935-hq.mp3','enviroment hospital.wav','mariiao2','CC0','https://freesound.org/people/mariiao2/sounds/240676/'],
 ['education','https://cdn.freesound.org/previews/620/620392_13730662-hq.mp3','School Bell','civvy','CC0','https://freesound.org/people/civvy/sounds/620392/'],
 ['salary','https://cdn.freesound.org/previews/542/542568_10247258-hq.mp3','cash register.wav','sidequesting','CC0','https://freesound.org/people/sidequesting/sounds/542568/'],
 ['hospital-cart','https://cdn.freesound.org/previews/67/67286_954635-hq.mp3','HOSPITAL FOOD CART WHEELED.wav','hja','CC0','https://freesound.org/people/hja/sounds/67286/'],
 ['heart-monitor','https://cdn.freesound.org/previews/148/148897_2464203-hq.mp3','Heart Monitor Beep','samfk360','CC0','https://freesound.org/people/samfk360/sounds/148897/'],
 ['security-burst','https://cdn.freesound.org/previews/424/424630_7542558-hq.mp3','BurstFire.wav','SuperPhat','CC0','https://freesound.org/people/SuperPhat/sounds/424630/'],
 ['motorcycle-limiter','https://cdn.freesound.org/previews/361/361403_1481531-hq.mp3','Sportsbike Flyby (limiter)','richwise','CC0','https://freesound.org/people/richwise/sounds/361403/']
];
const root=new URL('../public/audio/',import.meta.url);await mkdir(root,{recursive:true});
const manifest=[];
for(const [id,url,title,author,license,source] of assets){let bytes;try{bytes=await readFile(new URL(id+'.mp3',root))}catch{const r=await fetch(url);if(!r.ok)throw Error(`${id}: ${r.status}`);bytes=Buffer.from(await r.arrayBuffer());if(bytes.length<1000)throw Error('Arquivo inválido');await writeFile(new URL(id+'.mp3',root),bytes)}manifest.push({id,file:id+'.mp3',title,author,license,source,download:url,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});console.log(id,bytes.length)}
await writeFile(new URL('credits.json',root),JSON.stringify(manifest,null,2));
