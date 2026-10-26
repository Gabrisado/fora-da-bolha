import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const url=process.argv[2]??'https://gabrisado.github.io/fora-da-bolha/';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 for(const mobile of [false,true]){
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile});
  const page=await context.newPage(),failures=[],errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(url)&&r.status()>=400)failures.push(r.status()+' '+r.url())});
  const response=await page.goto(url,{waitUntil:'networkidle',timeout:60000});assert.equal(response.status(),200);
  await page.getByRole('heading',{name:'Fora da bolha',exact:true}).waitFor();await page.getByRole('button',{name:'Salário',exact:true}).click();await page.locator('canvas').waitFor();
  assert(await page.locator('canvas').evaluate(c=>!!c.getContext('webgl2')&&!c.getContext('webgl2').isContextLost()),'WebGL 3D deve estar ativo');
  await page.getByLabel('Selecionar unidade federativa').selectOption('SC');assert(!(await page.getByTestId('indicator-value').innerText()).includes('—'));
  if(mobile){await page.getByRole('button',{name:'Recolher detalhes do estado'}).click();assert(await page.getByRole('button',{name:'Expandir detalhes do estado'}).isVisible());await page.getByRole('button',{name:'Fechar painel do estado'}).click()}
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Sem overflow horizontal');
  await page.screenshot({path:mobile?'design/visual-first/mobile/publicado-390x844.png':'design/visual-first/desktop/publicado.png'});
  await page.getByRole('button',{name:'Migração',exact:true}).click();await page.getByRole('button',{name:'2D',exact:true}).click();assert(await page.locator('[data-migration-route]').count()>10);
  await page.getByLabel('Selecionar unidade federativa').selectOption('PA');await page.getByTestId('migration-totals').waitFor();
  const migration=await(await page.request.get(url+'data/migration.json')).json();assert.equal(migration.flows.length,702);
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
  console.log(mobile?'Publicação mobile: OK (390×844, toque emulado, WebGL ativo)':'Publicação desktop: OK (1440×900, WebGL ativo)');await context.close();
 }
}finally{await browser.close()}
