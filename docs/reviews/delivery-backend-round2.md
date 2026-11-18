# Conselho — Backend e Dados — auditoria pré-entrega, rodada 2

## Escopo e evidências

Reavaliei as alterações em `work/delivery-audit`: `ReadingRepository`, `MonitoringService`, `RiskAnalyzer`, índices de `Reading`, `CoverageTest` e workflow. Conferi `work/delivery-backend.log`: Maven `verify` terminou com **BUILD SUCCESS**, 12 testes, zero falhas ou erros. Os erros de unicidade presentes no log pertencem ao teste concorrente esperado, cujo resultado passou.

Não alterei fontes e não executei PostgreSQL/Docker ou Android. O coordenador informou dois E2E aprovados; a aprovação desta área se apoia diretamente nas fontes e no relatório Maven inspecionado.

## Correções da rodada anterior

| Achado | Resultado |
|---|---|
| Ocorrência silenciosa eliminada pela janela global de 1000 linhas | **Resolvido.** A consulta JPQL `NOT EXISTS` encontra o último registro de cada risco+bairro sobre os dados retidos, com desempate por horário e ID. O histórico passou a ter consulta independente limitada a 30 linhas. |
| Tendência precisa continuar comparando a fonte correta | **Preservado.** A busca da leitura anterior filtra risco, bairro, fonte e horário estritamente anterior; a janela exata de 30 minutos permanece no analisador. |
| `stale` divergia da rejeição de voto entre 90 e 91 segundos | **Resolvido.** Comparação por `Instant.isAfter(observedAt.plusSeconds(90))`; teste cobre exatamente 90 s e 90 s + 1 ms. |
| Ausência de evidência PostgreSQL | **Melhorado, ainda pendente de execução remota.** O CI agora fornece serviço PostgreSQL e variáveis `SPRING_DATASOURCE_*` que sobrepõem a configuração H2 dos testes. Não equivale a um resultado aprovado antes de o job rodar. |

O teste de cobertura reproduz o caso material: uma leitura crítica antiga de um bairro e 1001 leituras de outro. Confirma que o alerta silencioso continua no dashboard, crítico e antigo, sem aumentar o histórico retornado. Outro teste confirma desempate por ID e tendência sem misturar fontes. Os índices compostos correspondem aos filtros da seleção atual e da leitura comparável.

## Limites proporcionais

A seleção usa JPQL, sem SQL dependente de H2, e as queries/índices são adequados ao protótipo. Há uma busca de leitura anterior por ocorrência; para grande quantidade de bairros, materialização/paginação continua sendo uma evolução pertinente. Não constitui novo bloqueador para a entrega acadêmica de três riscos. Não interpreto a consulta corrigida como garantia de alta disponibilidade ou desempenho em produção.

## Veredito

**Nota: 4,7/5 — aprovado em Backend e Dados para incorporação e publicação da versão revisada.** O bloqueador de cobertura e a inconsistência temporal foram corrigidos com testes materiais. PostgreSQL deve continuar descrito como configurado, aguardando o resultado do CI; esta aprovação não certifica sua execução nem Android nativo.
