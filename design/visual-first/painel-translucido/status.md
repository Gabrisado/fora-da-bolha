# Painel translúcido e notícias ilustradas

- Etapa: propostas visuais geradas e apresentadas; aguardando aprovação explícita das referências antes de implementar a interface.
- Autorização: usuário pediu implementar o plano que determina gerar propostas desktop/mobile e aprová-las antes do código. Nenhuma aprovação presumida.
- Desktop atual desta proposta: `desktop-v2.png`, gerador integrado imagegen; composição-alvo 1440×900. Derivada da captura real `../desktop/publicado.png`. Versão 2 remove os resumos dos cartões, ativa o ícone correto de Saúde e elimina o rótulo de escala específico de Salário.
- Mobile atual desta proposta: `mobile-v1.png`, gerador integrado imagegen; composição-alvo 390×844. Usa a captura real `../mobile/3d-toque-estado.png` e a proposta desktop como referências.
- Direção: painel grafite translúcido flutuante no desktop, gaveta inferior no mobile, indicador compacto, nome do estado uma vez no painel, notícias em cartões horizontais com foto opcional, manchete, data e identificação pequena do veículo. Grade neutra muito discreta abaixo dos contornos dos países.
- Fotos e manchetes das propostas são espaços/legendas de layout, não notícias reais. Não usar essas marcações no aplicativo final. A implementação deve substituir por registros verificados e fotos com uso autorizado; matéria sem foto autorizada permanece textual, conforme escolha do usuário.
- Geografia, relevo e distribuição das cores nas imagens geradas são conceituais. Manter geometrias oficiais e cálculos reais na implementação, sem reconstruí-los a partir do mockup.
- Decisões confirmadas na fase de planejamento: sobreposição sem reduzir a área do mapa; simplificação dos quatro indicadores; fotos ausentes sem substituta; atualização de notícias a cada seis horas no GitHub.
- Nesta etapa, nenhum arquivo de aplicativo, dados ou workflow foi alterado e nenhuma nova versão foi publicada. Alterações limitadas a estas referências visuais e ao registro de aprovação.

## Aprovação — 27/10/2026
Usuário: “aprovo desktop e mobile, implemente e publique tudo”. Desktop v2 e mobile v1 aprovados. Implementação e publicação autorizadas.

## Implementação e comparação
- Desktop 1440×900: desktop-executado.png. Mobile 390×844: mobile-executado.png. Foto real autorizada: noticia-foto-real.png.
- Conferência visual realizada; composição, painel compacto e hierarquia preservados. Geografia/cores seguem dados reais. Notícias e imagens dependem das fontes e licenças; não reproduzem os exemplos da proposta.
- 24 testes de lógica/dados e 21 cenários de navegador aprovados, incluindo seis viewports mobile, WebGL, toque/pinça, gaveta, falha de foto e áudio. Build de produção aprovado. Não houve teste em aparelho físico/Safari.
