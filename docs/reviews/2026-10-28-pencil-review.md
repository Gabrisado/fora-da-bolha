# Correção de legibilidade do lápis —28/10/2026

## Pedido e critério
Usuário mostrou lápis quase invisível e invocou critical-excellence-review. Escopo: corrigir apenas proporção/tamanho/contraste do lápis quebrado existente; preservar outros símbolos, dados, navegação, rota e interações. Correção da referência aprovada, não troca de direção visual.

## Crítica inicial
REJECTED. F1 IMPORTANT: haste~0,1106 para comprimento2 (~1:18) vira dois riscos~2px no mapa; normalização da maior dimensão não garante espessura. F2 IMPORTANT: faltava validação da correção em mobile, zoom e seleção. Correção limitada recomendada: engrossar antes de normalizar e dimensionar só o lápis; manter ponta/borracha/quebra, sem interceptar seleção.

## Correção
Haste transversal4×; abertura recalibrada; ponta grafite e borracha alongadas para leitura pequena, rosa/prata/grafite com cores preservadas (sem tonalização de resultado ruim). Tamanho limitado pela silhueta efetivamente projetada:42px em mobile e52px desktop. O cálculo usa vértices reais normalizados e câmera ortográfica, respeitando yaw/zoom. Os demais símbolos mantêm a escala anterior. Geometria, licença e hash no manifesto atualizados.

## Evidência
- Teste antes da correção falhou: largura0,110578<0,42.
- Após correção, teste de geometria/budget/faces passa.
-3testes Chrome passaram em320×844,390×844 e1440×900: lápis pronto,3representantes, dimensão em zoom inicial/mínimo/máximo, haste>=4px, abertura visível, clique sob marcador selecionaAmazonas e zeroJSerrors.
- Medições reais: comprimento projetado42/52px; haste aparente9.62–14.43px; distância entre faces2.71–5.02px. Dados em acceptance-*.json.
- Capturas nativas before-390.png/before-1440.png e final-320.png/final-390.png/final-1440.png em design/review-2026-10-28-pencil.
- FrameEvidence de diagnóstico existe somente emDEV e registra projeção/caps para teste; não é entregue em produção.
-40/40unitários passam; build de produção passa.51/51cenários gerais de navegador passam (2,5min). Após ajuste final de abertura .20→.23,3/3testes específicos passam novamente (28,2s), com assertions dos limites reais de câmera (mínimo fit×0,65; máximo fit×4).
- Segunda crítica encontrou F3 IMPORTANT: DF oculto pelo relevo/ livro de Goiás. Corrigido somente no lápis do DF, com elevação adaptada acima de DF/GO e linha de ancoragem discreta. Capturas clearance-{initial,min,max}-{320,390,1440}.png verificam a visibilidade real, não apenas bounding boxes.
- O primeiro driver de zoom usava uma rolagem longa, equivalente a um único passo: essa evidência foi substituída por múltiplos passos e zoom medido. Valores inicial/mínimo/máximo:320=25,3968/16,5079/101,5873;390=30,9524/20,1190/123,8095;1440=56,4543/36,6953/225,8173. Em máximo, câmera rotacionada pelo mouse para manter DF visível; no limite320 a ponta pode alcançar a borda da tela, restrição de enquadramento normal do zoom.

## Limites
Safari e aparelho físico não testados; Chrome com mobile/toque emulados. Não afirmar perfeição. Revisão independente final e publicação/conferência pública pendentes.

## Veredito independente final
APPROVED WITH RESERVATIONS, ciclo3/3, pencil_critic_final. F1/F2/F3 encerrados, nenhum BLOCKER/IMPORTANT aberto. Reservas menores: ponta pode alcançar a borda em320px no máximo zoom; aparelho físico eSafari não testados.40unitários ebuild finais passam;51cenários gerais passam antes do último ajuste isolado de abertura,3específicos passam depois. Publicação será verificada separadamente.
