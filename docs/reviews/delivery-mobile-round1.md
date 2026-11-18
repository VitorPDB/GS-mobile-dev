# Conselho — Mobile e Experiência — auditoria pré-entrega, rodada 1

Data: 17/11/2026. Candidato examinado: `work/delivery-audit`. Revisão somente de leitura das fontes; nenhum arquivo da aplicação foi alterado por este membro.

## O que já está implementado

React Native com Expo, feed de três riscos, Panorama responsivo, filtros, histórico, medida/unidade, origem, confiança e análise expansível. As reações têm rótulos por ocorrência, seleção, erro e alvos de pelo menos 48 dp. A gravidade é textual, preservando compreensão sem depender de cor. O hook mantém cache por servidor/instalação, consulta periódica, timeout, reconexão e consulta offline. Os testes E2E existentes verificam navegador e API real; não são testes de dispositivo Android.

## Três pontos ruins investigados antes de propor mudanças

### 1. Configuração HTTP nativa não está declarada pelo mecanismo suportado — bloqueador

`mobile/app.json` contém `expo.android.usesCleartextTraffic`. Esse campo não existe na interface Android do `@expo/config-types` instalado e não aparece na referência oficial do app config. A propriedade é oferecida pelo plugin `expo-build-properties`, aplicado durante Prebuild. Uma exportação JavaScript/Hermes pode passar e ainda assim não provar que o AndroidManifest permite a API HTTP local numa instalação nativa.

Além disso, a referência oficial informa que `userInterfaceStyle` precisa de `expo-system-ui` no Android. Essa dependência não consta do package.json examinado. A solicitação do usuário fixa uma paleta clara; a configuração deve expressá-la corretamente.

Correção mínima: instalar versões compatíveis via `expo install expo-build-properties expo-system-ui`; retirar o campo inválido de `expo.android`; configurar `usesCleartextTraffic: true` dentro do plugin para a demonstração local; rodar Expo Doctor e uma introspecção/Prebuild verificando o manifesto resultante. Manter README deixando HTTP restrito ao desenvolvimento e HTTPS para disponibilização real. Não é necessário inventar um serviço de push para corrigir isso.

### 2. A entrega Android ainda não tem prova de funcionamento em aparelho — pendência de validação

Não há aparelho conectado na inspeção ADB informada pelo coordenador. As capturas compactas e o E2E atual são web. O bundle Hermes valida o JavaScript, mas não demonstra instalação, chamadas HTTP no Android, TalkBack, fonte aumentada ou recuperação após fechar/reabrir o app nativo.

Correção mínima executável agora: automatizar diagnóstico e verificação da configuração nativa, documentar uma matriz curta de teste no Android com passos e resultados esperados, e separar claramente "validado no navegador" de "a confirmar no aparelho". A confirmação física depende de um dispositivo disponível; não pode ser declarada por simulação do navegador. Essa ausência não deve ser mascarada por uma nota do conselho.

### 3. As notificações são avisos dentro do app aberto — limite que precisa aparecer na demonstração

`changedCritical` detecta alteração de gravidade e `App.tsx` apresenta aviso acessível em primeiro plano. Não há `expo-notifications`, push nem execução em segundo plano. O enunciado enviado não especifica expressamente push: não concluo que a implementação seja automaticamente incompatível, mas seria incorreto demonstrar ou descrever esses avisos como notificações de sistema.

Correção mínima: manter essa distinção visível no README e no roteiro/checklist; mostrar uma mudança real de gravidade gerando o aviso durante a apresentação. Só ampliar para notificações do sistema caso essa expectativa seja confirmada pelo professor. Não adicionar dependências e permissões de push sem necessidade.

## Fontes primárias verificadas

- Expo BuildProperties, incluindo `usesCleartextTraffic`: https://docs.expo.dev/versions/latest/sdk/build-properties/
- Expo app config, incluindo requisito de `expo-system-ui` para `userInterfaceStyle` no Android: https://docs.expo.dev/versions/latest/config/app/
- Tipos locais: `mobile/node_modules/@expo/config-types/build/ExpoConfig.d.ts`, interface `Android` sem `usesCleartextTraffic`.

## Veredito inicial

**Nota: 4,2/5 — fix.** O bloqueador concreto é a configuração nativa não comprovada/suportada. As outras duas limitações precisam de rastreabilidade honesta, sem alegar QA nativo ou push inexistentes. Solicito reavaliação após correção do app config e evidência de Doctor/introspecção; eventual aprovação será do candidato acadêmico no escopo examinado, sem certificar aparelho não testado.
