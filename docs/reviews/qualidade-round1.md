# Conselho — Qualidade e Operação — rodada 1

Nota: **4,4/5 — reprovado nesta rodada**. Escopo: protótipo acadêmico local, três riscos simulados, Android em código/bundle e versão web no Windows. Não é avaliação de prontidão para produção.

## Evidências inspecionadas

- `work/backend-validation.log`: Maven verify termina BUILD SUCCESS; quatro testes, zero falhas/erros.
- `mobile/test-results/.last-run.json`: status passed. Fontes E2E exercitam API isolada em 8082, parada/reinício reais, recarga do navegador offline, filtros, expansão de alerta, aviso de mudança e primeiro acesso sem cache.
- Testes de unidade, scripts PowerShell, CI, Dockerfile, compose, configuração H2 em arquivo e README.
- Aprovação não certifica Android instalado, APK assinado, PostgreSQL/Docker executado ou carga. Esses ambientes não foram executados pelo revisor e foram declarados indisponíveis pelo coordenador.

## Bloqueadores concretos

1. **Cache estruturalmente inválido pode derrubar a aba Atividade.** `validDashboard` só verifica que `readings` é um array. Um snapshot com `readings: [null]` é aceito e o render acessa `r.id`, `r.type` e `r.value`. Validar cada leitura, além dos campos efetivamente usados dos alertas; adicionar teste de cache com array malformado. O produto promete ignorar cache inválido e continuar utilizável durante falhas.
2. **Reprodução do E2E não está fechada.** A configuração presume frontend em8081, e o teste compacto usa backend externo8080 em vez da API isolada8082. README não explica browser Playwright, servidor estático e variáveis necessárias. Tornar o compacto usar a mesma API isolada e documentar um procedimento completo (ou gerenciar servidor pelo Playwright).

## Melhorias de evidência

- O reinício atualmente verifica apenas Conectado e presença de nove grupos que o seed recriaria mesmo com banco vazio. Antes de declarar persistência comprovada, inserir leitura distintiva e conferir sua sobrevivência ao restart. Para comprovar dados novos após reconexão, comparar timestamp/ID/contador. A configuração H2 persistente está correta por inspeção, mas esse teste é mais forte que verificar o rótulo Conectado.
- O teste unitário chamado “resposta inválida não substitui snapshot” testa fetch, sem estado do hook; o E2E cobre preservação do cache, então ajustar descrição futura ou acrescentar assertion específica evita exagero sobre a unidade.
- O CI não inclui E2E; isso é aceitável neste protótipo se ficar explícito.

## Pontos positivos

Timeout, cancelamento e prevenção de requisições concorrentes; cache por servidor; dados antigos marcados; duas stacks com comandos claros; credencial de ingestão ausente do app; banco em volume no compose; defaults demonstrativos explicitamente documentados. Critério4,5 não foi flexibilizado por se tratar de trabalho acadêmico.

## Condição para nova avaliação

Corrigir os dois bloqueadores, repetir TypeScript/testes e E2E, publicar relatório distinguindo validação real de limites não testados. Nova nota deve refletir fontes e evidências atualizadas.
