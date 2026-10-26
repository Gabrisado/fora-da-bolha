import {it,expect} from 'vitest';
import {normalizeArticle,mergeNewsCache,TOPICS,classifyTopics} from '../scripts/news-lib.mjs';
const now=new Date('2026-10-26T12:00:00Z');
const base={title:'Hospital amplia atendimento no Pará',description:'Investimento no SUS',url:'https://example.org/a',date:'2026-10-25T10:00:00Z'};
it('valida datas, links e tema com título e descrição',()=>{
 expect(normalizeArticle(base,now)?.title).toBe(base.title);
 expect(normalizeArticle({...base,url:'javascript:alert(1)'},now)).toBeNull();
 expect(normalizeArticle({...base,date:'inválida'},now)).toBeNull();
 expect(normalizeArticle({...base,date:'2026-11-01'},now)).toBeNull();
 expect(TOPICS.health.test('Prefeitura entrega obra '+base.description)).toBe(true);
 expect(TOPICS.security.test('segurança alimentar nas escolas')).toBe(false);
});
it('não classifica escolas usadas apenas como locais de votação como educação',()=>{
 expect(classifyTopics({title:'Escola Classe 102 Sul: resultado da votação no 2º turno',description:'Votos por local de votação na escola'})).not.toContain('education');
 expect(classifyTopics({title:'Escola Professora Maria, zona eleitoral: resultado da votação no 2º turno',description:'Educação'})).toEqual([]);
 expect(classifyTopics({title:'Professor explica mudanças no ensino médio',description:''})).toContain('education');
 expect(classifyTopics({title:'Polícia investiga assalto no Pará',description:''})).toContain('security');
});
it('cache deduplica por estado/tema/link e preserva fonte anterior se falhar',()=>{
 const a={uf:'PA',topic:'health',title:'Antiga',url:'https://example.org/a',publishedAt:'2026-10-25T10:00:00.000Z'};
 const b={...a,title:'Atualizada'};
 expect(mergeNewsCache([a],[b,b],now)).toEqual([b]);
 expect(mergeNewsCache([a],[],now)).toEqual([a]);
 expect(mergeNewsCache([{...a,publishedAt:'2026-01-01'}],[],now)).toEqual([]);
 expect(mergeNewsCache([a],[{...b,uf:'AM'}],now)).toHaveLength(2);
});
