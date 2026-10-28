import {it,expect} from 'vitest';
import {classifyTopics,isPromotional} from '../scripts/news-lib.mjs';
it('não transforma biografia, entretenimento e anúncios em indicadores',()=>{
 for(const title of ['Camila Kfouri, filha do jornalista Juca Kfouri, morre aos 48 anos','Manaus recebe vaquejada com R$ 120 mil em prêmios e show de Zé Vaqueiro e Nattan','Entre vinhos e memórias, a Vinícola Dezem celebra o sabor da família','Roberto Carlos se apresenta em São José dos Campos no dia 29 de outubro'])expect(classifyTopics({title,description:'professor hospital crime trabalho universidade'})).toEqual([]);
 expect(isPromotional('https://g1.globo.com/pr/parana/especial-publicitario/marca/noticia/a.ghtml')).toBe(true);
 expect(classifyTopics({title:'Professor explica mudanças no ensino médio'})).toContain('education');
 expect(classifyTopics({title:'Hospital amplia atendimento no Pará'})).toContain('health');
 expect(classifyTopics({title:'Indústria abre vagas de emprego no Paraná'})).toContain('salary');
});
