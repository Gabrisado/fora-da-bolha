const slugs={AC:'acre',AL:'alagoas',AP:'amapa',AM:'amazonas',BA:'bahia',CE:'ceara',DF:'distrito-federal',ES:'espirito-santo',GO:'goias',MA:'maranhao',MT:'mato-grosso',MS:'mato-grosso-do-sul',MG:'minas-gerais',PA:'para',PB:'paraiba',PR:'parana',PE:'pernambuco',PI:'piaui',RJ:'rio-de-janeiro',RN:'rio-grande-do-norte',RS:'rio-grande-do-sul',RO:'rondonia',RR:'roraima',SC:'santa-catarina',SP:'sao-paulo',SE:'sergipe',TO:'tocantins'};
export function newsFeeds(states){return[
 {url:'https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml',name:'Agência Brasil',institutional:true,type:'rss'},
 {url:'https://g1.globo.com/rss/g1/',name:'g1',institutional:false,type:'rss'},
 {url:'https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=100',name:'Agência IBGE Notícias',institutional:true,type:'ibge'},
 ...states.map(s=>({url:`https://g1.globo.com/rss/g1/${s.uf.toLowerCase()}/${slugs[s.uf]}/`,name:`g1 · ${s.name}`,uf:s.uf,stateName:s.name,institutional:false,type:'rss'}))
]}
