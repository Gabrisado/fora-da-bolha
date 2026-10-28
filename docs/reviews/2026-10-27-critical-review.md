# Revisão crítica independente — Fora da bolha
Data: 27/10/2026. Escopo: revisão, sem corrigir código ou publicar.

## Veredito: REJECTED
Aprovação de prontidão pendente de três achados importantes. O veredito não significa falha completa do produto; aplica a exigência da skill de não aprovar com problemas importantes abertos.

## Cobertura e evidência fresca
- Crítico independente sem histórico da autoria, contrato de somente leitura.
- npm test -- --reporter=dot: 8 arquivos, 24 testes aprovados (executado pelo crítico nesta revisão).
- 27 UFs únicas em cada indicador; migração: 702 pares, 27 totais e soma dos saldos igual a zero.
- Inspeção IAB da prévia atual: migração, Saúde/Amazonas, metodologia, Educação/São Paulo; viewport original 922×891 e mobile 390×844, restaurado ao final.
- Capturas atuais: design/review-2026-10-27/01-migracao-desktop.png, 02-saude-desktop.png, 03-saude-mobile.png e 04-noticias-educacao.png.
- Não verificados: exatidão numérica contra cada fonte externa atual, leitor de tela real, aparelho físico, Safari/iOS ou equivalência da publicação com a prévia neste ciclo. Sem alegação de conformidade integral de acessibilidade.

## Achados abertos
### IMPORTANT — CR-01: contexto estatístico fora da leitura principal
Evidência: src/App.tsx:39,41,45,51. Ano e ressalva etária estão apenas em Dados e fontes. Saúde usa Melhor/Pior com mortalidade bruta; o próprio método informa que menor taxa não prova melhor assistência.
Impacto: leitura pode atribuir qualidade da saúde a diferenças de idade populacional; períodos 2024/2025 não são visíveis durante comparação.
Correção delimitada: ano em texto pequeno junto ao indicador, nota curta de ausência de ajuste por idade e rótulos Menor/Maior mortalidade em Saúde.
Fechamento: screenshots desktop/mobile e teclado demonstrando contexto sem abrir diálogo, com cálculos preservados.
Decisão: manter aberto; correção altera conteúdo visível e será proposta ao usuário.

### IMPORTANT — CR-02: classificação de notícias e publicidade
Evidência: public/data/news.json:1; scripts/news-lib.mjs:5–16; scripts/collect-news.mjs:34; src/NewsCard.tsx:3. Obituário de Camila Kfouri classificado em Saúde/Segurança/Educação; vaquejada no AM em Educação; anúncios de vinícola e show de Roberto Carlos em Salário. URLs de anúncios contêm /especial-publicitario/. Confirmados no DOM os resultados de Educação/SP e AM.
Impacto: notícias irrelevantes e propaganda editorialmente indistinta reduzem confiança e violam pertinência temática.
Correção delimitada: excluir URLs publicitárias, classificar pelo assunto central, limpar/revalidar cache e adicionar casos negativos como testes. Manter vazio quando não houver cobertura.
Fechamento: novo cache sem exemplos falsos/publicidade e inspeção dos cinco cartões em amostra de estados/temas.
Decisão: manter aberto; recomendação prioritária.

### IMPORTANT — UX-01: título e seletor colidem em largura intermediária
Evidência fresca: 02-saude-desktop.png, 922×891. .map-top começa em x476 com largura419; Saúde do Brasil quebra em três linhas e invade o seletor. src/styles.css usa left400 para painel aberto antes do breakpoint mobile900.
Impacto: leitura e seleção ficam comprometidas em janela estreita desktop/tablet.
Correção delimitada: reorganizar controles e título antes desse breakpoint, evitando coordenadas verticais fixas conflitantes; preservar painel sobreposto.
Fechamento: abrir painel nos quatro indicadores em 901,922,1024 e1280 px; caixas de título/controles/seletor sem interseção.
Decisão: manter aberto; correção de responsividade recomendada.

### MINOR — CR-03: fonte migratória sem link na metodologia
Evidência: migration.sourceUrl existe em public/data/migration.json; src/App.tsx:51 renderiza somente a nota.
Correção: expor link SIDRA10159 e período no diálogo. Verificação: link acessível e correto por teclado.
Decisão: manter aberto.

### MINOR — CR-04: falha parcial de fontes oculta
Evidência: collect-news.mjs registra sourceStatus, mas App.tsx mostra apenas updatedAt global, renovado se uma fonte responder.
Impacto: timestamp recente pode esconder falha prolongada de uma fonte estadual.
Correção: aviso curto de cobertura parcial baseado na fonte da UF, preservando cache.
Verificação: fixture com fonte estadual indisponível e outra atualizada mostra estado degradado.
Decisão: manter aberto.

## Melhorias opcionais
- Alternativa tabular dos valores ordenados: facilita leitura exata e comparação sem depender do relevo ou das cores.
- Dar mais espaço ao mapa em mobile quando a gaveta abre, preservando seus controles e rolagem.
- Pequeno contexto como média nacional, desde que o valor seja calculado pela agregação adequada e documentado; não usar média simples das taxas por UF.
Essas sugestões não bloqueiam aprovação e não autorizam ampliação de escopo.

## Próxima ação
Corrigir primeiro CR-02, depois CR-01 e UX-01. Reexecutar testes e revisão dos trechos alterados. Nenhuma correção foi realizada nesta auditoria.
