import {test,expect} from '@playwright/test';
import {OrthographicCamera,Vector3} from 'three';
import {centerOf} from '../src/geography';
import {visualValues} from '../src/domain';
for(const size of [{width:320,height:568},{width:360,height:640},{width:390,height:844},{width:412,height:915},{width:844,height:390},{width:768,height:1024}]){
 test(`mobile 3D funcional em ${size.width}×${size.height}`,async({browser})=>{
  const context=await browser.newContext({viewport:size,isMobile:true,hasTouch:true,deviceScaleFactor:1});const page=await context.newPage();
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4182/');await expect(page.getByRole('heading',{name:'Fora da bolha',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Salário',exact:true}).tap();await expect(page.locator('canvas')).toBeVisible();await page.waitForLoadState('networkidle');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight)).toBe(true);
  const canvas=await page.locator('canvas').boundingBox();expect(canvas!.width).toBeGreaterThan(250);expect(canvas!.height).toBeGreaterThan(140);
  expect(await page.locator('canvas').evaluate(c=>!!(c as HTMLCanvasElement).getContext('webgl2')&&!((c as HTMLCanvasElement).getContext('webgl2')!.isContextLost()))).toBe(true);
  await expect(page.getByRole('button',{name:'3D',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.getByLabel('Selecionar unidade federativa').selectOption('SC');await expect(page.getByTestId('indicator-value')).not.toHaveText('—');
  const panel=await page.locator('.state-panel').boundingBox();expect(panel!.x).toBeGreaterThanOrEqual(0);expect(panel!.x+panel!.width).toBeLessThanOrEqual(size.width+1);expect(panel!.y+panel!.height).toBeLessThanOrEqual(size.height);
  await expect.poll(()=>page.locator('canvas').evaluate(c=>Math.abs(c.getBoundingClientRect().height-c.closest('.scene')!.getBoundingClientRect().height))).toBeLessThan(1);
  const mapAfter=await page.locator('canvas').boundingBox();expect(mapAfter!.width).toBeGreaterThan(250);expect(mapAfter!.height).toBeGreaterThan(120);
  await expect.poll(async()=>Number(await page.locator('canvas').getAttribute('data-camera-zoom'))).toBeCloseTo(Math.min(mapAfter!.width/15.5,mapAfter!.height/13),1);
  await page.getByRole('button',{name:'Recolher detalhes do estado'}).tap();await expect(page.getByRole('button',{name:'Expandir detalhes do estado'})).toBeVisible();
  await page.getByRole('button',{name:'Expandir detalhes do estado'}).tap();await page.locator('.news').scrollIntoViewIfNeeded();await expect(page.locator('.news h3')).toBeVisible();
  await page.getByRole('button',{name:'Fechar painel do estado'}).tap();
  await page.getByRole('button',{name:'Configurar áudio'}).tap();await expect(page.getByRole('button',{name:'Disparos e moto'})).toBeVisible();
  await page.getByRole('button',{name:'Sino escolar',exact:true}).tap();await expect.poll(()=>page.locator('audio[data-channel="effect"]').evaluate((a:HTMLAudioElement)=>!a.paused&&a.currentTime>0)).toBe(true);
  const menu=await page.locator('.audio-menu').boundingBox();expect(menu!.x).toBeGreaterThanOrEqual(0);expect(menu!.x+menu!.width).toBeLessThanOrEqual(size.width+1);await page.getByRole('button',{name:'Configurar áudio'}).tap();
  await page.getByRole('button',{name:'Dados e fontes'}).tap();await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'Fechar metodologia'}).tap();
  for(const topic of ['Saúde','Segurança','Educação']){await page.getByRole('button',{name:topic,exact:true}).tap();await page.getByLabel('Selecionar unidade federativa').selectOption('SC');await expect(page.getByTestId('indicator-value')).not.toHaveText('—');await page.getByRole('button',{name:'Fechar painel do estado'}).tap()}
  await page.getByRole('button',{name:'Migração',exact:true}).tap();await expect(page.locator('canvas')).toBeVisible();await expect(page.getByRole('button',{name:'3D',exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(page.getByRole('button',{name:'Resumo',exact:true})).toBeVisible();await expect(page.locator('.context-card')).not.toBeVisible();
  await page.getByRole('button',{name:'Resumo',exact:true}).tap();await expect(page.locator('.context-card')).toBeVisible();await page.getByRole('button',{name:'Resumo',exact:true}).tap();
  await page.screenshot({path:`design/visual-first/mobile/executado-${size.width}x${size.height}.png`});expect(errors).toEqual([]);await context.close();
 });
}
test('gestos reais de toque giram e aproximam o 3D; toque no mapa seleciona a UF',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();
 await page.goto('http://127.0.0.1:4182/');await page.getByRole('button',{name:'Salário',exact:true}).tap();await page.waitForLoadState('networkidle');
 const canvas=page.locator('canvas');await expect(canvas).toHaveAttribute('data-camera-zoom',/.+/);const box=(await canvas.boundingBox())!;
 const cdp=await context.newCDPSession(page),cx=box.x+box.width/2,cy=box.y+box.height/2;
 const azimuth=()=>canvas.getAttribute('data-camera-azimuth').then(Number),zoom=()=>canvas.getAttribute('data-camera-zoom').then(Number);
 const startAngle=await azimuth(),startZoom=await zoom();
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx,y:cy,id:1}]});
 for(let i=1;i<=6;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx+i*10,y:cy+i,id:1}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await expect.poll(async()=>Math.abs((await azimuth())-startAngle)).toBeGreaterThan(.05);await expect(page.locator('.state-panel')).toHaveCount(0);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx-25,y:cy,id:1},{x:cx+25,y:cy,id:2}]});
 for(const distance of [35,45,55,65])await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx-distance,y:cy,id:1},{x:cx+distance,y:cy,id:2}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect.poll(zoom).toBeGreaterThan(startZoom*1.2);
 await page.getByRole('button',{name:'Restaurar câmera'}).tap();await expect.poll(zoom).toBeCloseTo(startZoom,1);
 const geo=await(await page.request.get('http://127.0.0.1:4182/data/brazil.json')).json(),indicators=await(await page.request.get('http://127.0.0.1:4182/data/indicators.json')).json();
 const f=geo.features.find((f:any)=>f.properties.codarea==='15'),[x,z]=centerOf(f),salary=indicators.indicators.find((i:any)=>i.id==='salary');const height=visualValues(salary.rows,'higher','best').PA.height;
 const camera=new OrthographicCamera(-box.width/2,box.width/2,box.height/2,-box.height/2,.1,100);camera.position.set(0,15,11);camera.zoom=startZoom;camera.lookAt(0,0,0);camera.updateProjectionMatrix();camera.updateMatrixWorld();
 const p=new Vector3(x,height,z).project(camera);await page.touchscreen.tap(box.x+(p.x+1)*box.width/2,box.y+(1-p.y)*box.height/2);
 await expect(page.getByRole('heading',{name:'Pará',exact:true})).toBeVisible();await expect(canvas).toBeVisible();
 await expect.poll(()=>canvas.evaluate(c=>Math.abs(c.getBoundingClientRect().height-c.closest('.scene')!.getBoundingClientRect().height))).toBeLessThan(1);
 const selectedBox=(await canvas.boundingBox())!;await expect.poll(zoom).toBeCloseTo(Math.min(selectedBox.width/15.5,selectedBox.height/13),1);
 await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
 await page.screenshot({path:'design/visual-first/mobile/3d-toque-estado.png'});
 const panel=(await page.locator('.state-panel').boundingBox())!;const sx=panel.x+panel.width/2,sy=panel.y+panel.height-25,ey=panel.y+90;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:sx,y:sy,id:1}]});for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:sx,y:sy+(ey-sy)*i/8,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await expect.poll(()=>page.locator('.state-panel').evaluate(p=>p.scrollTop)).toBeGreaterThan(0);expect(await page.evaluate(()=>scrollY)).toBe(0);
 await page.setViewportSize({width:844,height:390});await expect(canvas).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Fechar painel do estado'}).tap();await expect(canvas).toBeVisible();
 await context.close();
});
test('mobile preserva navegação quando WebGL não está disponível',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();
 await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(kind:string,...args:any[]){if(/webgl/.test(kind))return null;return original.apply(this,[kind,...args] as any)} as typeof original});
 await page.goto('http://127.0.0.1:4182/');await expect(page.getByRole('status')).toContainText('Mapa 2D ativado');
 await page.getByRole('button',{name:'Saúde',exact:true}).tap();await page.getByLabel('Selecionar unidade federativa').selectOption('PA');await expect(page.getByTestId('indicator-value')).not.toHaveText('—');
 await expect(page.locator('path[data-uf]')).toHaveCount(27);await context.close();
});
test('mobile com movimento reduzido mantém rotas sem animação contínua em 2D',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});const page=await context.newPage();
 await page.goto('http://127.0.0.1:4182/');await page.getByRole('button',{name:'Migração',exact:true}).tap();await page.getByRole('button',{name:'2D',exact:true}).tap();
 await expect.poll(()=>page.locator('[data-migration-plane]').count()).toBeGreaterThan(10);await expect(page.locator('animateMotion')).toHaveCount(0);await context.close();
});
