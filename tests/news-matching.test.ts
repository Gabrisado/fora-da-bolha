import {it,expect} from 'vitest';
import {mentionsState} from '../scripts/news-lib.mjs';
it('reconhece nomes de UF terminados em acento sem confundir outras palavras',()=>{
 for(const name of ['Amapá','Pará','Ceará','Paraná','Piauí'])expect(mentionsState(`Saúde em ${name}, nesta segunda.`,name)).toBe(true);
 expect(mentionsState('Saúde no Paraná hoje','Pará')).toBe(false);
 expect(mentionsState('Saúde no Espírito Santo hoje','Espírito Santo')).toBe(true);
 expect(mentionsState('Paranavaí anuncia hospital','Paraná')).toBe(false);
});
