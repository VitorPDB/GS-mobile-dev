# Conselho — Mobile e Experiência — auditoria pré-entrega, rodada 2

Data: 17/11/2026. Escopo: correção da configuração nativa e rastreabilidade das limitações do candidato `work/delivery-audit`, comparado ao parecer da rodada 1. Não alterei fontes.

## Evidências verificadas

- `app.json` remove o campo inválido de `expo.android` e configura `usesCleartextTraffic` pelo plugin `expo-build-properties`.
- `expo-font`, `expo-system-ui` e `expo-build-properties` são dependências diretas compatíveis com o SDK 58. O plugin de fonte está registrado e o patch Expo passou para 58.0.26.
- `android.allowBackup=false` está declarado, coerente com a presença do identificador local de instalação.
- Executei independentemente `npm run check:android` e `npm run typecheck`: ambos passaram.
- Uma introspecção adicional confirmou `expo_system_ui_user_interface_style=light` nos recursos de string e `AppTheme` com pai `Theme.AppCompat.Light.NoActionBar`. A paleta clara não ficou apenas no JSON de entrada.
- O relatório `docs/evidence/delivery-checks.json` registra Doctor 20/20, 11 testes do cliente, E2E aprovado e exportações. Considero esses resultados como evidência do coordenador, sem alegar execução própria de todos eles.

## Correções da rodada anterior

| Item | Resultado |
|---|---|
| Configuração HTTP nativa inválida | Resolvido pelo plugin oficial e manifesto introspectado |
| Dependência necessária para aparência Android | Resolvido por `expo-system-ui`, com recursos nativos claros confirmados |
| Ausência de execução em aparelho | Mantida como pendência explícita em `TESTE-ANDROID.md`, sem aprovação fabricada |
| Escopo de notificações | README, matriz e teste Android distinguem aviso em primeiro plano de push inexistente |

## Requisitos e limites

O feed, Panorama, filtros, histórico, confiança, análise, votação e estados offline continuam implementados. O enunciado permite lista em vez de mapa e análise em vez de modelo treinado. A matriz de entrega não infla essas alternativas nem alega notificações em segundo plano.

Esta aprovação não certifica instalação em aparelho/emulador, TalkBack, fonte ampliada nativa, acesso HTTP efetivo pela rede do celular ou APK assinado. O teste físico continua necessário antes da apresentação; o roteiro agora explica como executar e registrar o resultado. O estado do workflow remoto deve ser verificado após publicação.

Sugestão não bloqueadora: estender `check-android-config.mjs` para também afirmar a string e o pai do tema nativo que confirmei na introspecção; hoje o assert de aparência verifica o campo `configuration.userInterfaceStyle`.

O aviso transitivo npm é tratado em `SECURITY.md` e não foi desconsiderado como se o projeto tivesse “zero vulnerabilidades”. Esta revisão não substitui a área de segurança/análise do conselho.

## Veredito

**Nota: 4,7/5 — aprovado para incorporar e publicar o candidato acadêmico no escopo examinado.** O bloqueador de configuração da rodada 1 foi resolvido. A aprovação não transforma pendências de dispositivo em evidência concluída e não garante a nota acadêmica final.
