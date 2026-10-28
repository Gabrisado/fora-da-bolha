# Revisão final — mapa maior, transições e GLBs aprovados

## Veredito independente
APPROVED WITH RESERVATIONS, ciclo3/3, sem BLOCKER/IMPORTANT aberto. Revisores novos e sem histórico, trabalho somente leitura. C1: paridade2D (tamanho/presença) corrigida. C2: reversãoCSS encurtava retorno para119ms; substituída por interpolação explícita desde fill exibido. C3: correção validada, retorno medido677,4ms, contra alvo650ms.

## Checks finais executados em27/10/2026
- `npm test -- --maxWorkers=2`:36/36,17arquivos, última execução6,16s.
- `npx playwright test --reporter=line`:44/44,2,4min, após AnimatedStatePath final.
- `npm run build`: passou11,42s. Avisos de chunks: principal508,79KB e3D1015,42KB, gzip165,22/282,09KB.
- `node scripts/verify-polish-publication.mjs http://127.0.0.1:4183/`: passou no build compilado em1440×900 e390×844. SeteGLBs locais, WebGL, cabeçalho, estágio, painel,2D, zero errosJS e zero requisições externas. Blob da mesma origem não é requisição externa.
- `npm audit --omit=dev`:0 vulnerabilidades.
- `git diff --check`: sem erro.

## Critérios cobertos
Referências mobileV1 e prancha realV2 aprovadas pelo usuário. CabeçalhoUF+3D2D em uma linha até320px; canvas até navegação inferior, reset/legenda dentro. Painel não altera retângulo do canvas. Navegação Motion horizontal/vertical; alturas/cores650ms desde posição exibida e interrupções; presença250ms e movimento reduzido. Seleção sob símbolos, câmera, gestos, áudio, notícias, dados e migração cobertos pela regressão. Fallback deGLB não derruba mapa, informa limitação e permite2D.

SeteGLBs reais aprovados,408668bytes, cada um abaixo500KB e10mil triângulos; escala/orientação/materiais normalizados. CC0 para seis modelos, gota de moriartyCCBY3.0 com fonte/licença/alterações. Manifesto público e LICENSES.md documentam tudo. Carregamento por tema, geometrias compartilhadas, sem embeds. Símbolos ancorados na altura interpolada e tamanho limitado por pixels.

## Evidência visual e desempenho
`design/visual-first/polish-v2`: referência, prancha, capturas desktop/mobile5temas, quadros início/meio/fim, três tamanhos de aceite e medições. Em390×844 o canvas ocupa560,4px de altura e termina junto ao rodapé. Runtime Chrome do host: mediana10ms/P95~11ms,127drawcalls, sem erros; isso não representa aparelho físico. Reversão2D medida677,4ms em interrupted2d-measurement.json.

## Ressalvas
Não houve Safari/iOS ou aparelho físico. Bundles3D e Motion podem carregar mais lentamente em rede limitada. Nenhuma falha funcional demonstrada; não se afirma perfeição. A referência conceitual tem materiais ilustrativos; os assets reais aprovados são a referência dos objetos.

## Publicação
Gate local fechado. Publicar esta versão e executar scripts/verify-polish-publication.mjs contra URL pública antes de declarar a publicação conferida.
