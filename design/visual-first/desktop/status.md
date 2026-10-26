# Folha da Bolha · Desktop

- Etapa: desktop aprovado, implementação iniciada.
- Referência atual: folha-da-bolha-desktop-v4.png; V1, V2 e V3 preservadas.
- Feedback V4: mostrar países ao redor do Brasil somente por linhas territoriais.
- Revisão V4: contornos discretos dos países vizinhos no plano de fundo, sem preenchimento, elevação, nomes ou interação; Brasil permanece em destaque.
- Prompt V4: editar V3 acrescentando limites geográficos cinza dos países sul-americanos adjacentes no mesmo plano e projeção, recortados na área do mapa; preservar painel, navegação minimalista e ausência de textos inferiores.
- Requisito de implementação V4: usar base cartográfica de países com licença verificada, alinhada à projeção das UFs; não usar os contornos gerados como geometria real. Países vizinhos são contexto não interativo, também no modo 2D.
- Feedback V3: remover textos inferiores indicados no recorte do usuário.
- Revisão V3: removidos aviso de proposta no rodapé, explicação da altura, instruções de mouse e rótulo Reiniciar câmera; preservados escala com extremos e botão de câmera com ícone. Avisos de conteúdo ilustrativo nas notícias mantidos.
- Prompt V3: edição localizada da V2 para remoção dos textos inferiores, preenchimento com fundo grafite e redução do cartão da legenda; preservar demais elementos.
- Feedback do usuário: menu lateral mais minimalista.
- Revisão V2: trilho estreito com ícones sem rótulos fixos, tooltip sob demanda e destaque ativo discreto; painel e mapa preservados.
- Prompt V2: editar somente navegação lateral da V1, reduzir largura, usar ícones de traço fino e áreas clicáveis de 44px, remover nomes fixos e faixa verde grande; preservar identidade, mapa, painel e dados ilustrativos.
- Composição pretendida: 1440 × 900; imagem retornada: 1586 × 992, sem distorção.
- Geração: gerador integrado imagegen, proposta ui-mockup, sem API externa.
- Objetivo: atlas editorial grafite com mapa brasileiro extrudido, navegação temática, Melhor/Pior, bandeira temporária e painel estadual à esquerda.
- Referência de estilo consultada: https://styles.refero.design/style/90ce5883-bb24-4466-93f7-801cd617b0d1 ; uso de superfícies grafite e bordas discretas, com tipografia editorial própria.
- Componentes planejados: shadcn/ui para controles e painel; mapa de geometria oficial IBGE via Three.js, não a imagem gerada.
- Conteúdo: valores, alturas e cores são ilustrativos. Notícias marcadas como ilustrativas; sem números estatísticos inventados.
- Observação: geometria e bandeira geradas são conceituais, não referências cartográficas oficiais. Implementação usará malha e bandeiras verificadas. Ajustar profundidade das laterais para polígonos lisos, não relevo geológico.
- Aprovação V4: usuário disse “otimo, pode iniciar” após apresentação da V4.
- Implementação da interface: iniciada em 26/10/2026.
- Mobile: proposta ainda não gerada; depende da direção desktop aprovada.

## Prompt de geração

Uma interface desktop frontal em português, composição 1440 × 900, masthead Folha da Bolha e assinatura O Brasil, além da sua bolha. Estética editorial grafite, títulos serifados, controles sans-serif e metadados monoespaçados. Navegação à esquerda com Explorar, Saúde, Segurança, Educação, Salário, Migração e Metodologia. Painel de Santa Catarina aberto em Saúde, indicador Mortalidade infantil sem valor preenchido, fonte e notícias explicitamente ilustrativas. Brasil grande centralizado à direita, geografia reconhecível, estados extrudidos com alturas moderadas e cores de verde a vermelho, bandeira temporária no topo de Santa Catarina. Controles Melhor/Pior e 3D/2D, legenda e instruções discretas. Sem comparação lado a lado, estatísticas ou manchetes reais inventadas, neon, fotos ou decoração de dispositivo.
