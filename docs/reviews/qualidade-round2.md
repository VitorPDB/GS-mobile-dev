# Conselho — Qualidade e Operação — rodada 2

Nota: **4,7/5 — aprovado para incorporar o protótipo acadêmico**.

## Evidências e escopo

Revisão independente das fontes e artefatos locais. `mobile/test-results/.last-run.json` agora registra `status: passed` e `failedTests: []`. O coordenador informou dois E2E finais aprovados em35,6s, iniciando apenas os processos do próprio teste, sem backend externo8080 ou servidor Python. O log Maven continua com BUILD SUCCESS e quatro testes sem falhas; seis testes de sincronização/validação e TypeScript passaram conforme evidência do coordenador. Exportação Hermes final também concluída. A revisão não certifica execução nativa Android, APK assinado, PostgreSQL/Docker, carga ou CI remoto.

## Correções verificadas

1. `validReading` rejeita leitura nula, IDs inválidos, tipos/fontes desconhecidos, valor não finito/nulo e horário inválido. `validAlert` valida campos renderizados, confiança e score dentro das faixas. `validDashboard` valida todos os itens antes de aceitar cache/resposta. O teste novo cobre o defeito concreto que poderia derrubar Atividade.
2. Playwright inicia o preview automaticamente. O cenário compacto configura API8082, removendo dependência de backend externo8080. README explica instalação do browser, build prévio, JAR, portas e variáveis TEST_JAVA/PLAYWRIGHT_CHROMIUM_EXECUTABLE.
3. Cada execução cria um banco H2 novo via `mkdtempSync`, mantendo o mesmo databaseUrl durante o restart interno. Isso resolveu a falha intermediária em que um valor crítico da rodada anterior impedia mudança de gravidade. Nenhum banco existente é apagado.
4. O E2E registra contador e ID de leitura, desliga o processo, recarrega o app offline, reinicia a API e confere que o ID sobreviveu e o contador não diminuiu. A evidência agora distingue persistência de mera recriação de dados pelo seed.

## Conclusão

Os bloqueadores da rodada1 estão resolvidos e a execução final foi aprovada. O projeto tem um caminho de reprodução adequado às duas stacks e testes úteis da falha exigida pelo enunciado. As limitações de validação Android/PostgreSQL estão declaradas sem transformar bundle web ou Hermes em alegação de teste nativo.

## Melhorias futuras não bloqueadoras

Adicionar E2E ao CI quando houver ambiente preparado; tornar a inicialização do processo de teste falhar imediatamente em erro de spawn/porta ocupada; testar em Android real com TalkBack e fonte ampliada; executar o roteiro em PostgreSQL antes de escolhê-lo para apresentação. São limites explícitos deste escopo e não impedem a incorporação da versão acadêmica local aprovada.
