# Fora da bolha

Atlas editorial brasileiro em 3D, com indicadores por estado, fontes consultáveis e migração interna.

## Acessar o site

**[Abrir Fora da bolha](https://gabrisado.github.io/fora-da-bolha/)** — acesso público, sem instalação.

Publicado e verificado em 26/10/2026, em desktop e mobile com WebGL 3D ativo. Atualizações futuras passam pelo workflow de publicação na aba Actions do repositório.

Funciona em desktop e em layout mobile, sem cadastro. Permita WebGL para usar o mapa 3D; há alternativa 2D quando ele não estiver disponível. Os efeitos sonoros são automáticos nos estados elegíveis, com volume fixo de 32%, sem opção de desativação no site. O navegador pode exigir uma interação para liberar a reprodução. Não há música.

Dados e notícias são snapshots com datas e fontes visíveis. O site estático não coleta notícias sozinho: a rotina local deve gerar o cache, e uma nova publicação precisa enviar os arquivos atualizados. Não há serviço contínuo de coleta instalado no GitHub.

Comentários, sugestões e problemas podem ser registrados nas **[Issues do repositório](https://github.com/Gabrisado/fora-da-bolha/issues)**, preferencialmente com navegador, tamanho da tela, passos e captura do problema. Consulte as limitações abaixo antes de interpretar os indicadores.

## Publicação pelo GitHub Pages

O workflow `.github/workflows/pages.yml` executa `npm ci`, testes de lógica/dados e build, e publica somente `dist` após alterações em `main`. Não envia `node_modules`, microdados de `data/raw`, variáveis locais ou artefatos temporários. Para publicar manualmente, use Actions → Publicar Fora da bolha → Run workflow.

## Iniciar

Necessário Node.js 22 ou superior.

```powershell
npm install
npm run dev
```

Abra o endereço exibido pelo Vite. A porta preferida é 4180; se estiver ocupada, ele escolhe a próxima. Não abra `index.html` por duplo clique: o aplicativo precisa do servidor local.

## Navegar

- Menu com ícones: explorar, saúde, segurança, educação, salário e migração. Nomes aparecem no hover/foco.
- Arraste para orbitar dentro dos limites; scroll aproxima. Ícone de alvo restaura câmera.
- Clique em uma UF ou use o seletor acessível. Um estado de cada vez.
- Melhor/Pior inverte as alturas, não as cores. Verde é melhor no indicador, vermelho é pior. O hover mostra a bandeira.
- 2D mantém acesso ao mapa quando o 3D não está disponível.
- Migração abre uma visão nacional contínua: UFs com saldo negativo só originam aviões e UFs com saldo positivo só recebem. Todas as 27 UFs participam. Selecionar uma UF muda somente o painel (entradas, saídas e saldo), sem criar/reiniciar rotas. As rotas são um recorte de fluxos reais do Censo, não todas as mudanças nem viagens aéreas medidas. Cores distinguem sinal do saldo, sem julgamento de melhor/pior. Estatísticas nacionais mostram quantidade de UFs em cada grupo e média dos respectivos saldos.
- Dados e fontes abre a metodologia. Não há música de fundo. Efeitos têm ativação voluntária, volume e amostras por tema: hospital (ambiente, monitor e carrinho), sequência de disparos com moto em alta rotação/limitador (8 segundos), sino escolar e caixa registradora. Arquivos CC0; nada toca automaticamente ao abrir.

## Dados realmente coletados nesta etapa

- Segurança: homicídios registrados, 2024, 27 UFs, Ipea/SIM, incluindo intervenções legais.
- Rendimento: média anual real habitual do trabalho, 2025, 27 UFs, PNAD anual SIDRA 7444. Não é renda domiciliar per capita.
- Migração: SIDRA 10159, 702 pares entre UFs, 2017–2022, pessoas de 5 anos ou mais, origens conhecidas. Entradas e saídas nacionais reconciliadas.
- Notícias: 27 feeds estaduais do g1, feed nacional do g1, Agência Brasil e API aberta Agência IBGE Notícias (30 fontes), sem chaves nem planos pagos. Classificação por UF e tema, manchete + subtítulo/primeiro parágrafo do RSS; conteúdo completo não é publicado. Canal estadual validado, UF da URL conferida quando disponível, tabelas de votação em escolas excluídas. Deduplicação por URL e manchete. Cobertura pode ser insuficiente; não há garantia de todas as notícias relevantes.
- Educação: Ideb 2025 do ensino médio da rede estadual, 27 UFs, Inep. Recorte explicitamente estadual; não agrega as redes federal e municipal.
- Saúde: expectativa de vida ao nascer em 2024, ambos os sexos, coluna e0_T das Projeções da População do IBGE, revisão2024. Indicador demográfico modelado, não previsão individual ou avaliação completa da assistência. Valor Brasil76,61 anos diretamente publicado, sem média das UFs. CSV `public/data/life-expectancy-2024.csv`; fontes e hashes em `health-sanitation-audit.json`. O CSV de mortalidade foi preservado somente como histórico.
- Saneamento básico: cobertura da rede de esgoto entre moradores de domicílios particulares permanentes ocupados (Censo2022/SIDRA7555). Inclui rede geral, pluvial e fossa ligada à rede. Não mede tratamento nem potabilidade. CSV `public/data/sanitation-2022.csv`.

Ausências são mostradas como indisponíveis, sem valores inventados.

## Atualizar e testar

```powershell
npm run update:data
node scripts/update-migration.mjs
npm run update:news
npm run update:watch
npm test
npm run build
npm run test:e2e
```

Para reimportar o Ideb da planilha oficial já guardada: `node scripts/import-education.mjs`. A atualização geral preserva esse snapshot validado.

Recursos sonoros locais em `public/audio`: créditos, fontes e hashes em `credits.json`; receitas de mixagem em `soundscapes.json`. Para reconstruir: `node scripts/download-audio.mjs` e, com a prévia aberta na porta 4182, `node scripts/prepare-audio.mjs`. O primeiro exige internet; o segundo usa o Chrome instalado para decodificar, mixar e exportar WAV com volume equilibrado e fades. Nenhum oscilador é usado na reprodução.

Mortalidade: baixe o ZIP indicado na auditoria para `data/raw/DO24OPEN_csv.zip`, execute `python scripts/aggregate-mortality.py` (Python 3.11+) e `node scripts/import-mortality.mjs`. Denominador oficial em `data/raw/population-2024.json`, SIDRA 6579/variável 9324. A agregação valida tipo de óbito, ano e residência e publica somente totais. O ZIP bruto não deve ser publicado junto ao site e está ignorado no Git. Não confundir a data do arquivo com o ano dos óbitos. Migração permanece a matriz completa de 702 pares; os saldos enviados pelo usuário foram comparados e coincidem, sem substituir rotas por totais.

A rotina local de indicadores funciona somente enquanto o processo estiver aberto. Ao falhar a consulta, as séries existentes são preservadas. Não existe serviço agendado instalado no computador.

Notícias são coletadas no início de `npm run update:watch` e a cada 6 horas; nunca há busca externa a cada clique no estado. A página relê o JSON local a cada minuto para receber o cache renovado. No site publicado, o workflow GitHub atualiza o cache a cada seis horas mesmo com o computador desligado, sujeito a atrasos do agendador. Não é transmissão em tempo real. Falhas preservam artigos anteriores ainda válidos; datas inválidas, futuras ou fora de 30 dias são rejeitadas. Metadados por fonte e cobertura por UF/tema ficam no `news.json`.

Trocar de estado interrompe imediatamente qualquer efeito. Se a nova UF estiver no grupo que ativa o efeito do indicador, ele reinicia do zero, inclusive em cliques rápidos; uma UF fora desse grupo fica em silêncio. Ao mudar de tema, ocultar a aba ou fechar a seleção, a reprodução também para.

Os testes de navegador usam o Chrome instalado e a prévia ativa em `http://127.0.0.1:4182`. Essa porta pode ser ajustada em `playwright.config.ts` caso necessário. Scripts de atualização exigem internet; a navegação utiliza snapshots locais e assets empacotados.

## Estado e limitações

Desktop V4 aprovado. Adaptação responsiva mobile implementada após o pedido explícito para testar e corrigir até funcionar: navegação inferior, controles de toque, painel de detalhes recolhível, rolagem independente e layout específico para paisagem. A proposta mobile V1 permanece como histórico conceitual; as capturas `design/visual-first/mobile/executado-*.png` mostram a implementação real.

Esta é uma entrega parcial do escopo global: ainda faltam Ideb público agregado e conferência final de todos os critérios de aceite. A equivalência do snapshot SIM à extração final do Tabnet não foi confirmada. O build tem um aviso de tamanho do bundle 3D, carregado separadamente. Música foi removida por solicitação do usuário.

Mobile: testes Chrome com viewport e toque emulados em 320×568, 360×640, 390×844, 412×915, 844×390 e 768×1024. Testes exigem WebGL ativo, canvas com espaço utilizável após o painel, ausência de overflow da página, cinco indicadores, fontes, notícias, áudio por gesto e migração. Eventos de toque do navegador verificam rotação, pinça/zoom, reset, seleção de UF no próprio 3D, rolagem do painel e troca de orientação. Casos adicionais verificam fallback sem WebGL e movimento reduzido. Não houve teste em aparelho físico ou Safari/iOS; desempenho nesses aparelhos não foi medido. Execute `npx playwright test e2e/mobile.spec.ts` com a prévia ativa.

Sem login, backend de usuário, API paga ou domínio comprado. Hospedagem estática no GitHub Pages, com código público em [Gabrisado/fora-da-bolha](https://github.com/Gabrisado/fora-da-bolha).

Para verificar a publicação pelo navegador automatizado, execute `node scripts/verify-publication.mjs` (requer Chrome instalado). Esse teste acessa o endereço público, verifica recursos sem erro HTTP, WebGL, seleção, migração e layout mobile, e guarda capturas em `design/visual-first`.

Veja `LICENSES.md` e `docs/progress.md`.

## Painel editorial e atualização de notícias

O painel de 360 px se sobrepõe ao mapa em desktop e vira gaveta recolhível no celular. Exibe apenas estado, indicador e valor; detalhes, período, ranking, limitações e CSV estão em **Dados e fontes**.

Notícias: RSS estaduais do g1, Agência Brasil, API IBGE e Agência Senado. Até cinco itens por UF/tema na janela de 30 dias. Sem cobertura pertinente, o painel informa a ausência. Cartões mostram manchete, data e veículo; iniciais identificam fontes sem uso de logotipos não verificados. Não há resumos gerados por IA.

Fotos próprias do Senado e da Agência Brasil são baixadas somente com crédito explícito e permissão institucional registrada no item (`image.originalUrl`, `credit`, `permissionUrl`). Miniaturas WebP preservam o quadro e são carregadas sob demanda; fotos ausentes, de terceiros ou indisponíveis deixam a notícia textual. `public/news-media/` fica fora do histórico Git e é recriada no build. Políticas: https://www12.senado.leg.br/assessoria-de-imprensa/guia-para-jornalistas/lista-dos-servicos-da-secom e https://www.gov.br/pt-br/servicos/acessar-material-fotojornalistico-gratuitamente.

O workflow `Publicar Fora da bolha` executa a cada seis horas (e manualmente): recupera o último cache, coleta/valida notícias, prepara fotos autorizadas, testa, gera build e publica na mesma cadeia. Falha total da coleta bloqueia publicação agendada/manual, preservando o site anterior; falhas parciais mantêm itens válidos de fontes indisponíveis. Horários podem atrasar no GitHub; não é transmissão em tempo real. Artefato Pages retido por um dia; miniaturas antigas são removidas do cache. Não há requisição externa por clique.

Para reproduzir: `npm run update:news`, `npm run prepare:news`, `npm test`, `npm run build`. Para validar fotos e falhas no navegador: `npx playwright test e2e/panel.spec.ts`.

A seleção mantém até cinco manchetes recentes e reserva um cartão para a foto autorizada mais recente das últimas 24 horas, quando disponível; a ordem dos cartões permanece cronológica. Isso permite ilustrar a cobertura sem usar fotos de veículos cuja licença não foi confirmada.

## Revisão de prontidão — 27/10/2026

Resultado independente: **APPROVED WITH RESERVATIONS**, sem achados importantes abertos nos critérios auditados. Relatório em docs/reviews/2026-10-27-market-readiness.md. Interface mantém a marca aprovada; ano/fonte e limites da mortalidade são visíveis, há tabela27UFs e fonte migratória.

A triagem de notícias é automática e conservadora pelo assunto do título, exclui publicidade e revalida cache antigo. Não é curadoria manual ou classificação semântica infalível. Regressões cobrem os falsos positivos observados, e o frontend aplica a mesma proteção. Falhas locais/nacionais geram aviso de cobertura parcial sem apagar o cache válido. Sem comparação de fontes primárias refeita nesta rodada nem teste em aparelho físico/Safari/leitor de tela real.

## Animações e novos indicadores

Controles Melhor/Pior e3D/2D têm seleção deslizante; painel recolhe e expande também no desktop. No celular ele sobrepõe o mapa, sem reduzir sua área; toque fora fecha. Cada indicador exibe3representantes de cada extremo (desempate porUF somente para símbolos; classificação estatística preserva empates). São ilustrações, sem inferência de despejos reais ou potabilidade. Movimento reduzido mantém símbolos estáticos; animações pausam quando a aba fica oculta. Os temas Explorar e Migração mantêm suas próprias visualizações.

Atualize os dois novos snapshots com `node scripts/import-health-sanitation.mjs`. O importador valida27UFs e preserva o snapshot anterior se a coleta falhar. Testes específicos: `npx playwright test e2e/motion.spec.ts`. Capturas e revisão desta etapa em `design/review-2026-10-27` e `docs/reviews/2026-10-27-motion-contract.md`. Os relatórios anteriores de mortalidade são históricos e não descrevem o indicador Saúde atual.
