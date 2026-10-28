# Revisão final — animações, expectativa de vida e saneamento

## Parecer independente
Ciclo1: contrato refinado para fixar fontes, migração completa de Saúde e ciclo de vida das animações.
Ciclo2: REJECTED; símbolos2D genéricos e ausência de recolhimento desktop. Ambos corrigidos por SVGs específicos e controle desktop com transição de altura.
Ciclo3: APPROVED WITH RESERVATIONS; zero BLOCKER/IMPORTANT aberto. Revisor novo, sem histórico e somente leitura. Inspecionou código, cinco capturas3D, cinco2D e painéis desktop/mobile. Conferiu ancoragem na altura interpolada das UFs e ausência de handlers nos símbolos.

## Evidência executada em27/10/2026
- `npm test -- --maxWorkers=2`:33 testes/15 arquivos passaram.
- `npm run build`: passou; aviso de chunk3D~960KB permanece.
- `npx playwright test --reporter=line`:34 passaram em1,6min.
- `npx playwright test e2e/motion.spec.ts --reporter=line`:6 passaram em23,9s, incluindo um cenário adicionado após início da suíte completa. Total35 cenários distintos cobertos.
- `npm run update:news`:31/31 fontes responderam,143 combinações.
- `npm run prepare:news`:3 miniaturas autorizadas.
- `git diff --check`: sem erro.

## Cobertura dos requisitos
- Tema: textos/painel com fade/deslocamento; alturas/cores interpoladas; câmera preservada.
- Painel: entrada/saída/recolher/expandir; fechamento inert; reabertura cancela timer; foco retorna ao seletor. Mobile não redimensiona mapa e toque fora fecha.
- Switches: thumb móvel Melhor/Pior e3D/2D; setas verde/vermelha; borda azul neutro; aria-pressed.
- Saúde: expectativa ao nascer,2024, ambos sexos, revisão2024 IBGE; fonte,27UFs,CSV e valorBrasil diretamente publicado. Mortalidade permanece apenas como arquivo histórico.
- Saneamento: cobertura da rede de esgoto, Censo2022/SIDRA7555;27UFs, filtros/denominador/limitações auditados, CSV consistente.
- Símbolos:3 representantes por extremo, desempate determinístico sem alterar ranking; canos/fluxo verde/gotas azuis e demais temas; ancoragem na altura real; clique sob símbolo DF testado. Ilustrações não significam despejos reais ou potabilidade.
- Movimento reduzido, pausa por visibilidade, fallback2D e6 tamanhos mobile cobertos. Migração e áudio preservados.

## Ressalvas
Sem aparelho físico ou Safari/iOS. PausaSVG exercitada com evento de visibilidade simulado, não teste físico de segundo plano. Bundle3D pode carregar lentamente em redes limitadas. Nenhuma falha funcional demonstrada. Não se afirma perfeição absoluta.

## Publicação
Verificação pública será registrada após sucesso do workflow e execução de `node scripts/verify-motion-publication.mjs`.
