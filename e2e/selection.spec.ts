import {test,expect} from '@playwright/test';
test('trocar estado corta o som e outro elegível reinicia imediatamente',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Segurança',exact:true}).click();
 
 await page.getByLabel('Selecionar unidade federativa').selectOption('AP');
 const audio=page.locator('audio[data-channel="effect"]');await expect.poll(()=>audio.evaluate((a:HTMLAudioElement)=>a.currentTime)).toBeGreaterThan(.1);
 const first=await audio.elementHandle();await page.getByLabel('Selecionar unidade federativa').selectOption('BA');
 await expect.poll(()=>audio.evaluate((a:HTMLAudioElement)=>!a.paused&&a.currentTime<2)).toBe(true);
 expect(await first!.evaluate((a:HTMLAudioElement)=>a.paused&&!a.isConnected)).toBe(true);
 await page.getByLabel('Selecionar unidade federativa').selectOption('SP');await expect(audio).toHaveCount(0);
});
test('migração nacional não cria ou troca rotas ao selecionar UFs',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Migração',exact:true}).click();await page.getByRole('button',{name:'2D',exact:true}).click();
 const routes=page.locator('[data-migration-route]');await expect.poll(()=>routes.count()).toBeGreaterThan(10);
 const before=await routes.evaluateAll(es=>es.map(e=>e.getAttribute('data-migration-route')));
 await expect(page.locator('[data-migration-plane]')).toHaveCount(before.length);
 for(const uf of ['SC','PA','SP']){await page.getByLabel('Selecionar unidade federativa').selectOption(uf);expect(await routes.evaluateAll(es=>es.map(e=>e.getAttribute('data-migration-route')))).toEqual(before);await expect(page.getByTestId('migration-totals')).toBeVisible()}
 await page.screenshot({path:'design/visual-first/desktop/migracao-nacional.png'});
});
test('notícias locais filtram por estado e tema com links identificados',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Segurança',exact:true}).click();await page.getByLabel('Selecionar unidade federativa').selectOption('PA');
 await expect(page.locator('.news-card').first()).toBeVisible();
 const headlines=await page.locator('.news-card').count();expect(headlines).toBeLessThanOrEqual(5);
 await expect(page.locator('.news-card').first()).toHaveAttribute('target','_blank');
 await page.locator('.news').scrollIntoViewIfNeeded();await page.screenshot({path:'design/visual-first/desktop/noticias-estaduais.png'});
});
