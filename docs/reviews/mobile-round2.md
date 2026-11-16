# Conselho — Mobile e Experiência — rodada 2

## Escopo e evidência

Reavaliação do bloqueador registrado na rodada 1, em 16/11/2026, sobre `mobile/src/sync.ts` e `mobile/tests/sync.test.ts`. Esta é uma passagem de veredito sobre a correção indicada, não uma segunda auditoria completa. Mantém-se a evidência visual e o escopo de protótipo acadêmico da rodada anterior.

Executei independentemente `node --import tsx tests/sync.test.ts` e `npm run typecheck`: seis testes passaram, zero falhas; TypeScript sem erros.

## Usabilidade

A alteração é de validação de dados, preservando composição e interação avaliadas na rodada 1. Dados incompatíveis passam a ser rejeitados antes de chegar à interface, permitindo que o fluxo de falha mantenha o último snapshot válido.

## Acessibilidade

Os rótulos, alvos de toque, severidades textuais e contrastes amostrados da rodada anterior permanecem como evidência. Esta correção não certifica Android nativo, fonte ampliada, teclado ou TalkBack; não há captura de dispositivo nesta revisão.

## Falhas

| Correção solicitada | Resultado |
|---|---|
| Validar cada elemento de `readings` | **Resolvida.** `validReading` rejeita leitura nula, ID inválido, enum desconhecido, medida não finita/nula, bairro vazio e horário inválido. |
| Completar campos de alerta consumidos na interface | **Resolvida.** `validAlert` verifica campos textuais, enums, IDs, score/confiança em faixas válidas, medida, horário e booleans. |
| Cobrir cache e resposta corrompidos | **Resolvida.** O novo teste rejeita `readings:[null]`, medidas nulas e outras incompatibilidades tanto no dashboard quanto no snapshot; `fetchDashboard` rejeita a resposta inválida. |

Todos os itens materiais desta passagem foram resolvidos. Os limites não bloqueadores registrados antes permanecem: QA nativo Android pendente e notificações somente no app aberto, conforme escopo explícito.

## Veredito

**Disposition: ship. Nota: 4,6/5 — aprovado para o protótipo acadêmico avaliado.** A passagem de correção resolveu o bloqueador de resiliência. Esta aprovação não equivale a certificação de execução nativa Android ou prontidão de produção.
