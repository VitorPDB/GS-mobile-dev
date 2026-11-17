# Conselho — Produto e Requisitos — reações v1.2, rodada 1

**Nota: 4,7/5 — aprovado no escopo de Produto e Requisitos.**

Pedido avaliado: adicionar likes e dislikes no feed, fazer as quantidades interferirem diretamente na porcentagem de confiança e apresentar a marca em maiúsculas como URIP. Candidato inspecionado: `work/reactions`, comparado ao escopo previamente aprovado.

## Aderência

| Pedido / requisito | Evidência | Avaliação |
|---|---|---|
| Likes e dislikes como ações do feed | `AlertRow.tsx`: coração e thumb-down, contadores, seleção, retirada/troca e envio pendente | Atendido |
| Quantidades interferem na confiança | `ReactionService.Feedback.confidence`: `(base × 4 + likes) / (4 + likes + dislikes)`; percentual recebido da API e renderizado | Atendido, não é contador decorativo |
| Explicar o resultado | Detalhe mostra base da fonte, confiança combinada, fórmula e janela de 24 h; README traz exemplos de 90→92 e 90→72 | Atendido |
| Marca URIP em maiúsculas | Duas assinaturas de marca no `App.tsx`, desktop e compacto, usam `URIP` | Atendido |
| Persistência e ausência de votos duplicados simples | UUID local, voto único por instalação/risco/bairro, PUT idempotente, troca e retirada; implementação em servidor/banco | Adequado ao protótipo; verificação técnica final pertence às outras áreas |
| Experiência em falha | Envio sem confirmação não é apresentado como sucesso; botões desabilitados offline/antigos; dados em cache continuam consultáveis | Atendido em implementação |
| Preservação do trabalho anterior | Feed creme/preto, filtros, gravidade, análise, fontes/confiança, panorama e histórico permanecem | Atendido |

## Clareza e limites

A janela de 24 horas por risco e bairro é uma escolha coerente para um feed que atualiza leituras a cada 12 segundos: os votos não desaparecem a cada atualização. O README declara o escopo dos votos e que eles não validam cada medição individual. A confiança comunitária não altera a gravidade física nem a ordenação por prioridade; isso preserva a interpretação do risco.

O projeto não promete uma pessoa verificada por voto. O identificador é pseudônimo, pode ser recriado, e a ausência de autenticação/antifraude está explícita. Não há promessa de acurácia ou probabilidade real. Esses limites são proporcionais à demonstração acadêmica e não bloqueiam o pedido atual.

## Evidência e restrições da avaliação

Revisei fontes da interface, hook de sincronização, serviço de reações e README. Não executei navegador ou backend nesta revisão e as capturas novas ainda estavam em geração. Portanto, esta aprovação não certifica o E2E em andamento, execução nativa Android, PostgreSQL/Docker nem qualidade operacional. A incorporação continua dependente das outras quatro notas e dos testes finais.

Não identifiquei bloqueador adicional de Produto. Recomendação sem bloqueio: na apresentação, demonstrar like, troca para dislike e retirada, mostrando a variação do percentual e a permanência da gravidade.
