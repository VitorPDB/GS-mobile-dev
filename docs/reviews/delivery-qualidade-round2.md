# Conselho — Qualidade e Operação — auditoria de entrega, rodada 2

## Escopo e evidência

Reavaliação do candidato `work/delivery-audit` após a rodada 1, antes da publicação. Examinei o helper de processo E2E, seus testes, workflow, verificação Android, matriz de entrega, relatório atual e SECURITY.md. Esta aprovação é do candidato para publicação; não transforma um job de CI escrito em execução remota comprovada.

Executei independentemente `node --import tsx tests/backend-process.test.ts`: **2 testes passaram**, zero falhas, confirmando recusa de porta ocupada sem requisições HTTP ao serviço existente e falha do filho sem aceitar saúde de terceiros.

Conferi os relatórios Surefire atuais: CoverageTest 3, MonitoringTest 4 e ReactionTest 5, total **12 testes sem falhas/erros**. O log Expo Doctor termina em **20/20**. A introspecção registra HTTP da demonstração habilitado, backup Android desabilitado e `nativeExecutionVerified:false`. O estado final Playwright é `passed`; o coordenador e o relatório atual registram 2 E2E em 38,3 s, 11 testes TypeScript/cliente e exportações web/Hermes aprovadas. O intervalo automático registrado foi 11.871 ms; é uma observação desta execução, não garantia de SLA.

## Correções da rodada 1

| Item | Resultado |
|---|---|
| Não aceitar API alheia na porta 8082 | **Resolvido.** Porta é recusada antes do spawn; nenhuma requisição ao serviço existente é necessária. |
| Confirmar processo próprio durante startup | **Resolvido.** Aguarda log de inicialização recebido do stdout do filho recém-criado, observa erro/exit e só então consulta health. |
| Limitar espera e encerramento | **Resolvido.** Startup limitado a 30 s; health com timeout de 1 s; parada de 8 s com fallback de 3 s, restrita ao filho criado. |
| Verificação Android além de exportação | **Resolvido no escopo de configuração.** Doctor e introspecção checam plugins/manifesto; não se alega QA em aparelho. |
| Evidência organizada e execução limpa | **Resolvido no candidato.** Matriz requisito→implementação→evidência, nomes/RMs, workflow com H2/PostgreSQL/mobile/E2E e artefatos. Publicação e resultados remotos devem ser conferidos após incorporação. |
| Persistência e cobertura de ocorrências | **Mantidas/reforçadas.** E2E conserva verificações de ID/contador/voto após restart; regressões de grupo silencioso e limite exato de 90 s constam dos testes atuais. |

## Segurança, limites e recomendação

A auditoria não está limpa: SECURITY.md registra 26 ocorrências altas em cascata de um advisory upstream sem correção disponível na versão avaliada. A etapa npm audit é explicitamente não bloqueante e guarda relatório; CI aprovado não equivale a ausência de vulnerabilidades. Para este protótipo local com entradas glob fora dos campos de moradores e limitação documentada, isso não cria novo bloqueador de publicação acadêmica. Não certifico prontidão de produção, proteção antifraude ou ausência de exposição em todas as dependências.

Recomendação sem bloqueio: usar `if: always()` na etapa que registra npm audit para preservar esse diagnóstico mesmo se uma etapa mobile anterior falhar. Artefatos de falha e verificações nativas devem continuar distinguindo resultados executados de pendências.

## Veredito

**4,7/5 — aprovado para incorporar e publicar o candidato acadêmico.** O bloqueador de isolamento da rodada 1 foi corrigido e testado independentemente. Sem novo bloqueador observado no escopo da alteração.

Continuam pendentes: execução Android em aparelho/emulador com acessibilidade nativa, execução remota do workflow/PostgreSQL, contribuições individuais reais e apresentação final. A integridade da árvore publicada e o estado dos jobs remotos devem ser verificados depois da publicação; eventuais falhas remotas exigem correção antes de anunciá-los como aprovados.
