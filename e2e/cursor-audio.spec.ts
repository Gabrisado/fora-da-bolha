import {test,expect} from '@playwright/test';
test('som automático moderado e tooltip acompanha cursor à esquerda',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Segurança',exact:true}).click();
 await page.getByLabel('Selecionar unidade federativa').selectOption('AP');
 const audio=page.locator('audio[data-channel="effect"]');await expect(audio).toHaveCount(1);
 await expect.poll(()=>audio.evaluate((a:HTMLAudioElement)=>!a.paused)).toBe(true);
 expect(await audio.evaluate((a:HTMLAudioElement)=>a.volume)).toBe(.32);
 await page.getByRole('button',{name:'Configurar áudio'}).click();
 await expect(page.getByRole('button',{name:/Efeitos (ligados|desligados)|Parar efeito/})).toHaveCount(0);
 await page.getByRole('button',{name:'Configurar áudio'}).click();
 await page.getByRole('button',{name:'Fechar painel do estado'}).click();
 await page.getByRole('button',{name:'2D',exact:true}).click();
 const state=page.locator('path[data-uf="AM"]');await state.hover();
 const tip=page.locator('.cursor-tooltip');await expect(tip).toHaveText(/Amazonas/);
 const before=await tip.boundingBox();await page.mouse.move(before!.x+before!.width+44,before!.y+25);
 const after=await tip.boundingBox();expect(after!.x).toBeGreaterThan(before!.x+15);
 await page.mouse.move(30,30);await expect(tip).toHaveCount(0);
});
