# Fora da bolha — contrato de movimento e novos indicadores

## Revisão prévia incorporada
A crítica de proposta apontou P1 dados, P2 migração completa da saúde, P3 ciclo de animações. Não é aprovação da implementação.

## Dados congelados
- Saúde: expectativa de vida ao nascer e0_T, ambos os sexos, ano2024, planilha4)INDICADORES da revisão2024 das Projeções da População/IBGE. Snapshot modelado explicitamente rotulado, não previsão individual. ValorBrasil76,61 diretamente publicado. Fonte e hash em public/data/health-sanitation-audit.json. Nunca calcular média das UFs.
- Saneamento: percentual de moradores em domicílios particulares permanentes ocupados com rede geral, rede pluvial ou fossa ligada à rede. Censo2022, SIDRA7555 variável1000382; filtros11558=46290,58=95253,86=95251; 27UFs,0–100%. Maior cobertura é melhor. Não mede tratamento nem potabilidade. Rótulo preciso de cobertura de esgoto, embora a aba seja Saneamento básico.
- P1: snapshots validados27UFs únicas, valores finitos e faixas válidas; hashes e URLs arquivados; CSV dos mesmos valores. Amostras conferidas na planilha/API: DF79,75anos; SC78,27; RR74,35. Esgoto SP90,77%; DF84,72%; AP10,95%.
- P2: remover títulos, avisos, controles invertidos, cálculos óbitos/população, média nacional e download de mortalidade da tela Saúde; preservar CSV antigo como histórico fora do indicador atual. Fontes/metodologia/tabela/downloads/testes passam a vida ao nascer.

## Movimento e interação
- Transição entre temas: texto/painel por tema com fade/deslocamento curto, mapa e câmera persistem. Cores e altura interpoladas; tema vigente sempre tem precedência.
- Painel anima entrada/saída e altura ao recolher/expandir. Fechamento aguarda a saída; conteúdo saindo fica inert, aria-hidden e sem pointer events. Reabrir cancela o fechamento anterior. Ao fechar, foco volta ao seletor; desmontagem limpa timer.
- Mobile: abrir/recolher/fechar nunca altera retângulo/zoom do mapa; toque fora fecha. Testar abertura→fechamento→reabertura rápida.
- Ambos os controles segmentados têm thumb móvel e aria-pressed preservado. Melhor:seta verde; Pior:vermelha; borda e seleção azulneutro. 3D/2D não recebem julgamento de bom/ruim.
- Movimento reduzido remove interpolação/animação contínua; aba oculta congela efeitos. Transições breves não disparam áudio.

## Símbolos3D
- Exatamente3melhores e3piores representantes por indicador, quando houver pelo menos6UFs válidas; empates de valores mantêm rankingestatístico e desempateUF só escolhe representantes. Mesmos marcadores em Melhor/Pior, pois o modo muda relevo, não classificação.
- Esgoto: melhores gotaazul; piores canocurvo com fluxo verde estilizado. Vida: coração luminoso/traço cardíaco discreto. Segurança: escudo/alerta. Educação: livro/lápis. Salário: moedas/carteira. Explorar é neutro; Migração mantém aviões sem ranquear saldo.
- Tamanho limitado, ancorado no centro da UF e acima de sua altura animada; pode sobrepor território vizinho em UF pequena conforme pedido. Nenhum efeito capta clique ou altera geografia. Fallback2D mostra símbolos estáticos correspondentes. Descrição acessível dos6destaques. Aviso explícito: símbolos ilustrativos, não despejos/fluxos reais nem qualidade da água.
- Testes: classificação/direção/empates/ausências; fontes27UF; erros de tema/rasters; navegação rápida; animações; posição de marcadores; seminterceptação; 3D/2D/mobile/teclado/movimentoreduzido; build e nova crítica independente antes de publicar.
