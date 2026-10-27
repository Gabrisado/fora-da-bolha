# Folha da Bolha · Execução do plano aprovado

## Referência
Desktop V4 aprovado pelo usuário: “otimo, pode iniciar”. Plano aprovado na conversa; escopo integral preservado. Mobile aguarda proposta e aprovação próprias.

## Decisões de execução
- Projeto novo fora de qualquer repositório Git: isolamento pela pasta explicitamente autorizada, sem worktree de outro projeto, commits ou publicação remota.
- Executar diretamente nesta sessão com testes de lógica e navegador; revisão final separada quando os módulos estiverem concluídos.
- Somente dados oficiais verificáveis; série não coletada é indisponível, nunca simulada.
- Dados e notícias normalizados em snapshots locais. UI não depende de endpoints externos durante a navegação.

## Andamento
- [x] Proposta desktop V4 aprovada e preservada.
- [ ] Fontes e coleta de quatro indicadores + matriz migratória.
- [ ] Testes de lógica em ciclo vermelho/verde.
- [ ] Mapa desktop 3D/2D, painel e controles.
- [ ] Notícias, áudio e atualização.
- [ ] Proposta e aprovação mobile.
- [ ] Testes reais e revisão.

## Evidências da primeira etapa
- Malha 27 UFs, contornos Natural Earth e 27 bandeiras MIT empacotados.
- PNAD 2025 anual e Ipea 2024 com 27 observações por série.
- SIDRA 10159: 702 pares, 4.656.514 pessoas com origem conhecida, entradas/saídas reconciliadas. Símbolo `-` tratado como zero absoluto; `...`, `..` e `X` rejeitados. Autorrotas excluídas.
- 28 combinações notícia/UF/tema na primeira coleta de g1 + Agência Brasil; cobertura variável, não 28 notícias necessariamente distintas.
- Testes: 9 unitários/snapshots e 2 cenários Chrome passaram. Build passou, com aviso de chunk 3D maior que 500 kB.
- Prévia ativa em 127.0.0.1:4182; portas 4180/4181 ocupadas/inacessíveis no primeiro teste, sem encerrar processos alheios.
- Captura desktop 1440×900 inspecionada: composição próxima à V4, geografia real mais detalhada; valores e relevo já reais para rendimento. Grid mais visível que a proposta; polimento pendente.
- Saúde não coletada. Arquivo Ideb 2025 por UF baixado e inspecionado: rede Estadual, Privada e Total; não substituir Pública por Estadual sem distinguir o conceito. Indicador público segue indisponível.
- Mobile V1 gerada, aguarda aprovação. Layout mobile ainda não implementado.
- Navegador integrado do Codex acionou o fallback 2D por indisponibilidade de WebGL; Chrome instalado executou os cenários e a captura 3D. Diferença de ambiente informada, sem simular 3D onde não está disponível.
- Execução não concluída; nenhuma publicação realizada.
- Revisão independente desta etapa: corrigido reconhecimento Unicode de nomes de UFs nos feeds. Teste específico falhou antes da correção e passou após; suíte final com 10 testes.

## Correções solicitadas — 26/10/2026

- Áudio anterior era um acorde constante e efeitos senoidais. Substituído por News Theme (Kevin MacLeod, CC BY 4.0) e arquivos CC0 editados: hospital em três camadas (ambiente, carrinho e monitor), disparo realista de foley, sino escolar e caixa registradora. Sem osciladores na reprodução. Arquivos locais, créditos/hashes e reconstrução documentados.
- Volumes separados, amostras explícitas, parada manual, música atenuada durante efeito, sem sobreposição, limite de frequência e silêncio ao ocultar a aba. Aviso sobre disparo antes da ativação. Fechamento do menu ao clicar fora/Escape.
- Bandeiras SVG rasterizadas para CanvasTexture no 3D; preenchimento corrigido no SVG 2D. Pará vermelho/branco/azul conferido em capturas nos dois modos.
- Causa das rotas ausentes: orientação dos anéis oficiais era interpretada pelo D3 como complemento esférico. Centro do Pará estava em x=15,09 (fora da UF), agora x=0,259. Projeção planar consistente com o mapa 3D; teste das 27 UFs falhou antes e passou após a correção. Rotas 2D adicionadas, entradas/saídas/saldo exibidos; capturas 3D e 2D conferidas.
- Removido aviso falso de falha WebGL ao alternar intencionalmente para 2D: listener de perda de contexto tem cleanup.
- Educação: extração reproduzível do Ideb estadual 2025, 27 valores. Cabeçalho, nota e fonte explicitam a rede estadual; não passa por toda a rede pública. Snapshot preservado pela rotina geral. Agregado público permanece pendente.
- Segurança não apresentou falha de dados na reprodução; seleção, valor de PA (27,28), filtros e fontes passaram na conferência.
- Verificação executada: 11 testes Vitest, 5 cenários Chrome, TypeScript e build de produção passaram. Os cinco arquivos finais decodificaram com duração e amplitude não nulas; música reproduziu e avançou no Chrome e no navegador integrado. Limite: análise técnica de reprodução não equivale a uma avaliação subjetiva de mixagem por ouvinte. Build mantém aviso de chunk 3D acima de 500 kB.
- Evidências em `design/visual-first/desktop/para-bandeira-corrigida.png`, `migracao-corrigida.png`, `para-2d-corrigido.png`. Prévia 4182 atualizada, áudio deixado desligado para avaliação voluntária.
- Saúde (dados), agregado Ideb público e layout mobile continuam pendentes; não foram declarados concluídos nesta correção.

## Revisão seguinte — sem música e mortalidade geral

- Usuário pediu retirar música, aprovou os demais efeitos e solicitou disparos por alguns segundos com moto/corte de giro. Trilha, controles e código de reprodução de música removidos. Fonte da faixa anterior retirada da entrega; efeitos continuam voluntários.
- Segurança substituída por cena CC0 de 8 segundos: BurstFire (SuperPhat, foley em Ableton) + Sportsbike Flyby (richwise, gravação de moto em pista com limitador). Fonte não é gravação de crime. Restantes receitas mantidas. Sem sobreposição de efeitos.
- Usuário escolheu explicitamente “Substituir por mortalidade geral”. Indicador Saúde agora usa SIM 2024 por residência e população IBGE 2024 (SIDRA 6579/9324), com fórmula óbitos/população×100.000. 27 UFs, 1.532.015 óbitos residentes não fetais, denominador nacional somado 212.583.750 pessoas.
- Tabnet informou dados finais até 2024 e extração 02/12/2025, mas POST da tabela falhou por conexão. Fallback utilizado: ZIP DO24OPEN de recurso oficial do portal de dados abertos. **Não confirmada equivalência desse snapshot à extração final do Tabnet**; nota explícita no site, CSV auditável e README. Não misturamos dados de 2023 com população 2024 nem usamos 2025/2026.
- Agregação Python em streaming: valida TIPOBITO=2, ano do óbito e prefixo municipal de residência. Publica apenas totais; microdados locais em data/raw ignorados no Git. SHA-256 do ZIP registrado na auditoria. Numeradores, denominadores, fonte SIM, fonte IBGE e tabela das 27 UFs disponíveis no painel.
- Taxa bruta não ajustada por idade; nota explica que menor taxa não prova melhor assistência. Não há causalidade deduzida de manchetes. Mortalidade infantil foi substituída, não combinada.
- Saldos migratórios fornecidos pelo usuário coincidem com a matriz já validada. Mantida matriz completa e todas as 27 UFs, sem reconstruir rotas a partir de saldos isolados.
- Verificação: 13 testes de lógica/dados passaram, 5 cenários Chrome passaram, build passou (mesmo aviso de chunk 3D). Quatro efeitos decodificados e reproduzidos; Segurança tem 8 s. Capturas `mortalidade-geral.png` e `efeitos-sem-musica.png`. Conferência auditiva subjetiva fica para o usuário.
- Pendências gerais remanescentes: agregado Ideb público (recorte atual é estadual), layout mobile e aceite global do projeto.

## Troca de estado, migração nacional e notícias — 26/10/2026

- Seleção interrompe o áudio de forma síncrona, antes de atualizar a UF. Nova UF elegível reinicia do zero e ignora o cooldown de 3 s; UF não elegível fica sem áudio. Troca de tema, fechamento do painel, limpeza do seletor, desativação dos efeitos e aba oculta param a reprodução. Teste reproduziu falha anterior e passou após a alteração, incluindo AP→BA→SP rapidamente.
- Migração agora mantém rotas nacionais independentes da seleção. Recorte somente de pares reais da matriz: origem com saldo negativo, destino com saldo positivo; maior fluxo elegível por origem, mais os necessários para cobrir destinos ainda ausentes, sem duplicatas. Todas as 27 UFs têm pelo menos uma rota. 9 UFs com saldo positivo e 18 com negativo; médias por grupo exibidas (não média de todos os fluxos e não projeção anual).
- Mapa usa cores distintas para o sinal do saldo, sem dizer bom/ruim. Aviões 3D e SVG 2D percorrem as rotas; movimento reduzido deixa aviões estáticos. Clicar não cria, muda ou reinicia rotas: apenas seleção/contorno e painel de entradas, saídas e saldo. Removidos controle Entradas/Saídas e lista de cinco rotas dependentes do clique. Recorte e caráter ilustrativo dos aviões identificados.
- Notícias: 30 fontes verificadas (27 feeds estaduais do g1, g1 nacional, Agência Brasil e API pública Agência IBGE Notícias), sem chave. Coleta com concorrência limitada a 4, timeout, cache por UF/tema/link, deduplicação de manchetes e URLs, checagem de canal e geografia da URL, janela de 30 dias. Usa título, subtítulo e primeiro parágrafo do feed para pertinência, sem publicar corpo ou imagens.
- Conferência detectou tabelas eleitorais que citavam escolas e falsamente entravam em Educação. Excluídas, com teste específico. Cache antigo geograficamente incorreto limpo. Última coleta: 30/30 fontes responderam e 98 combinações UF/tema/link válidas; cobertura incompleta em algumas categorias é explicitada, sem preencher com matérias genéricas de outro estado.
- Rotina existente coleta a cada 6 h enquanto ativa; frontend relê o snapshot local a cada minuto. Não há requisição externa por clique, backend hospedado, chave paga nem serviço continuamente ativo com a máquina desligada. Falhas mantêm cache válido e registram status por fonte.
- Verificação executada: 18 testes unitários/dados, 8 cenários Chrome, build de produção e inspeção no navegador integrado. Build mantém aviso de bundle 3D maior que 500 kB. Capturas: `migracao-nacional.png` (2D), `migracao-corrigida.png` (3D), `noticias-estaduais.png`.

## Nome e gradiente de Salário

- Nome público alterado para “Fora da bolha” no cabeçalho, título da aba, descrição, carregamento, erro, metodologia e README. Caminho do projeto preservado para manter a prévia em execução.
- Salário passa a distribuir as cores pela posição relativa entre rendimentos distintos, evitando compressão causada pelo DF. Alturas, valores e ranking continuam com os dados originais; cores não indicam intervalos monetários iguais. Empates mantêm a mesma cor. Legenda e metodologia atualizadas; demais indicadores preservam escala linear.
- Teste com valor extremo falhou antes e passou após a alteração. Suíte de 19 testes unitários passou; três cenários do navegador (incluindo nome e cores de SP/SC) passaram. Captura `fora-da-bolha-salario.png` inspecionada; build aprovado com o aviso de tamanho do chunk 3D já conhecido.

## Validação e correção mobile com 3D

- Pedido explícito autorizou corrigir até funcionar e ficar responsivo. Testes iniciais falharam: painel fora da largura do celular, mapa comprimido e conteúdo ultrapassando viewport em paisagem.
- Layout até 900 px: cabeçalho compacto, navegação inferior com alvos de 44 px, fontes e áudio por ícones rotulados, controles de mapa e seletor dentro da tela. Detalhes em gaveta inferior recolhível, com rolagem própria e cabeçalho fixo; em paisagem, painel lateral. Em telas baixas, a divisão reserva espaço utilizável para mapa e painel.
- Enquadramento e limites de zoom agora dependem do espaço real do canvas, inclusive após abrir/recolher painel e trocar orientação. Testes aguardam ResizeObserver e quadros renderizados antes da captura. Pinça e arraste alteram câmera de fato; toque seleciona a UF no modelo, e arraste não gera seleção indevida.
- Resumo migratório recolhido por padrão no mobile, aberto pelo botão Resumo, para não cobrir o Brasil. Migração 3D permanece nacional. Texturas e densidade de renderização reduzidas em dispositivos com ponteiro de toque para limitar uso de recursos, sem medição de FPS em hardware físico.
- Verificado WebGL real no Chrome emulado em seis tamanhos: 320×568, 360×640, 390×844, 412×915, 844×390 e 768×1024. Testes cobrem os quatro indicadores, seleção, fontes, notícias, áudio por toque, painel, migração, rolagem, orientação e ausência de overflow. Casos adicionais de fallback sem WebGL e movimento reduzido.
- Resultado final executado: 19 testes de lógica/dados, 18 cenários de navegador (9 mobile e 9 desktop) e build de produção passaram. Capturas mobile inspecionadas, inclusive mapa inteiro acima da gaveta. Build mantém o aviso anterior de chunk 3D acima de 500 kB.
- Conclusão desta etapa: interface mobile funcional e responsiva nos ambientes testados. Não houve teste em telefone físico ou Safari/iOS, nem garantia de desempenho em todos os aparelhos. Pendências globais de dados (Ideb público agregado e equivalência do snapshot SIM ao Tabnet final) não foram alteradas nem declaradas resolvidas.

## Publicação autorizada no GitHub — 26/10/2026

- Pedido do usuário para publicar na conta Gabrisado autoriza repositório público e link acessível por qualquer pessoa. Conta existente autenticada pelo GitHub CLI; o conector estava em outra conta e não oferece criação de repositório/Pages, por isso foi usado o CLI.
- Repositório: https://github.com/Gabrisado/fora-da-bolha. Site HTTPS: https://gabrisado.github.io/fora-da-bolha/. Issues habilitadas para relatos e sugestões; homepage do repositório aponta ao site.
- Primeiro commit cda7879 enviado a main. GitHub Actions executou instalação, 19 testes de lógica/dados, build e deploy com sucesso: https://github.com/Gabrisado/fora-da-bolha/actions/runs/40397643890. Workflow automático a cada push em main, sem credenciais no código.
- Publicação contém apenas build estático. Node_modules, dist local, segredos/variáveis, microdados data/raw e arquivos temporários ignorados no Git; dados públicos normalizados, fontes, créditos, scripts, testes e documentação enviados. Não há atualização contínua dos snapshots no servidor: coleta requer execução e nova publicação.
- Verificação do endereço público por Chrome: HTTP 200, sem recursos com erro HTTP ou exceções de página, WebGL ativo em desktop 1440×900 e mobile 390×844 com toque emulado. Seleção/rendimento, rotas e totais de migração, JSON com 702 pares e ausência de overflow conferidos. Script reproduzível em scripts/verify-publication.mjs.
- Capturas públicas em design/visual-first/desktop/publicado.png e design/visual-first/mobile/publicado-390x844.png. Limites de dados e de teste em aparelho físico continuam documentados.

## Ajuste de áudio e cursor — 26/10/2026
- Efeitos automáticos em volume fixo de 32%; removidos controles de desligar, parar manualmente e zerar volume. Sem música. O navegador continua controlando a permissão de reprodução.
- Tooltip do estado acompanha o cursor à esquerda em 3D e 2D, com proteção nas bordas e sem interceptar cliques; toque não abre tooltip.
- A proposta do painel translúcido permanece aguardando aprovação e não foi implementada nesta alteração.
- Verificação executada: build de produção, 19 testes de lógica/dados e 19 cenários de navegador aprovados, incluindo seis tamanhos mobile, gestos e interrupção imediata do áudio.

## Painel editorial aprovado — 27/10/2026
- Aprovação explícita de desktop v2 e mobile v1 registrada. Painel flutuante de 360 px, fundo 82%, blur, sem reduzir canvas; nome único, indicador curto e valor. Detalhes mantidos em Dados e fontes. Mobile mantém gaveta e WebGL.
- Grade neutra em 8%, abaixo dos contornos e sem depthWrite. Áudio e tooltip preservados.
- RSS Senado adicionado; leitura de HTML RSS aninhado corrigida; classificação versionada. Cartões horizontais, data, iniciais/nome de veículo; nenhuma imagem genérica. Fotos próprias de Senado/EBC exigem crédito e política de uso. Uma miniatura real da Agência Brasil preparada e decodificada em navegador, crédito Joédson Alves/Agência Brasil. Fotos binárias fora do Git, WebP proporcional sem corte.
- Agendamento GitHub de seis em seis horas com cache validado, limpeza de miniaturas antigas, coleta/build/deploy na mesma cadeia e execução manual. Falha total simulada preservou news.json byte a byte.
- Evidências desktop 1440×900 e mobile 390×844 em design/visual-first/painel-translucido; comparadas às propostas. Diferenças: geometria/cor seguem dados reais, manchetes e fotos dependem da cobertura autorizada; textos não imitam placeholders da proposta.
- Validação final: 24 testes de lógica/dados, 21 cenários de navegador e build aprovados. Teste de falha total de 31 fontes preservou snapshot byte a byte. Foto real local decodificada em Chrome. Não testado em aparelho físico ou Safari/iOS.
