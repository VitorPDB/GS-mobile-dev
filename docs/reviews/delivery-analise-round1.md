# Conselho — Análise e Privacidade — auditoria de entrega, rodada 1

Data da revisão: 17/11/2026. Candidato: `work/delivery-audit`, comparado à versão local `outputs/vigia-urbana`. Revisão de fontes e documentos, sem alteração da aplicação e sem alegar execução própria de testes nesta rodada.

## Três riscos examinados antes das melhorias

1. **Integridade do acompanhamento — bloqueador.** `MonitoringService.dashboard` agrupa apenas as últimas mil leituras globais. Assim, uma ocorrência crítica de um bairro silencioso pode desaparecer após muitas leituras de outro bairro, apesar de ainda existir no banco. Ela deve permanecer identificada como antiga, enquanto estiver na retenção, em vez de sumir por competição com outra fonte. Há também diferença temporal: `RiskAnalyzer` usa segundos truncados para `stale`, mas `ReactionService` rejeita voto assim que passam exatamente 90 segundos.
2. **Interpretação da confiança — limitação controlada.** O índice combina uma base fixa não calibrada com votos por instalação. Uma pessoa pode criar outras instalações/UUIDs e influenciar o resultado. Isso não comprova qualidade da medição. A implementação mantém gravidade/pontuação independentes dos votos, e a interface/README explicam a fórmula, a simulação, o pseudonimato e a ausência de garantia de uma pessoa por voto. Não é bloqueador adicional do protótipo nem motivo para exigir autenticação de produção; a apresentação deve preservar essas distinções.
3. **Higiene de publicação — precisa de controle concreto.** O `.gitignore` atual exclui `.env`, mas não variantes como `.env.local` ou `.env.production`. Tampouco exclui arquivos H2 que eventualmente estejam fora das pastas `data/`. Como o GitHub está vazio e será preenchido a partir de uma cópia local, a publicação deve usar seleção explícita e excluir ambientes, bancos, logs, UUIDs de testes, dependências instaladas e ferramentas. Nomes/RMs foram fornecidos pelo usuário para o README e podem ser incluídos conforme essa finalidade; não se deve adicionar outros dados locais.

## Evidências inspecionadas

- `backend/.../service/MonitoringService.java`: janela global de mil leituras e agrupamento posterior.
- `backend/.../service/RiskAnalyzer.java`: análise por faixas, tendência de até 30 minutos, confiança separada, mas idade truncada.
- `backend/.../service/ReactionService.java`: média ponderada, janela de 24 horas, remoção periódica e rejeição exata de leitura antiga.
- `mobile/src/identity.ts`: UUID persistido por instalação; falha de armazenamento impede identidade descartável.
- `mobile/src/AlertRow.tsx`: fonte, confiança base e combinada, fórmula e aviso de leitura antiga visíveis.
- `.gitignore` e `README.md`: exclusões atuais e limites explícitos de simulação/antifraude.

## Correções mínimas para reavaliação

- Consultar a leitura mais recente de cada risco/bairro independentemente do limite do histórico; manter as leituras antigas identificadas. Testar um grupo crítico silencioso mais 1001 leituras de outro grupo.
- Usar comparação temporal exata para `stale` e testar 90 segundos e pouco além de 90 segundos, coerente com a votação.
- Fortalecer exclusões de ambiente e banco; conferir manifesto da publicação. Não publicar a pasta de trabalho nem arquivos de execução local.
- Manter no relatório a confiança como índice demonstrativo de origem e apoio comunitário, sem chamar de probabilidade ou acurácia medida.
- Ajuste editorial recomendado: trocar a frase genérica "nenhum identificador pessoal é necessário" por descrição concreta de que o app não solicita nome/GPS/telefone e utiliza um UUID pseudônimo para votos. Não apresentar isso como certificação legal.

## Veredito

**Nota: 4,3/5 — corrigir antes de incorporar/publicar.** O bloqueador é a perda de cobertura do alerta silencioso, com a consistência temporal como parte do mesmo fluxo. A seleção limpa de arquivos é condição verificável para a publicação. A fórmula e a comunicação da confiança estão adequadas ao escopo acadêmico atual. Não certifico Android nativo, PostgreSQL, execução de CI remoto ou proteção antifraude de produção.
