import {readFile,writeFile,mkdir,access,readdir,unlink} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';import sharp from 'sharp';import {senatePhoto,ebcPhoto,validateNews} from './news-media.mjs';
const file=new URL('../public/data/news.json',import.meta.url),directory=new URL('../public/news-media/',import.meta.url);await mkdir(directory,{recursive:true});const cache=JSON.parse(await readFile(file,'utf8'));validateNews(cache);
const byUrl=new Map();for(const n of cache.items){n.publisher={name:n.source,initials:n.source.startsWith('g1')?'g1':n.source==='Agência Senado'?'AS':n.source==='Agência Brasil'?'AB':'IB'};if(!byUrl.has(n.url))byUrl.set(n.url,[]);byUrl.get(n.url).push(n);}
let prepared=0;
for(const [url,items] of byUrl){try{
 const host=new URL(url);if(!((host.hostname==='www12.senado.leg.br'&&host.pathname.startsWith('/noticias/materias/'))||host.hostname==='agenciabrasil.ebc.com.br')){for(const n of items)delete n.image;continue}
 let photo=items[0].image;const key=createHash('sha256').update(url).digest('hex').slice(0,24)+'.webp',target=new URL(key,directory);
 if(photo){try{await access(target);prepared++;continue}catch{}}
 const page=await fetch(url,{signal:AbortSignal.timeout(15000),redirect:'error'});if(!page.ok)throw Error('Artigo indisponível');photo=(host.hostname==='agenciabrasil.ebc.com.br'?ebcPhoto:senatePhoto)(await page.text(),url);if(!photo){for(const n of items)delete n.image;continue}
 const response=await fetch(photo.originalUrl,{signal:AbortSignal.timeout(15000),redirect:'error'});if(!response.ok||!response.headers.get('content-type')?.startsWith('image/'))throw Error('Imagem inválida');const bytes=Buffer.from(await response.arrayBuffer());if(bytes.length>12e6)throw Error('Imagem grande demais');await sharp(bytes,{limitInputPixels:40e6}).rotate().resize({width:720,withoutEnlargement:true}).webp({quality:78}).toFile(fileURLToPath(target));for(const n of items)n.image={...photo,src:'./news-media/'+key};prepared++;
 }catch(error){for(const n of items)delete n.image;console.warn('Sem foto:',url,error.message)}}
const active=new Set(cache.items.flatMap(n=>n.image?[n.image.src.split('/').at(-1)]:[]));for(const name of await readdir(directory)){if(/^[a-f0-9]{24}\.webp$/.test(name)&&!active.has(name))await unlink(new URL(name,directory));}
cache.media={prepared,updatedAt:new Date().toISOString(),policy:'Somente fotos próprias com crédito da Agência Senado ou Agência Brasil; demais notícias textuais.'};await writeFile(file,JSON.stringify(cache));console.log('Miniaturas autorizadas:',prepared);
