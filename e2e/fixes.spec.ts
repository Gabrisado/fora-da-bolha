import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {OrthographicCamera,Vector3} from 'three';
import {centerOf} from '../src/geography';
test('sem música e migração funciona em 2D',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Configurar áudio'}).click();
 await expect(page.getByRole('button',{name:'Ativar música',exact:true})).toHaveCount(0);
 await expect(page.locator('audio[data-channel="music"]')).toHaveCount(0);
 await page.getByRole('button',{name:'Migração',exact:true}).click();
 await page.getByLabel('Selecionar unidade federativa').selectOption('PA');
 await page.getByRole('button',{name:'2D',exact:true}).click();
 await expect.poll(()=>page.locator('[data-migration-route]').count()).toBeGreaterThan(10);
 await expect(page.getByTestId('migration-totals')).toBeVisible();
 await expect(page.getByRole('button',{name:'Saídas',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Segurança',exact:true}).click();
 await expect(page.getByTestId('indicator-value')).toHaveText('27,28');
 await page.getByRole('button',{name:'Educação',exact:true}).click();
 await expect(page.getByTestId('indicator-value')).not.toHaveText('—');
 await page.getByRole('button',{name:'Saúde',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Mortalidade geral · taxa bruta',exact:true})).toBeVisible();
 await expect(page.getByTestId('indicator-value')).not.toHaveText('—');
 await expect(page.getByRole('link',{name:'Baixar tabela das 27 UFs'})).toBeVisible();
 await page.screenshot({path:'design/visual-first/desktop/mortalidade-geral.png'});
});
test('todos os arquivos sonoros decodificam e os efeitos não se sobrepõem',async({page})=>{
 await page.goto('/');
 const readings=await page.evaluate(async()=>{
  const ctx=new AudioContext();const out=[];
  for(const id of ['health','security','education','salary']){
   const r=await fetch(`./audio/${id}-scene.wav`);const b=await ctx.decodeAudioData(await r.arrayBuffer());const channel=b.getChannelData(0);let power=0;for(let i=0;i<Math.min(channel.length,b.sampleRate*6);i++)power+=channel[i]*channel[i];
   out.push({id,duration:b.duration,rms:Math.sqrt(power/Math.min(channel.length,b.sampleRate*6))});
  }await ctx.close();return out;
 });
 console.log('Arquivos decodificados e amplitude:',readings);
 for(const r of readings){expect(r.duration).toBeGreaterThan(1);expect(r.rms).toBeGreaterThan(.001)}
 expect(readings.find(r=>r.id==='security')?.duration).toBe(8);
 await page.getByRole('button',{name:'Configurar áudio'}).click();
 for(const name of ['Hospital','Disparos e moto','Sino escolar','Caixa registradora']){
  await page.getByRole('button',{name,exact:true}).click();
  await expect(page.locator('audio[data-channel="effect"]')).toHaveCount(1);
  await expect.poll(()=>page.locator('audio[data-channel="effect"]').evaluate((a:HTMLAudioElement)=>!a.paused&&a.currentTime>0)).toBe(true);
 }
 await page.getByRole('button',{name:'Parar efeito'}).click();await expect(page.locator('audio[data-channel="effect"]')).toHaveCount(0);
 await page.screenshot({path:'design/visual-first/desktop/efeitos-sem-musica.png'});
});
test('Pará exibe bandeira no mapa 3D ao passar o mouse',async({page})=>{
 await page.goto('/');await expect(page.locator('canvas')).toBeVisible();await page.waitForLoadState('networkidle');
 const rect=await page.locator('canvas').boundingBox();expect(rect).not.toBeNull();
 const f=JSON.parse(readFileSync('public/data/brazil.json','utf8')).features.find((f:any)=>f.properties.codarea==='15');
 const [x,z]=centerOf(f),w=rect!.width,h=rect!.height;
 const camera=new OrthographicCamera(-w/2,w/2,h/2,-h/2,.1,100);camera.position.set(0,15,11);camera.zoom=Math.min(w/15.5,h/13);camera.lookAt(0,0,0);camera.updateProjectionMatrix();camera.updateMatrixWorld();
 const point=new Vector3(x,.15,z).project(camera);
 await page.mouse.move(rect!.x+(point.x+1)*w/2,rect!.y+(1-point.y)*h/2);
 await expect(page.locator('.map-tooltip')).toContainText('Pará');
 await page.screenshot({path:'design/visual-first/desktop/para-bandeira-corrigida.png'});
 await page.getByRole('button',{name:'Migração',exact:true}).click();await page.getByLabel('Selecionar unidade federativa').selectOption('PA');
 await expect(page.getByTestId('migration-totals')).toBeVisible();await page.screenshot({path:'design/visual-first/desktop/migracao-corrigida.png'});
 await page.getByRole('button',{name:'2D',exact:true}).click();await page.locator('path[data-uf="PA"]').hover();
 await expect(page.locator('path[data-uf="PA"]')).toHaveAttribute('fill','url(#flag-PA)');await page.screenshot({path:'design/visual-first/desktop/para-2d-corrigido.png'});
});
