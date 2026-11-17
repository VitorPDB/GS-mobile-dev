# Mobile e Experiência — reactions, rodada 2

## Escopo e evidência

Revisão independente final do delta de likes/dislikes e marca URIP em `work/reactions`, sem editar fontes. Esta rodada substitui a pendência de captura da rodada 1. Inspecionei com view_image as novas `docs/images/urip-reactions-320.png` (320 × 740) e `urip-reactions-390.png` (390 × 844), com rolagem até as ações e análise aberta. Considerei também as capturas já inspecionadas de primeiro viewport compacto, desktop e desktop com like selecionado. Revisei a alteração `flexWrap: wrap` em AlertRow.tsx e as asserções E2E de votação, teclado e capturas. Contexto visual: PRODUCT.md e DESIGN.md; piso de craft e referência Android lidos na rodada anterior. Nenhum detector rodou. O coordenador informou dois E2E finais aprovados em 34,0 s, testes unitários/backend aprovados e exportação Hermes Android concluída; não reexecutei esses comandos. Evidência visual continua WEB: não é QA Android nativo.

## Usabilidade

As novas imagens resolvem a lacuna anterior: em 320 e 390 px, heart, thumb-down, contadores e janela de 24 h ficam visíveis sem colisão ou corte horizontal. A linha de origem e confiança mantém leitura clara. O rótulo de prioridade quebra para uma segunda linha dentro da superfície de medida em 320, comportamento adequado ao espaço disponível. A recomendação se adapta em linhas legíveis, e o botão de fechar análise preserva alvo e alinhamento. A análise aberta quebra título e parágrafos naturalmente; em 390 a conta completa e a ressalva acadêmica estão legíveis. O corte vertical do texto ao final do viewport 320 é rolagem normal, não truncamento do conteúdo.

A captura compacta mostra um like agregado e heart vazio; isso é coerente com voto de outra instalação e com a separação entre contador público e seleção pessoal. O desktop selecionado mostra heart preenchido e fundo creme, com um voto e confiança de 92%. Confiança inicial 90%, um like 92% e dois likes aproximadamente 93% correspondem à fórmula aprovada. O detalhe discrimina base da fonte e confiança combinada e informa que não se trata de probabilidade. A severidade e prioridade física permanecem independentes. URIP em caixa alta está presente tanto no topo compacto quanto no rail desktop. A direção branco/creme/preto e o feed inspirado no Instagram foram preservados.

## Acessibilidade

Os controles mantêm accessibilityRole button, rótulos por alerta/bairro, valor textual da contagem, selected e aria-pressed. Heart selecionado varia forma e fundo; gravidade possui nome textual. Alvos das reações são no mínimo 64 × 48 dp, com gap de 12 dp; flexWrap permite acomodar crescimento do conteúdo sem fixar uma linha rígida. O botão da análise possui expanded e rótulo contextual. O teste E2E inclui ativação por teclado, segundo as asserções inspecionadas e execução informada. O texto secundário e a tinta permanecem legíveis nas superfícies claras. A hierarquia e o espaçamento do render compacto não se degradam quando a análise abre.

As fontes usam Text React Native com escala padrão, e o shell preserva safe areas. Não certifico TalkBack, anúncios nativos de seleção/erro, fonte Android 1,3, sistema Back ou desempenho em hardware a partir destas capturas. O bundle Hermes aprovado comprova exportação, não esses comportamentos. A paleta clara fixa é requisito aprovado e não deve ser substituída por outra direção nesta revisão.

## Falhas e recuperação

O código conserva spinner rotulado no post durante envio, disabled durante mutação, bloqueio offline e para leitura antiga, timeout e erro com recuperação explícita no próprio post. Erro de armazenamento da identidade explica a indisponibilidade da votação. Cache é separado por servidor e instalação; identidade UUID via Expo Crypto é persistida. Toggle remove e outro tipo troca o voto. A suíte E2E final informada cobre contadores reais, essas transições, reload, segundo perfil, confiança 92→93%, API realmente encerrada/reiniciada, persistência e ações desabilitadas offline. As asserções no arquivo de teste correspondem a essa cobertura.

README informa janela de 24 h, pseudonimato, instalação em vez de pessoa verificada e limites contra manipulação. A solução permanece proporcional ao protótipo; não há justificativa para exigir login de produção. Não encontrei falha bloqueante no delta. Permanecem limites de verificação nativa declarados, sem alegação de certificação Android.

## Veredito

**4,7/5 — ship**, no escopo do delta e da demonstração web verificada, com inspeção de código React Native. As novas capturas confirmam a composição das reações nos dois tamanhos compactos e encerram o recapture da rodada 1. A solução atende ao pedido de likes/dislikes reais, influência direta na confiança, seleção pessoal, contadores, recuperação de falha e marca URIP, preservando a identidade estabelecida. Não exige rebuild ou nova rodada estética. A nota não equivale à aprovação de execução Android em dispositivo: esse limite continua explicitamente registrado.

Questions skipped: requisitos confirmados e pendência visual encerrada; não há decisão do usuário necessária.
