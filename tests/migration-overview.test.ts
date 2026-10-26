import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {migrationOverview} from '../src/migration';
it('cobre as 27 UFs com rotas reais apenas de saldo negativo para positivo',()=>{
 const m=JSON.parse(readFileSync('public/data/migration.json','utf8'));
 const result=migrationOverview(m.flows,m.totals);
 const totals=new Map(m.totals.map((t:any)=>[t.uf,t.balance]));
 expect(new Set(result.routes.flatMap((f:any)=>[f.from,f.to])).size).toBe(27);
 for(const route of result.routes){expect(Number(totals.get(route.from))).toBeLessThan(0);expect(Number(totals.get(route.to))).toBeGreaterThan(0);expect(m.flows).toContainEqual(route)}
 expect(new Set(result.routes.map((f:any)=>f.from+'-'+f.to)).size).toBe(result.routes.length);
 expect(result.gaining+result.losing+result.balanced).toBe(27);
});
it('saldo zero e ausência de rotas não geram trajetos inventados',()=>{
 const result=migrationOverview([],[{uf:'SP',incoming:1,outgoing:1,balance:0}]);
 expect(result.routes).toEqual([]);expect(result.balanced).toBe(1);expect(result.averageGain).toBe(0);
});
