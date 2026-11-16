# Conselho — Mobile e Experiência — rodada 1

## Escopo e evidência

Revisão independente do candidato `work/candidate`, em 16/11/2026. Li PRODUCT.md, DESIGN.md, README.md, App.tsx, AlertRow.tsx, useMonitoring.ts, sync.ts e theme.ts. Inspecionei desktop-online.png, desktop-offline.png, compact-dark-web.png e compact-first-offline-web.png. Consultei craft-floor.md e android.md da skill Impeccable. Nenhum detector executou; não houve comp de referência.

As capturas compactas são de React Native Web em viewport de 390 px. Elas não comprovam execução, insets, teclado, gestos, TalkBack ou fontes ampliadas em Android. O build Hermes e os E2E relatados pelo coordenador são evidências complementares, sem equivaler a QA em dispositivo.

## Usabilidade

O painel apresenta os três riscos, filtro, gravidade em texto, horário e confiança. Detalhes explicam numericamente a prioridade e distinguem confiança de probabilidade. A comunicação de simulação é persistente e clara. O modo offline preserva informação e orienta a recuperação; há ação manual e tentativa automática.

A adaptação para navegação inferior compacta e rail no desktop é apropriada. A visão geral ocupa bastante altura no celular e empurra o início da lista para baixo; reduzir essa área seria um refinamento, não um bloqueador desta entrega acadêmica. A captura compacta não mostra a lista completa porque o conteúdo usa scroll interno; a navegação e a continuação da rolagem precisam entrar no roteiro manual Android.

## Acessibilidade

Há rótulos explícitos para navegação, expansão de linhas, atualização e campo de conexão. Ícones decorativos são ocultados; gravidade e estado de conexão não dependem só de cor. Botões e chips têm alvo de pelo menos 48 dp. O app não restringe a escala de texto por `allowFontScaling=false`.

Calculei razões de contraste a partir dos tokens: texto secundário claro/superfície 6,02:1; secundário claro/fundo 5,56:1; botão claro 6,68:1; aviso alto claro 5,76:1; secundário escuro/superfície 8,32:1; botão escuro 8,90:1; aviso alto escuro 8,21:1. Os pares amostrados passam 4,5:1. Não constitui auditoria WCAG completa nem teste TalkBack.

## Falhas

**Bloqueador:** `validDashboard` valida que `readings` é array, mas não valida seus elementos. Reproduzi `validDashboard({serverTime:'2026-11-16T12:00:00Z',simulated:true,alerts:[],readings:[null],storedReadings:1})` retornando `true`. Em Atividade, `r.type` e `r.value.toLocaleString` causam exceção com esses dados. A mesma validação é usada ao aceitar respostas e restaurar cache, portanto uma resposta incompatível ou snapshot corrompido pode inutilizar uma aba em vez de preservar o último estado válido.

Correção necessária: validar integralmente os campos de Reading usados na interface (id, tipo, origem, bairro, medida finita, horário válido), rejeitar elementos nulos e completar a validação dos campos de Alert consumidos. Adicionar casos de teste de resposta/cache com leitura nula e medida nula, preservando a rejeição segura.

Não bloqueadores: screenshots web não cobrem Android nativo; falta exercitar fonte 1,3× e teclado no aparelho; notificações são apenas em primeiro plano, como está declarado no produto e no README.

## Veredito

**Disposition: fix. Nota: 4,4/5. Reprovado nesta rodada.** A interface e o fluxo demonstrado estão adequados para o protótipo, mas a validação incompleta dos dados contradiz a recuperação segura requerida. Reavaliar após corrigir o bloqueador e rodar os testes afetados. Não certifico Android nativo ou produção.
