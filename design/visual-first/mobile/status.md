# Fora da bolha · Mobile

- Etapa: implementação responsiva testada em 26/10/2026, após o pedido explícito “faça o teste para mobile, com o 3d e so de como concluido quando estiver funcional e responsivo”. Esse pedido autorizou as correções da interface existente; não é registrado como aprovação da imagem conceitual V1.
- Referência: folha-da-bolha-mobile-v1.png.
- Composição pretendida: 390 × 844; imagem retornada preservada sem distorção.
- Geração: imagegen integrado, com desktop V4 como referência.
- Prompt: adaptar editorial grafite, mapa Brasil 3D com contornos dos vizinhos, masthead, controles Melhor/Pior e 3D/2D, painel estadual em gaveta inferior e navegação inferior somente ícones; sem valores inventados ou rodapé explicativo.
- Dados, alturas e geografia são conceituais; implementação usará as fontes oficiais.
- Desktop segue V4 aprovada. A imagem V1 permanece histórica; nenhuma aprovação dessa imagem foi presumida.

## Implementação verificada

- Navegação inferior por ícones; cabeçalho compacto; fontes e áudio acessíveis por ícones rotulados.
- Gaveta de detalhes inferior, recolhível, com cabeçalho fixo e rolagem independente. Em paisagem, painel à direita. Mapa se reenquadra no espaço restante.
- Arrastar gira, pinça altera zoom e toque em UF seleciona. Arraste não dispara seleção acidental. Reset restaura câmera, que mantém horizonte e limites.
- WebGL ativo em 320×568, 360×640, 390×844, 412×915, 844×390 e 768×1024. Ausência de overflow da página e controles/painel dentro da viewport.
- Saúde, Segurança, Educação, Salário, Migração, notícias, fontes, áudio por toque e controles de painel executados nos seis tamanhos.
- Fallback 2D em ausência simulada de WebGL; movimento reduzido preserva rotas com aviões estáticos.
- Resultado: 9 cenários mobile passaram; regressão completa com 18 cenários de navegador, 19 testes de lógica/dados e build aprovado. Aviso de tamanho do bundle 3D permanece.
- Evidências reais: `executado-320x568.png`, `executado-360x640.png`, `executado-390x844.png`, `executado-412x915.png`, `executado-844x390.png`, `executado-768x1024.png`, `3d-toque-estado.png`.
- Limite: Chrome com viewport/toque emulados em desktop. Nenhum teste em aparelho físico, Safari/iOS ou medição de desempenho nesses aparelhos foi realizado.
