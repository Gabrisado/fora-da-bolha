# Refinamento aprovado — mapa maior e modelos reais

## Objetivo e limite
Aplicar a proposta mobile V1 e os7 modelos reais da prancha V2 aprovados pelo usuário em27/10/2026 (“agora eu vi progresso vambora”). Corrigir transições Explorar↔temas, destacar navegação com elemento móvel, compactar cabeçalho e eliminar faixa inferior vazia. Preservar dados, fontes, notícias, áudio, seleção e migração. Publicar somente após verificações e crítica independente.

## Aceite
- Faixa da marca preservada. SeletorUF à esquerda e3D/2D ao lado na mesma linha até320px. Título e Melhor/Pior abaixo; referência/fonte/tabela acessíveis. Canvas ocupa o restante até o rodapé, centralizar e legenda dentro dele. Painel mobile sobreposto sem redimensionar canvas.
- Navegação Motion: destaque desliza horizontal no rodapé e vertical no desktop. Estado/cores animam650ms desde valor visível, inclusive Explorar, retorno e interrupção; câmera preservada na troca. Símbolos e rotas entram/saem250ms; movimento reduzido estático.
- Modelos locais GLB: coração, escudo policial, arma, livro, moedas, canosCC0; gota de moriarty CC BY3.0, creditada. Arquivos reais, fontes/hashes/modificações em public/models/manifest.json. Sem embeds externos.7GLBs408668bytes, cada um<500KB e10mil triângulos.
- Materiais/escala/orientação consistentes;3 representantes por extremo, altura ancorada à superfície efetivamente animada. Tamanho alvo34px mobile/44px desktop (limitado durante zoom). Símbolos não captam cliques. Falha de modelo preserva mapa e mostra símbolo estático e aviso, sem declarar substituição concluída.
- Tema Explorar neutro, Migração preserva aviões/dados. Sem mudanças nos indicadores estatísticos.

## Artefatos
Referência design/visual-first/polish-v2/mobile-proposta-v1.png e models-board-v2.png; estado de aprovação em status.md. Código src/App.tsx, atlas-layout.css, Atlas.tsx, ThemeMarkers.tsx, map-motion.ts e Marker2D.tsx. Novos testes e2e/polish.spec.ts, tests/map-motion.test.ts e model-assets.test.ts. CSS anterior teve regras geométricas conflitantes removidas; layout novo centralizado em atlas-layout.css.

## Evidência final
-36/36 testes unitários,44/44 Chrome e build final passaram.
- Verificador de produção compilada em4183 passou1440×900 e390×844,7GLBs locais,0errosJS/0requisições externas.
- Reversão2D interrompida medida677,4ms; problema de encurtamentoCSS eliminado.
- Parecer final independente: APPROVED WITH RESERVATIONS, zero IMPORTANT/BLOCKER aberto.
- Detalhes e ressalvas em2026-10-27-polish-review.md. Publicação ainda depende de implantação e conferência pública.

## Limitações conhecidas
Sem aparelho físico ou Safari. Bundles3D e Motion aumentamJS; modelos são leves e carregados por tema. Existem avisos de dependências dev herdadas;0problemas na árvore de produção. Não prometer perfeição absoluta.

## Correções de crítica
Ciclo1: paridade2D (tamanho/presença/cor) corrigida. Ciclo2: reversing shortening factor doCSS eliminando duração fixa corrigido em AnimatedStatePath.tsx por interpolação explícita650ms desde fill efetivamente visível, com cancelamento e movimento reduzido. Documentação reconciliada com aprovação recebida.
