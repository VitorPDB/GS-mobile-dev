# Conselho — Análise e Privacidade — rodada 1

Nota: **4,4 / 5 — reprovado para incorporação nesta rodada**.

Escopo: protótipo acadêmico com três riscos simulados. Revisão estática independente de RiskAnalyzer, MonitoringService, SourceType, API de ingestão, cliente/cache mobile, AlertRow, testes e README. Não executei testes nesta revisão; o resultado de build informado pelo coordenador não substitui evidência lida por mim.

## Acertos

- Os três riscos têm medidas e faixas claras. Não se afirma haver modelo treinado, previsão validada ou dados oficiais.
- Confiança é atribuída no servidor (90/80/55%) e mostrada separada da gravidade. Relato comunitário grave continua crítico; existe teste específico para isso.
- Origem, horário, recomendação e explicação chegam ao aplicativo. Dados antigos permanecem identificados no servidor e envelhecem localmente mesmo sem nova resposta.
- App não armazena chave de ingestão nem solicita dados pessoais. Há cache versionado separado por servidor, limitação de horário/valor de ingestão, retenção e limites do protótipo documentados.
- README declara que intensidade de chuva não determina alagamento real sem outros fatores, e não fabrica acurácia nem estudo de usabilidade.

## Correções para >=4,5

1. Tornar a pontuação exatamente explicável no próprio alerta. Hoje o título pergunta por que a prioridade é 95/100, mas `explanation` apresenta somente faixas, valor e “Em elevação”; não informa a pontuação-base (90) nem o acréscimo de tendência (+5). Expor na explicação a decomposição base + tendência = total e, idealmente, o significado de cada faixa. A fórmula já está no README; falta conectar a evidência numérica no fluxo do morador.
2. Corrigir a janela de tendência para os 30 minutos declarados: `Duration.toMinutes() <= 30` aceita até 30m59s por truncamento. Comparar Duration diretamente com Duration.ofMinutes(30). Adicionar teste de 30m e 30m1s para impedir a discrepância.

## Recomendações não bloqueadoras

- A comparação usa categoria da fonte (SENSOR/PUBLIC_DATA/COMMUNITY), não identidade de um sensor ou produtor. Está adequada à simulação; documentar que não há fusão nem validação real de produtores antes de expandir.
- O último registro por bairro/risco substitui leituras de outras categorias. Para um produto real, definir política de conflito e corroboração entre fontes; não tratar o protótipo como consenso entre fontes.
- O recorte de 1000 leituras pode remover bairros da visão geral, mas a limitação está explícita e é aceitável para os nove cenários atualizados regularmente.
