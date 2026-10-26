import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
async function run(script){await new Promise(resolve=>{const child=spawn(process.execPath,[fileURLToPath(new URL(script,import.meta.url))],{stdio:'inherit'});child.once('exit',resolve);child.once('error',resolve)})}
async function data(){await run('./update-data.mjs');await run('./update-migration.mjs')}
await data();await run('./update-news.mjs');
setInterval(data,7*86400000);
setInterval(()=>run('./update-news.mjs'),6*3600000);
console.log('Rotina ativa enquanto este processo permanecer em execução.');
