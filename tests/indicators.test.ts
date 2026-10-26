import {describe,it,expect} from 'vitest';
import {rankValues,visualValues,topFlows,eligibleNews} from '../src/domain';
describe('ranking e relevo',()=>{
 it('menor mortalidade é melhor e só a altura inverte',()=>{
  const rows=[{uf:'SC',value:8},{uf:'SP',value:12},{uf:'AC',value:20},{uf:'AM',value:null}];
  const best=visualValues(rows,'lower','best'),worst=visualValues(rows,'lower','worst');
  expect(best.SC.quality).toBe(1);expect(best.AC.quality).toBe(0);
  expect(best.SC.height).toBeGreaterThan(best.AC.height);
  expect(worst.AC.height).toBeGreaterThan(worst.SC.height);
  expect(worst.SC.color).toBe(best.SC.color);expect(best.AM.rank).toBeNull();
 });
 it('empates compartilham posição e zero não vira ausência',()=>{
  expect(rankValues([{uf:'SC',value:0},{uf:'SP',value:0},{uf:'AC',value:2}],'lower')).toEqual({SC:1,SP:1,AC:3});
 });
 it('valores iguais não produzem NaN',()=>{
  const values=visualValues([{uf:'SC',value:3},{uf:'SP',value:3}],'higher','best');
  expect(Number.isFinite(values.SC.height)).toBe(true);expect(values.SC.height).toBe(values.SP.height);
 });
 it('maior rendimento recebe maior qualidade',()=>{
  expect(visualValues([{uf:'A',value:100},{uf:'B',value:200}],'higher','best').B.quality).toBe(1);
 });
 it('escala por posição distribui cores apesar de um rendimento extremo, sem alterar alturas',()=>{
  const rows=[100,110,120,130,140,1000].map((value,i)=>({uf:String(i),value}));
  const linear=visualValues(rows,'higher','best'),ranked=visualValues(rows,'higher','best','rank');
  const color=ranked['4'].color;
  expect(parseInt(color.slice(3,5),16)).toBeGreaterThan(parseInt(color.slice(1,3),16));
  for(const r of rows){expect(ranked[r.uf].height).toBe(linear[r.uf].height);expect(ranked[r.uf].rank).toBe(linear[r.uf].rank)}
  expect(new Set(Object.values(ranked).map(v=>v.color)).size).toBe(rows.length);
  const ties=visualValues([{uf:'A',value:100},{uf:'B',value:100},{uf:'C',value:200}],'higher','best','rank');
  expect(ties.A.color).toBe(ties.B.color);
 });
});
describe('fluxos e notícias',()=>{
 it('filtra direção, ignora autorrotas e ordena fluxos',()=>{
  const flows=[{from:'SP',to:'SC',value:50},{from:'PR',to:'SC',value:100},{from:'SC',to:'SC',value:999},{from:'SC',to:'RS',value:20}];
  expect(topFlows(flows,'SC','in').map(f=>f.from)).toEqual(['PR','SP']);
  expect(topFlows(flows,'SC','out').map(f=>f.to)).toEqual(['RS']);
 });
 it('não apresenta notícia inválida, duplicada ou de outra UF',()=>{
  const date='2026-10-26T12:00:00Z';
  const row={uf:'SC',topic:'health',title:'Saúde em Santa Catarina',url:'https://example.org/a',publishedAt:date,source:'Fonte',institutional:false};
  expect(eligibleNews([row,row,{...row,uf:'SP'},{...row,url:'javascript:alert(1)'},{...row,publishedAt:'inválida'}],'SC','health',new Date(date))).toHaveLength(1);
 });
});
