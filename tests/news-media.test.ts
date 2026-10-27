import {describe,it,expect} from 'vitest';
import {senatePhoto,ebcPhoto,validateNews} from '../scripts/news-media.mjs';
describe('direitos e cache editorial',()=>{
 it('aceita somente autoria própria com crédito e domínio oficial',()=>{const url='https://www12.senado.leg.br/noticias/materias/2026/10/exemplo';expect(senatePhoto('<img src="/noticias/foto.jpg" credito="Maria Silva/Agência Senado">',url)?.credit).toBe('Maria Silva/Agência Senado');for(const credit of ['', 'Divulgação/Agência Senado','Reuters','Reprodução/Agência Senado'])expect(senatePhoto(`<img src="/foto.jpg" credito="${credit}">`,url)).toBeNull();expect(senatePhoto('<img src="https://outro.com/foto.jpg" credito="Maria/Agência Senado">',url)).toBeNull()});
 it('rejeita snapshot inválido antes da publicação',()=>{expect(()=>validateNews({items:[],updatedAt:null})).toThrow();expect(validateNews({items:[],updatedAt:new Date().toISOString()})).toBe(true);expect(()=>validateNews({items:[{uf:'AM',topic:'health',title:'a',url:'javascript:alert(1)',publishedAt:new Date().toISOString()}],updatedAt:new Date().toISOString()})).toThrow()});
});

it('associa foto própria da EBC ao crédito e recusa terceiro',()=>{const url='https://agenciabrasil.ebc.com.br/noticia/exemplo';expect(ebcPhoto('<img src="https://imagens.ebc.com.br/id/754x0/smart/https://agenciabrasil.ebc.com.br/sites/default/files/foto.jpg" title="Maria/Agência Brasil">',url)?.credit).toBe('Maria/Agência Brasil');expect(ebcPhoto('<img src="https://outro.com/a.jpg" title="Reuters">',url)).toBeNull()});
