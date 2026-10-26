import {it,expect} from 'vitest';
import {mortalityRate} from '../src/mortality';
import {readFileSync} from 'node:fs';
it('calcula taxa bruta por 100 mil sem misturar denominadores',()=>{
 expect(mortalityRate(500,100000)).toBe(500);
 expect(mortalityRate(100,200000)).toBe(50);
 expect(mortalityRate(0,100000)).toBe(0);
 expect(()=>mortalityRate(5,0)).toThrow();
 expect(()=>mortalityRate(-1,100)).toThrow();
 expect(()=>mortalityRate(5,NaN)).toThrow();
});
it('snapshot usa óbitos residentes não fetais e população 2024 em todas as UFs',()=>{
 const data=JSON.parse(readFileSync('public/data/indicators.json','utf8'));
 const audit=JSON.parse(readFileSync('public/data/mortality-2024-audit.json','utf8'));
 const h=data.indicators.find((i:any)=>i.id==='health');expect(h.period).toBe('2024');expect(h.title).toContain('taxa bruta');expect(h.rows).toHaveLength(27);
 expect(h.rows.reduce((n:number,r:any)=>n+r.deaths,0)).toBe(audit.totalResidentDeaths);
 for(const r of h.rows)expect(r.value).toBe(Number(mortalityRate(r.deaths,r.population).toFixed(2)));
});
