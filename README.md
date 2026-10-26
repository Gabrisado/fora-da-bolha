# Fora da bolha

Atlas editorial brasileiro em 3D, com indicadores por estado, fontes consultáveis e migração interna.

## Acessar o site

O endereço previsto no GitHub Pages é **https://gabrisado.github.io/fora-da-bolha/**. A disponibilidade depende da conclusão do workflow de publicação, visível na aba Actions do repositório.

Funciona em desktop e em layout mobile, sem cadastro. Permita WebGL para usar o mapa 3D; há alternativa 2D quando ele não estiver disponível. Os efeitos sonoros são opcionais e a música está desativada.

Dados e notícias são snapshots com datas e fontes visíveis. O site estático não coleta notícias sozinho: a rotina local deve gerar o cache, e uma nova publicação precisa enviar os arquivos atualizados. Não há serviço contínuo de coleta instalado no GitHub.

Comentários, sugestões e problemas podem ser registrados nas **Issues** do repositório, preferencialmente com navegador, tamanho da tela, passos e captura do problema. Consulte as limitações abaixo antes de interpretar os indicadores.

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
- Saúde: mortalidade geral bruta de 2024, substituindo mortalidade infantil por decisão do usuário. Óbitos não fetais por residência (SIM, CODMUNRES) ÷ população IBGE 2024 × 100.000, 27 UFs. Snapshot oficial DO24OPEN, sem afirmar equivalência à extração final do Tabnet. Estrutura etária afeta as taxas; menor valor não prova melhor assistência à saúde. Exportação em `public/data/mortality-2024.csv`, auditoria agregada em `mortality-2024-audit.json`.

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

A rotina de atualização funciona somente enquanto o processo estiver aberto. Ao falhar a consulta, as séries existentes são preservadas. Não existe serviço agendado instalado no computador.

Notícias são coletadas no início de `npm run update:watch` e a cada 6 horas; nunca há busca externa a cada clique no estado. A página relê o JSON local a cada minuto para receber o cache renovado. Não é um serviço de notícias em tempo real com o computador desligado: operação contínua exige hospedagem/agendamento futuro. Falhas preservam artigos anteriores ainda válidos; datas inválidas, futuras ou fora de 30 dias são rejeitadas. Metadados por fonte e cobertura por UF/tema ficam no `news.json`.

Trocar de estado interrompe imediatamente qualquer efeito. Se a nova UF estiver no grupo que ativa o efeito do indicador, ele reinicia do zero, inclusive em cliques rápidos; uma UF fora desse grupo fica em silêncio. Ao mudar de tema, desativar efeitos, ocultar a aba ou fechar a seleção, a reprodução também para.

Os testes de navegador usam o Chrome instalado e a prévia ativa em `http://127.0.0.1:4182`. Essa porta pode ser ajustada em `playwright.config.ts` caso necessário. Scripts de atualização exigem internet; a navegação utiliza snapshots locais e assets empacotados.

## Estado e limitações

Desktop V4 aprovado. Adaptação responsiva mobile implementada após o pedido explícito para testar e corrigir até funcionar: navegação inferior, controles de toque, painel de detalhes recolhível, rolagem independente e layout específico para paisagem. A proposta mobile V1 permanece como histórico conceitual; as capturas `design/visual-first/mobile/executado-*.png` mostram a implementação real.

Esta é uma entrega parcial do escopo global: ainda faltam Ideb público agregado e conferência final de todos os critérios de aceite. A equivalência do snapshot SIM à extração final do Tabnet não foi confirmada. O build tem um aviso de tamanho do bundle 3D, carregado separadamente. Música foi removida por solicitação do usuário.

Mobile: testes Chrome com viewport e toque emulados em 320×568, 360×640, 390×844, 412×915, 844×390 e 768×1024. Testes exigem WebGL ativo, canvas com espaço utilizável após o painel, ausência de overflow da página, quatro indicadores, fontes, notícias, áudio por gesto e migração. Eventos de toque do navegador verificam rotação, pinça/zoom, reset, seleção de UF no próprio 3D, rolagem do painel e troca de orientação. Casos adicionais verificam fallback sem WebGL e movimento reduzido. Não houve teste em aparelho físico ou Safari/iOS; desempenho nesses aparelhos não foi medido. Execute `npx playwright test e2e/mobile.spec.ts` com a prévia ativa.

Nenhum login, backend de usuário, API paga, conta, domínio ou hospedagem foi criado.

Veja `LICENSES.md` e `docs/progress.md`.
