import {test,expect} from '@playwright/test';
test('Salário distribui o gradiente além do DF e exibe o nome novo',async({page})=>{
 await page.goto('/');await expect(page.getByRole('heading',{name:'Fora da bolha',exact:true})).toBeVisible();
 await expect(page).toHaveTitle(/Fora da bolha/);
 await page.getByRole('button',{name:'Salário',exact:true}).click();
 await expect(page.getByTestId('salary-color-scale')).toHaveText('Cores por posição no ranking');
 await page.getByRole('button',{name:'2D',exact:true}).click();
 for(const uf of ['SP','SC']){const c=await page.locator(`path[data-uf="${uf}"]`).getAttribute('fill');expect(parseInt(c!.slice(3,5),16)).toBeGreaterThan(parseInt(c!.slice(1,3),16))}
 await page.getByRole('button',{name:'3D',exact:true}).click();await expect(page.locator('canvas')).toBeVisible();await page.waitForLoadState('networkidle');
 await page.screenshot({path:'design/visual-first/desktop/fora-da-bolha-salario.png'});
});
test('navega temas, seleção única, modos e fontes',async({page})=>{
 await page.goto('/');await expect(page.getByRole('heading',{name:'Fora da bolha'})).toBeVisible();
 await page.getByRole('button',{name:'Salário',exact:true}).click();
 await page.getByLabel('Selecionar unidade federativa').selectOption('SC');
 await expect(page.getByRole('heading',{name:'Santa Catarina',exact:true})).toBeVisible();
 await expect(page.getByTestId('indicator-value')).not.toHaveText('—');
 await page.getByRole('button',{name:'Pior',exact:true}).click();
 await page.screenshot({path:'design/visual-first/desktop/desktop-3d-executado.png',fullPage:true});
 await page.getByRole('button',{name:'2D',exact:true}).click();
 await expect(page.locator('svg.atlas-2d path[data-uf]')).toHaveCount(27);
 await page.getByRole('button',{name:'Dados e fontes'}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.screenshot({path:'design/visual-first/desktop/metodologia-executada.png',fullPage:true});
});
test('mantém migração real, sem música e sem opção de desligar efeitos',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Migração',exact:true}).click();
 await page.getByLabel('Selecionar unidade federativa').selectOption('SC');
 await expect(page.getByTestId('migration-status')).toBeVisible();
 await page.getByRole('button',{name:'Configurar áudio'}).click();
 await expect(page.getByRole('button',{name:'Ativar música'})).toHaveCount(0);
 await expect(page.getByRole('button',{name:/Efeitos (ligados|desligados)/})).toHaveCount(0);
});
