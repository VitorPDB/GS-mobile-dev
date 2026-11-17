# Conselho — Análise e Privacidade — votos v1.2 — rodada 1

**Nota: 4,7/5 — aprovado para o protótipo acadêmico.**

## Escopo e evidências

Revisão independente das fontes do candidato `work/reactions`, especialmente ReactionService, ReactionRepository, Reaction, RiskAnalyzer, identidade local, useMonitoring, AlertRow, README e testes ReactionTest. Conferido `work/reactions-backend.log`: 9 testes, zero falhas/erros e BUILD SUCCESS. Não executei o E2E nem certifiquei Android nativo, Docker ou produção.

## Análise e significado

A fórmula `(base × 4 + likes) / (4 + likes + dislikes)` é uma média ponderada coerente com o pedido. Sem votos preserva a confiança base; adicionar like aumenta e adicionar dislike reduz o valor; os resultados permanecem em [0,1] para as bases e contagens válidas. Para sensor: 90% sem votos, 92% com um like e 72% com um dislike. As contagens são do servidor, não valores enviados pelo app.

A gravidade e a prioridade permanecem calculadas a partir de intensidade/tendência, sem serem suprimidas por rejeição comunitária. Isso é comprovado no teste com 100 dislikes mantendo Crítico e 90 pontos. A interface distingue base da fonte e confiança combinada, exibe fórmula, janela e afirma explicitamente que não se trata de probabilidade de ocorrência.

## Privacidade e retenção

UUID aleatório por instalação, sem nome/GPS/conta, é descrito como identificador pseudônimo e não como prova de identidade humana. Não é exposto nos dashboards públicos; o cabeçalho opcional só determina myVote. Cache separado por servidor e instalação evita transportar seleção de outra identidade. Se o identificador não puder ser persistido, não se permite votar com identidade efêmera.

Um registro por risco/bairro/UUID e versões otimistas sustentam troca/remoção/idempotência. A consulta exclui votos ao completar 24 horas; limpeza horária remove registros expirados. A promessa de retenção aproximada pressupõe serviço em operação, não uma garantia de eliminação enquanto o servidor estiver desligado.

## Limites e recomendações não bloqueadoras

O voto é sobre o acompanhamento do risco/bairro na janela de 24 horas e não valida uma leitura individual; isso está explícito na documentação e na explicação. A comunidade pode estar enviesada ou ser manipulada por múltiplas instalações/UUIDs. Não há antifraude/autenticação humana robusta, e o README reconhece esse limite e impede interpretar o número como acurácia validada. É adequado à demonstração acadêmica solicitada, sem certificação para decisões reais.

A porcentagem exibida é arredondada; em volumes altos uma mudança pequena pode alterar o valor interno sem mudar o inteiro na tela. Não é bloqueador: contadores e fórmula continuam permitindo interpretar o cálculo.

## Veredito

Aprovado na área de Análise e Privacidade, **4,7/5**. Nenhum bloqueador material encontrado neste escopo. Demais avaliações e execução ponta a ponta pertencem aos outros membros do conselho.
