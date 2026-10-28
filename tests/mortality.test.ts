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
it('CSV histórico preserva mortalidade sem substituir a saúde atual',()=>{const lines=readFileSync('public/data/mortality-2024.csv','utf8').trim().split('\n').slice(1).map(line=>line.split(';'));const audit=JSON.parse(readFileSync('public/data/mortality-2024-audit.json','utf8'));expect(lines).toHaveLength(27);expect(lines.reduce((sum,r)=>sum+Number(r[3]),0)).toBe(audit.totalResidentDeaths);for(const r of lines)expect(Number(r[5].replace(',','.'))).toBe(Number(mortalityRate(Number(r[3]),Number(r[4])).toFixed(2)));const health=JSON.parse(readFileSync('public/data/indicators.json','utf8')).indicators.find((i:any)=>i.id==='health');expect(health.metric).toBe('life-expectancy')});
