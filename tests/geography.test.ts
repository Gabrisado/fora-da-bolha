import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {centerOf,projection,rings} from '../src/geography';
it('centros usados nas rotas permanecem dentro dos limites de cada UF',()=>{
 const geo=JSON.parse(readFileSync('public/data/brazil.json','utf8'));
 for(const feature of geo.features){const pts=rings(feature).flat(2).map(p=>projection(p as [number,number])!);const [x,y]=centerOf(feature);
 expect(x,feature.properties.codarea).toBeGreaterThanOrEqual(Math.min(...pts.map(p=>p[0])));
 expect(x,feature.properties.codarea).toBeLessThanOrEqual(Math.max(...pts.map(p=>p[0])));
 expect(y).toBeGreaterThanOrEqual(Math.min(...pts.map(p=>p[1])));expect(y).toBeLessThanOrEqual(Math.max(...pts.map(p=>p[1])));
 }
});
