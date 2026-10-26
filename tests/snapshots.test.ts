import {readFileSync} from 'node:fs';import {describe,it,expect} from 'vitest';
const load=(name:string)=>JSON.parse(readFileSync(new URL(`../public/data/${name}.json`,import.meta.url),'utf8'));
describe('dados reais empacotados',()=>{
 it('27 geometrias oficiais com IDs correspondentes',()=>{const states=load('states'),geo=load('brazil');expect(geo.features).toHaveLength(27);expect(new Set(geo.features.map((f:any)=>f.properties.codarea))).toEqual(new Set(states.map((s:any)=>s.id)))});
 it('indicadores disponíveis não misturam UFs, ausências ou anos',()=>{for(const i of load('indicators').indicators.filter((i:any)=>i.status==='verified')){expect(i.rows).toHaveLength(27);expect(new Set(i.rows.map((r:any)=>r.uf)).size).toBe(27);expect(i.rows.every((r:any)=>Number.isFinite(r.value))).toBe(true);expect(i.period).toMatch(/^20\d{2}$/)}});
 it('matriz migratória completa e saldos nacionais reconciliados',()=>{const m=load('migration');expect(m.status).toBe('verified');expect(m.flows).toHaveLength(702);expect(m.flows.some((f:any)=>f.from===f.to)).toBe(false);expect(m.totals.reduce((n:number,t:any)=>n+t.balance,0)).toBe(0);expect(m.knownTotal).toBe(m.totals.reduce((n:number,t:any)=>n+t.incoming,0))});
});
