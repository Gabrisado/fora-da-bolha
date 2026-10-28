import {test,expect} from '@playwright/test';

test('novos indicadores, seis destaques e controles deslizantes preservam câmera',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Saúde',exact:true}).click();await page.locator('canvas').waitFor();
 await expect(page.locator('.map-subtitle')).toContainText('Expectativa de vida');
 await expect(page.locator('.marker-key .sr-only')).toContainText('entre os melhores');
 await expect(page.locator('canvas')).toHaveAttribute('data-camera-zoom',/.+/);const camera=await page.locator('canvas').getAttribute('data-camera-zoom');
 const thumb=page.locator('.rank-control .segment-thumb');const before=await thumb.boundingBox();
 await page.getByRole('button',{name:'Pior',exact:true}).click();
 await expect(page.locator('.rank-control')).toHaveAttribute('data-active-index','1');
 await expect.poll(async()=> (await thumb.boundingBox())!.x).toBeGreaterThan(before!.x+20);
 await expect(page.locator('canvas')).toHaveAttribute('data-camera-zoom',camera!);
 await page.getByRole('button',{name:'Saneamento básico',exact:true}).click();
 await expect(page.locator('.map-subtitle')).toContainText('Cobertura de rede de esgoto');
 const text=await page.locator('.marker-key .sr-only').textContent();expect(text!.match(/entre os melhores/g)).toHaveLength(3);expect(text!.match(/entre os piores/g)).toHaveLength(3);
 await page.getByLabel('Selecionar unidade federativa').selectOption('AP');
 await expect(page.locator('.indicator-value')).toContainText('10,95');
 await page.getByRole('button',{name:'2D',exact:true}).click();await expect(page.locator('.atlas-2d')).toBeVisible();
 await page.getByRole('button',{name:'3D',exact:true}).click();await expect(page.locator('canvas')).toBeVisible();
 await expect(page.locator('canvas')).toHaveAttribute('data-camera-zoom',/.+/);await page.waitForTimeout(800);await page.screenshot({path:'design/review-2026-10-27/motion-desktop.png'});
});

test('painel anima, recolhe sem mudar mapa e reabre sem fechamento atrasado',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await page.getByRole('button',{name:'Saneamento básico',exact:true}).click();await page.locator('canvas').waitFor();
 const scene=await page.locator('.scene').boundingBox();await page.getByLabel('Selecionar unidade federativa').selectOption('AP');
 const panel=page.locator('.state-panel');await expect(panel).toBeVisible();const expanded=await panel.boundingBox();
 await page.getByRole('button',{name:'Recolher detalhes do estado'}).click();await expect.poll(async()=> (await panel.boundingBox())!.height).toBeLessThan(expanded!.height-50);
 await page.getByRole('button',{name:'Expandir detalhes do estado'}).click();await expect.poll(async()=> (await panel.boundingBox())!.height).toBeGreaterThan(expanded!.height-5);
 expect(await page.locator('.scene').boundingBox()).toEqual(scene);
 await page.screenshot({path:'design/review-2026-10-27/motion-mobile.png'});
 await page.getByRole('button',{name:'Fechar painel do estado'}).click();await expect(panel).toHaveAttribute('inert','');
 await page.getByLabel('Selecionar unidade federativa').selectOption('DF');await page.waitForTimeout(350);await expect(panel).toHaveAttribute('aria-label','Dados de Distrito Federal');
 await page.getByRole('button',{name:'Voltar ao mapa',exact:true}).click({position:{x:20,y:20}});await expect(panel).toHaveCount(0);await expect(page.getByLabel('Selecionar unidade federativa')).toBeFocused();
});

test('movimento reduzido remove transições do painel e switches',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.getByRole('button',{name:'Saúde',exact:true}).click();await page.getByLabel('Selecionar unidade federativa').selectOption('DF');
 for(const selector of ['.state-panel','.segment-thumb','.theme-copy'])expect(await page.locator(selector).first().evaluate(e=>getComputedStyle(e).transitionDuration)).toBe('0s');
});

 test('recolhimento desktop e símbolos 2D correspondentes permitem selecionar estado',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Saneamento básico',exact:true}).click();await page.getByLabel('Selecionar unidade federativa').selectOption('AP');
 const panel=page.locator('.state-panel');const full=(await panel.boundingBox())!.height;
 await page.getByRole('button',{name:'Recolher detalhes do estado'}).press('Enter');await expect.poll(async()=>(await panel.boundingBox())!.height).toBeLessThan(full-100);
 await page.getByRole('button',{name:'Expandir detalhes do estado'}).press('Enter');await expect.poll(async()=>(await panel.boundingBox())!.height).toBeGreaterThan(full-5);
 await page.getByRole('button',{name:'Fechar painel do estado'}).click();await expect(panel).toHaveCount(0);await page.getByRole('button',{name:'2D',exact:true}).click();
 for(const theme of ['Saneamento básico','Saúde','Segurança','Educação','Salário']){await page.getByRole('button',{name:theme,exact:true}).click();await expect(page.locator('[data-theme-marker]')).toHaveCount(6);await expect(page.locator('[data-theme-marker] path,[data-theme-marker] ellipse').first()).toBeVisible();await page.screenshot({path:'design/review-2026-10-27/2d-'+theme+'.png'});}
 await page.getByRole('button',{name:'Saneamento básico',exact:true}).click();const uf=await page.locator('[data-theme-marker]').first().getAttribute('data-theme-marker');await page.locator('path[data-uf="'+uf+'"]').click({force:true});await expect(panel).toBeVisible();
 });
test('ocultar aba pausa os símbolos de migração2D e retomar permite animação',async({page})=>{await page.goto('/');await page.getByRole('button',{name:'Migração',exact:true}).click();await page.getByRole('button',{name:'2D',exact:true}).click();await expect(page.locator('.atlas-2d')).toBeVisible();await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))});expect(await page.locator('.atlas-2d').evaluate(e=>(e as SVGSVGElement).animationsPaused())).toBe(true);await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'))});expect(await page.locator('.atlas-2d').evaluate(e=>(e as SVGSVGElement).animationsPaused())).toBe(false)});
test('símbolos 3D mantêm seleção da pequena UF e alternância de temas sem erro',async({page})=>{const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');await page.getByRole('button',{name:'Saneamento básico',exact:true}).click();const canvas=page.locator('canvas');await expect(canvas).toHaveAttribute('data-camera-zoom',/.+/);await page.waitForTimeout(700);const box=(await canvas.boundingBox())!;const {OrthographicCamera,Vector3}=await import('three');const {centerOf}=await import('../src/geography');const {visualValues}=await import('../src/domain');const geo=await(await page.request.get('/data/brazil.json')).json();const d=await(await page.request.get('/data/indicators.json')).json();const i=d.indicators.find((i:any)=>i.id==='sanitation');const [x,z]=centerOf(geo.features.find((f:any)=>f.properties.codarea==='53'));const h=visualValues(i.rows,'higher','best').DF.height;const camera=new OrthographicCamera(-box.width/2,box.width/2,box.height/2,-box.height/2,.1,100);camera.position.set(0,15,11);camera.zoom=Number(await canvas.getAttribute('data-camera-zoom'));camera.lookAt(0,0,0);camera.updateProjectionMatrix();camera.updateMatrixWorld();const p=new Vector3(x,h,z).project(camera);await page.mouse.click(box.x+(p.x+1)*box.width/2,box.y+(1-p.y)*box.height/2);await expect(page.getByRole('heading',{name:'Distrito Federal',exact:true})).toBeVisible();await page.getByRole('button',{name:'Fechar painel do estado'}).click();await expect(page.locator('.state-panel')).toHaveCount(0);for(const theme of ['Saúde','Segurança','Educação','Salário','Saneamento básico']){await page.getByRole('button',{name:theme,exact:true}).click();await page.waitForTimeout(700);await expect(canvas).toBeVisible();await page.screenshot({path:'design/review-2026-10-27/3d-'+theme+'.png'});}expect(errors).toEqual([])});
