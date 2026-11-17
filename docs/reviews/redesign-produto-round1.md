# Conselho — Produto e Requisitos — redesign URIP, rodada 1

Data: 16/11/2026. Escopo: alteração de interface do protótipo acadêmico aprovado, avaliada em `work/redesign`.

**Nota: 4,7/5. Aprovado no escopo de Produto e Requisitos.**

## Pedido do usuário

| Pedido | Evidência | Resultado |
|---|---|---|
| Branco/creme e preto, com tonalidades para distinguir a arquitetura | `theme.ts`, `DESIGN.md` e capturas desktop: branco, creme, pedra, tinta, separadores e áreas de leitura | Atendido |
| Feed do Instagram como exemplo | Coluna central, publicações por ocorrência, filtros circulares, navegação lateral e contexto na coluna direita | Atendido como referência de estrutura; mantém conteúdo e identidade próprios |
| Urban Risk Intelligence Platform, podendo abreviar | Assinatura `urip`, nome completo no topo e na navegação; app manifest atualizado | Atendido |
| Remover página de conexão | Navegação somente Feed/Atividade, sem formulário de endereço | Atendido |
| Preservar aplicação funcional | Hook mantém atualização automática, cache por servidor, estados offline e avisos; URL técnica por ambiente | Preservado por inspeção; comprovação de execução pertence a Qualidade |

## Requisitos acadêmicos preservados

Os três riscos continuam identificados com medida/unidade, bairro, fonte, confiança e gravidade textual. A análise é expansível e mostra a decomposição da pontuação. O feed permanece ordenado pela prioridade recebida da API. Atividade apresenta histórico com horário e origem. O painel amplo conserva um panorama dos riscos. Simulação e ausência de alertas oficiais são explícitas. A indisponibilidade mantém dados salvos e informa tentativa automática; a atualização manual continua disponível.

Remover a configuração de conexão da interface é compatível com o pedido. O README explica `EXPO_PUBLIC_API_URL`, o endereço do emulador, o IP de rede para Android real e a necessidade de reiniciar/exportar o Expo. Configurações legadas de endereço são ignoradas, evitando uma preferência invisível e antiga quebrar o novo fluxo.

## Evidência examinada

`PRODUCT.md`, `DESIGN.md`, `mobile/App.tsx`, `AlertRow.tsx`, `useMonitoring.ts`, `README.md`, e capturas `urip-desktop-feed.png` / `urip-desktop-analysis.png`. As capturas mostram o nome solicitado, a nova arquitetura monocromática, filtros, medidas e análise. Não executei o app ou os testes nesta revisão.

## Veredito e limites

Não há bloqueador adicional de Produto/Requisitos. A composição substitui a estrutura anterior de dashboard por uma referência de feed reconhecível, sem controles sociais sem função. A gravidade não depende de cor, de modo que a restrição monocromática preserva informação.

Aprovação limitada à aderência de produto desta alteração. Não certifica execução Android nativa, PostgreSQL/Docker, acessibilidade com leitor de tela ou E2E em andamento. Atualizar o registro do conselho e de validação com a rodada deste redesign antes de incorporar. Nomes internos de pasta/package/slug herdados não aparecem como marca principal e não constituem bloqueio.
