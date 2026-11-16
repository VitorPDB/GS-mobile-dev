# Conselho — Análise e Privacidade — rodada 2

Nota: **4,7 / 5 — aprovado na área de Análise e Privacidade**.

Reavaliação dos dois bloqueadores da rodada 1, com leitura do código e do log `work/backend-validation.log`.

1. **Resolvido:** `RiskAnalyzer` mantém `baseScore` e envia decomposição textual explícita, por exemplo `90 de base + 5 por elevação = 95/100`. O app exibe esse campo na explicação do alerta. O teste verifica a presença dessa decomposição.
2. **Resolvido:** comparação exata entre Duration e Duration.ofMinutes(30). Testes verificam que 1800 segundos permitem tendência e 1801 segundos não permitem, sem o acréscimo de 5 pontos.

Evidência: log da nova execução registra 4 testes, zero falhas, zero erros e zero testes ignorados. O log também registra falha posterior no empacotamento por impossibilidade de renomear o JAR; isso foi comunicado ao coordenador e não constitui aprovação do build global. A nota cobre a área de análise/privacidade.

Permanecem as limitações não bloqueadoras documentadas na rodada 1: dados/fatores/limiares simulados; confiança por categoria, não acurácia; sem fusão de fontes; política de último registro por bairro/risco; janela de 1000 leituras. Adequadas ao protótipo acadêmico, sem alegar validade operacional real.

Condição de incorporação global: os outros quatro membros também devem atingir 4,5 e a verificação final de execução/empacotamento precisa passar.
