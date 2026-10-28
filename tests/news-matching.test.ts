import {it,expect} from 'vitest';
import {mentionsState} from '../scripts/news-lib.mjs';
it('reconhece nomes de UF terminados em acento sem confundir outras palavras',()=>{
 for(const name of ['Amapá','Pará','Ceará','Paraná','Piauí'])expect(mentionsState(`Saúde em ${name}, nesta segunda.`,name)).toBe(true);
 expect(mentionsState('Saúde no Paraná hoje','Pará')).toBe(false);
 expect(mentionsState('Saúde no Espírito Santo hoje','Espírito Santo')).toBe(true);
 expect(mentionsState('Paranavaí anuncia hospital','Paraná')).toBe(false);
});

import {feedExcerpt,classifyTopics} from '../scripts/news-lib.mjs';
it('ignora logo RSS aninhado e notícias relacionadas',()=>{const intro=feedExcerpt('&lt;p&gt;&lt;p style=&quot;text-align:center&quot;&gt;&lt;a href=&quot;x&quot;&gt;&lt;img src=&quot;logo&quot;&gt;&lt;/a&gt;&lt;/p&gt;Policiais atuam no Rio de Janeiro.&lt;/p&gt;&lt;p&gt;Notícias relacionadas: hospital no Pará&lt;/p&gt;');expect(intro).toContain('Rio de Janeiro');expect(intro).not.toContain('Pará');expect(classifyTopics({title:intro})).toContain('security')});
