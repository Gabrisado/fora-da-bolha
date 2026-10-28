import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const base=process.argv[2]??'https://gabrisado.github.io/fora-da-bolha/';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{for(const mobile of [false,true]){
 const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'?motion='+Date.now(),{waitUntil:'networkidle'});
 const data=await(await page.request.get(base+'data/indicators.json?'+Date.now())).json();
 assert.equal(data.indicators.find(i=>i.id==='health').metric,'life-expectancy');
 assert.equal(data.indicators.find(i=>i.id==='sanitation').rows.length,27);
 await page.getByRole('button',{name:'Saneamento básico',exact:true}).click();await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.cameraZoom);
 assert(await page.locator('canvas').evaluate(c=>!!c.getContext('webgl2')&&!c.getContext('webgl2').isContextLost()));
 const before=await page.locator('.scene').boundingBox();await page.getByLabel('Selecionar unidade federativa').selectOption('AP');
 assert((await page.getByTestId('indicator-value').innerText()).includes('10,95'));
 if(mobile)assert.deepEqual(await page.locator('.scene').boundingBox(),before);
 await page.getByRole('button',{name:'Recolher detalhes do estado'}).click();await page.getByRole('button',{name:'Expandir detalhes do estado'}).click();
 if(mobile)await page.getByRole('button',{name:'Voltar ao mapa',exact:true}).click({position:{x:20,y:20}});else await page.getByRole('button',{name:'Fechar painel do estado'}).click();
 await page.waitForFunction(()=>!document.querySelector('.state-panel'));
 await page.getByRole('button',{name:'Pior',exact:true}).click();assert.equal(await page.locator('.rank-control').getAttribute('data-active-index'),'1');
 await page.waitForTimeout(800);await page.screenshot({path:`design/review-2026-10-27/public-motion-${mobile?'mobile':'desktop'}.png`});
 await page.getByRole('button',{name:'2D',exact:true}).click();assert.equal(await page.locator('[data-theme-marker]').count(),6);
 await page.getByRole('button',{name:'Saúde',exact:true}).click();await page.getByLabel('Selecionar unidade federativa').selectOption('DF');assert((await page.getByTestId('indicator-value').innerText()).includes('79,75'));
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
 console.log(`Public motion ${mobile?'390×844':'1440×900'}: OK; WebGL, saúde, saneamento, switches, painel e6símbolos2D`);await context.close();
}}finally{await browser.close()}
