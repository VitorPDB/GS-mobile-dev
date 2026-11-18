# Conselho — Análise e Privacidade — auditoria de entrega, rodada 2

Data: 17/11/2026. Escopo: reavaliação do candidato `work/delivery-audit`, sem alteração das fontes pelo revisor. Aprovação de conteúdo candidato; manifesto e estado efetivo do GitHub devem ser conferidos pelo coordenador na publicação.

## Correções da rodada anterior

| Item | Evidência revisada | Resultado |
|---|---|---|
| Ocorrência silenciosa desaparecia após mil leituras de outro grupo | `findLatestPerRiskAndDistrict` usa seleção por ausência de registro mais recente, com desempate por ID; `MonitoringService` separa o estado de cada grupo do histórico limitado a 30 entradas | Resolvido |
| Consistência da idade | `RiskAnalyzer` usa `now.isAfter(observedAt.plusSeconds(90))`, alinhado à rejeição de voto | Resolvido |
| Regressões de cobertura e tempo | `CoverageTest` mantém o alerta crítico/antigo junto de 1001 leituras de outro bairro e verifica 90 s / 90 s + 1 ms; Surefire registra 3 testes de cobertura, 4 de monitoramento e 5 de reação, todos sem falhas | Resolvido no H2 local |
| Exclusões para publicação | `.env*` com exceção de `.env.example`, bancos H2, dumps, backups, dependências, builds e relatórios de execução excluídos | Adequado para a seleção explícita planejada |
| Proteção do estado local Android | Configuração `allowBackup:false`; introspecção em `mobile/verification-results/android-config.json` registra `allowBackup:false` e `nativeExecutionVerified:false` | Configuração comprovada; não equivale a execução no aparelho |

## Confiança e dados pessoais

A fórmula de confiança e a janela de votos continuam descritas como índice demonstrativo da fonte e do apoio/contestação comunitária. Não reduzem a gravidade física nem alegam probabilidade ou acurácia. A identidade é um UUID pseudônimo de instalação, sem garantia de uma pessoa por voto. Retenção e ausência de antifraude de produção estão declaradas.

Os nomes e RMs do README foram fornecidos pelo usuário para identificação acadêmica. Isso não autoriza publicar bancos, dumps, UUIDs de execução, `.env` ou logs locais; o manifesto final continua sendo a verificação necessária antes de enviar arquivos.

Recomendação editorial sem bloqueio: substituir a frase genérica “nenhum identificador pessoal é necessário” pela descrição concreta de que o app não solicita nome, GPS ou telefone e utiliza UUID pseudônimo para registrar votos. A explicação detalhada já aparece no mesmo parágrafo e em `SECURITY.md`; não há motivo para apresentar uma certificação legal.

## Dependência upstream conhecida

Conferi o [advisory oficial GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf), atualizado em 17/11/2026: `picomatch` até 4.0.7 é afetado por ReDoS de extglobs e a página não lista versão corrigida.

`SECURITY.md` registra os 26 avisos altos em cascata da auditoria, a ausência de correção publicada e o limite da revisão: o uso identificado está na cadeia Expo/Metro/codegen, sem entrada glob encontrada nos endpoints da aplicação revisados. Isso não é prova de ausência universal de exposição. Não foi inventado patch, não houve downgrade incompatível nem alegação de auditoria limpa.

É aceitável, proporcionalmente à demonstração acadêmica em rede privada, manter a stack compatível e arquivar o relatório de auditoria, com essa pendência explícita. Não aprovo uso em produção nem exposição pública do Metro. Como a etapa atual é genericamente `continue-on-error`, ela também não bloqueará futuros avisos diferentes: o relatório deve continuar sendo revisado; uma allowlist específica pode ser evolução futura.

## Veredito

**Nota: 4,6/5 — aprovado para o candidato acadêmico e sua publicação limpa.** Os bloqueadores de integridade identificados nesta área foram corrigidos. A dependência upstream permanece pendência de segurança declarada, não uma correção concluída. Não certifico execução Android nativa, PostgreSQL, CI remoto ou prontidão de produção; essas evidências devem ser distinguidas pelo coordenador e pelos membros responsáveis.
