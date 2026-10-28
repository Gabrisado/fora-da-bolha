import {chromium} from '@playwright/test';import assert from 'node:assert/strict';
const base=process.argv[2]??'https://gabrisado.github.io/fora-da-bolha/';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{for(const mobile of [false,true]){
 const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile});const page=await context.newPage(),errors=[],models=new Set(),external=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(new URL(r.url()).origin!==new URL(base).origin&&!r.url().startsWith('data:'))external.push(r.url())});page.on('response',r=>{if(r.url().includes('/models/')&&r.url().endsWith('.glb')){assert.equal(r.status(),200);models.add(r.url().split('/').at(-1))}});
 await page.goto(base+'?polish='+Date.now(),{waitUntil:'networkidle'});await page.getByRole('button',{name:'Saneamento básico',exact:true}).click();await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.cameraZoom);await page.waitForTimeout(900);
 assert(await page.locator('canvas').evaluate(c=>!!c.getContext('webgl2')&&!c.getContext('webgl2').isContextLost()));const scene=await page.locator('.scene').boundingBox(),picker=await page.locator('.state-picker').boundingBox(),view=await page.locator('.view-control').boundingBox(),reset=await page.getByRole('button',{name:'Restaurar câmera'}).boundingBox();
 assert(Math.abs(picker.y-view.y)<4);assert(reset.y>scene.y&&reset.y+reset.height<scene.y+scene.height);
 if(mobile){assert(scene.height>540);const nav=await page.locator('.rail').boundingBox();assert(Math.abs(scene.y+scene.height-nav.y)<2)}
 await page.getByLabel('Selecionar unidade federativa').selectOption('AP');await page.waitForTimeout(300);if(mobile)assert.deepEqual(await page.locator('.scene').boundingBox(),scene);
 await page.getByRole('button',{name:'Recolher detalhes do estado'}).click();await page.getByRole('button',{name:'Expandir detalhes do estado'}).click();await page.getByRole('button',{name:'Fechar painel do estado'}).click();await page.waitForFunction(()=>!document.querySelector('.state-panel'));
 for(const name of ['Saúde','Segurança','Educação','Salário']){await page.getByRole('button',{name,exact:true}).click();await page.waitForTimeout(700)}
 assert.equal(models.size,7);await page.getByRole('button',{name:'Saneamento básico',exact:true}).click();await page.waitForTimeout(800);await page.screenshot({path:`design/visual-first/polish-v2/public-${mobile?'mobile':'desktop'}.png`});
 await page.getByRole('button',{name:'2D',exact:true}).click();await page.waitForTimeout(300);assert.equal(await page.locator('[data-theme-marker]').count(),6);await page.getByRole('button',{name:'Explorar',exact:true}).click();await page.waitForTimeout(400);assert.equal(await page.locator('[data-theme-marker]').count(),0);
 const manifest=await(await page.request.get(base+'models/manifest.json')).json();assert.equal(manifest.length,7);assert(manifest.every(m=>m.author&&m.source&&m.license&&m.changes));assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 console.log(`Polish ${mobile?'mobile390×844':'desktop1440×900'}: OK;7GLBs locais, WebGL, cabeçalho, mapa completo, painel e2D. ErrosJS/requisições externas:0.`);await context.close();
}}finally{await browser.close()}
