# Conselho — Análise e Privacidade — redesign URIP — rodada 1

Data: 16/11/2026. Escopo: mudanças do candidato `work/redesign` em relação ao protótipo acadêmico aprovado. Revisão de fontes de `AlertRow`, `App`, `useMonitoring`, `sync`, tipos e `RiskAnalyzer`, mais capturas `urip-desktop-feed.png` e `urip-desktop-analysis.png`.

**Nota: 4,7/5 — aprovado no escopo de Análise e Privacidade.**

## Evidências

- A gravidade continua exibida por texto (`Crítico`, `Alto`, `Moderado`, `Baixo`); a mudança para monocromático não tornou a classificação dependente apenas de tons.
- A medida e a unidade aparecem juntas na publicação, com rótulos específicos para chuva, temperatura e duração da interrupção. Tendência e pontuação permanecem visíveis.
- A análise expansível preserva a justificativa calculada no servidor, inclusive decomposição numérica da pontuação e limites demonstrativos. Não foi introduzida uma análise concorrente no frontend.
- A fonte aparece explicitamente como simulada e acompanhada de ícone neutro de banco de dados, sem selo de fonte oficial ou verificada.
- O detalhamento distingue confiança da categoria de fonte de probabilidade de ocorrência. O texto contextual repete essa distinção em “Sobre a análise”.
- A identificação de simulação e de ausência de alerta oficial fica antes do feed. O aviso de leitura antiga usa `isStale`, que continua envelhecendo dados mesmo sem resposta nova; o estado offline informa que a situação pode ter mudado.
- O hook deixa de ler o antigo endereço configurado na UI e continua validando o endereço de ambiente, separando cache por URL e rejeitando dados malformados. Não adiciona coleta de nome, localização ou outros dados pessoais.

## Limites

A revisão não recalibra as faixas ou a confiança demonstrativas, nem certifica a acurácia de previsão — o produto não faz essa alegação. O panorama usa explicitamente as últimas leituras salvas, portanto não promete cobertura atual durante indisponibilidade. Não executei QA nativo Android, Docker/PostgreSQL, carga ou teste em leitor de tela. Os testes de execução pertencem à verificação do coordenador e do membro Qualidade.

## Veredito

Nenhum bloqueador de Análise e Privacidade foi encontrado nesta alteração. A nova apresentação preserva a interpretação correta dos dados simulados e a análise explicável anteriormente aprovada. A nota aprova este escopo do redesign para o protótipo acadêmico; não é certificação de uso em situações reais de emergência.
