# Fora da bolha — prontidão para uso público

## Veredito independente: APPROVED WITH RESERVATIONS
Revisão em três ciclos encerrada em 27/10/2026. O terceiro crítico confirmou: zero bloqueadores e zero achados importantes abertos dentro dos critérios definidos. Não é alegação de perfeição absoluta ou garantia de audiência.

## Achados encerrados
- CR-01: ano e fonte sempre disponíveis na leitura principal; ressalva de mortalidade bruta sem ajuste etário; controles Menor taxa/Maior taxa e legenda específica. A tabela calcula a taxa Brasil por soma de óbitos/soma de populações, com proteção para denominadores ausentes.
- CR-02: gate editorial conservador pelo assunto do título, exclusão de publicidade, biografias/topônimos/animais e deslocamentos incidentais; regressões de cada caso; mesma regra na coleta, revalidação do cache e frontend. O cache antigo não é aceito apenas pela versão. Casos demonstrados removidos. Não se promete classificação semântica infalível de toda futura manchete.
- UX-01: títulos/controles/seletor sem colisão em 901,922,1024,1280 e1440px; enquadramento desktop desloca o mapa nacional para a área disponível ao abrir o painel, sem redimensionar o canvas. Mobile preserva mapa utilizável e gaveta.
- CR-03: link primário SIDRA10159 e período em Dados e fontes.
- CR-04: estado de fontes selecionadas e nacionais exibido corretamente; falhas de outra UF não são chamadas de falhas nacionais.
- Sugestões: tabela acessível27UFs, contexto nacional agregado de mortalidade, continuidade da identidade grafite/verde/serifa e logo aprovada.

## Evidência fresca
- npm test -- --maxWorkers=2:29 testes,13 arquivos, todos aprovados; suíte repetida independentemente pelo crítico.
- npm run build: exit0. Aviso conhecido: chunk3D >500kB, carregado separadamente.
- npm audit --omit=dev --json: exit0, zero vulnerabilidades reportadas em dependências de produção.
- npx playwright test --reporter=line:26cenários aprovados. Inclui6viewports mobile, WebGL, gesto de giro/pinça, seleção, responsividade, gaveta, teclado/diálogo/tabela, fallback2D, movimento reduzido, áudio e foto com fallback.
- Após ajuste desktop da câmera,8cenários afetados repetidos e aprovados: câmera/bandeira/áudio e5larguras de cabeçalho.
- Sweep real Chrome:27UFs em cada um dos4indicadores,27UFs na migração, sem exceções JavaScript e sem sobreposição de áudios.
- Coleta:31/31fontes responderam;138registros UF/tema/link e3miniaturas próprias autorizadas nesta rodada. Cobertura insuficiente permanece explícita.
- Crítico verificou27UFs únicas/indicador, taxa de cadaUF consistente com óbitos/população armazenados, taxa Brasil720,6642,702pares migratórios e saldo nacional zero.
- Capturas de comparação: design/review-2026-10-27/corrected/health-922.png, health-390.png, health-320.png e table.png.

## Reservas e limites
Sem teste em aparelho físico, Safari/iOS ou leitor de tela real. Não foi refeita a agregação de microdados oficiais nesta rodada; proveniência, snapshots e ressalvas anteriores foram preservados. Essas lacunas não foram apresentadas como testes realizados. A política estatística não equipara mortalidade bruta à qualidade da assistência. Notícias não alteram os indicadores.

## Condição de entrega
Publicar apenas código testado no repositório atual e conferir novamente a versão pública, com fontes, contexto, tabela e ausência dos falsos positivos citados. A publicação e verificação serão registradas após sua conclusão.
