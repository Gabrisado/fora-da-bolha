import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
// Reproducible local edit of CC0 recordings, using the browser's audio decoder.
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage();await page.goto(process.env.ATLAS_URL??'http://127.0.0.1:4182/');
 const scenes=await page.evaluate(async()=>{
  const result=[];const rate=44100;
  const recipes=[{id:'health',seconds:8,layers:[['health',18,.25],['hospital-cart',3,.5],['heart-monitor',0,.18]]},{id:'security',seconds:8,layers:[['security-burst',0,.6,0],['motorcycle-limiter',6,.65,2.5]]},{id:'education',seconds:6,layers:[['education',0,.65]]},{id:'salary',seconds:6,layers:[['salary',0,1]]}];
  for(const recipe of recipes){
   const ctx=new OfflineAudioContext(1,Math.ceil(rate*recipe.seconds),rate);
   for(const [id,offset,level,start=0] of recipe.layers){const bytes=await(await fetch(`./audio/${id}.mp3`)).arrayBuffer();const buffer=await ctx.decodeAudioData(bytes);const source=ctx.createBufferSource();source.buffer=buffer;source.loop=recipe.id==='health';const gain=ctx.createGain();gain.gain.value=Number(level);source.connect(gain).connect(ctx.destination);source.start(Number(start),Number(offset)%buffer.duration)}
   const buffer=await ctx.startRendering();const samples=buffer.getChannelData(0);let power=0;for(const v of samples)power+=v*v;const scale=Math.min(10,.11/Math.max(Math.sqrt(power/samples.length),.001));
   const bytes=new ArrayBuffer(44+samples.length*2),view=new DataView(bytes);const str=(at,text)=>{for(let i=0;i<text.length;i++)view.setUint8(at+i,text.charCodeAt(i))};str(0,'RIFF');view.setUint32(4,36+samples.length*2,true);str(8,'WAVE');str(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,rate,true);view.setUint32(28,rate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);str(36,'data');view.setUint32(40,samples.length*2,true);
   for(let i=0;i<samples.length;i++){const fade=Math.min(1,i/(rate*.015),(samples.length-i)/(rate*.3));view.setInt16(44+i*2,.85*Math.tanh(samples[i]*scale/.85)*fade*32767,true)}
   let binary='';const data=new Uint8Array(bytes);for(let i=0;i<data.length;i+=8192)binary+=String.fromCharCode(...data.subarray(i,i+8192));result.push({id:recipe.id,base64:btoa(binary),seconds:recipe.seconds,sources:recipe.layers.map(l=>l[0])});
  }return result;
 });
 for(const scene of scenes){await writeFile(new URL(`../public/audio/${scene.id}-scene.wav`,import.meta.url),Buffer.from(scene.base64,'base64'));console.log(scene.id,scene.seconds+'s',scene.sources.join(' + '))}
 await writeFile(new URL('../public/audio/soundscapes.json',import.meta.url),JSON.stringify(scenes.map(({base64,...meta})=>({...meta,license:'CC0',edits:'Recorte, mixagem, normalização com limite de pico e fades; fontes em credits.json.'})),null,2));
}finally{await browser.close()}
