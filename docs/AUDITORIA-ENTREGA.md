# Auditoria da entrega — 17/11/2026

## Ponto de partida

O repositório indicado (VitorPDB/GS-mobile-dev) estava vazio: metadados size 0, conteúdos retornando “This repository is empty” e lista de commits retornando “Git Repository is empty”. A aplicação existia somente na cópia local. Não se considerou a versão local como prova de conteúdo publicado.

## Três problemas considerados antes de editar

1. **Entrega incompleta no GitHub:** sem arquivos/commits públicos, README com integrantes em branco e evidências dispersas. Preparação de fonte limpa, integrantes preenchidos e matriz do enunciado; contribuições individuais reais continuam pendentes.
2. **Android sem validação suficiente:** campo HTTP em local inválido, ausência de dependência direta de fontes e diagnóstico não executado. Corrigidos plugins oficiais e dependências, com Doctor 20/20 e inspeção do manifesto; execução em aparelho continua pendente.
3. **Integridade e reprodutibilidade:** uma ocorrência podia sumir após 1000 leituras alheias; stale tinha diferença de truncamento; E2E podia aceitar uma API que já estivesse na porta de teste. Corrigidas consulta por grupo, comparação exata e isolamento do processo/porta, com regressões específicas.

Os cinco membros do conselho foram consultados antes de aplicar essas melhorias. Os pareceres da primeira rodada foram conservados em reviews/delivery-*-round1.md. Na segunda rodada, todos atingiram o mínimo: Produto4,7; Backend4,7; Mobile4,7; Análise4,6; Qualidade4,7. O candidato foi autorizado para incorporar/publicar, sem antecipar resultados remotos.

## Melhorias aplicadas no candidato

- Última leitura de cada risco/bairro independente do histórico de outros grupos; índices compostos; histórico limitado a 30 registros. Regressão com 1 grupo crítico silencioso e 1001 leituras de outro grupo.
- Stale muda imediatamente depois de 90 s, alinhado ao bloqueio de voto; teste em 90 s exatos e 90 s + 1 ms.
- Expo atualizado no patch compatível 58.0.26; expo-build-properties configurando HTTP de demonstração, expo-font direto, expo-system-ui e backup Android desabilitado.
- Doctor e introspecção Android no CI; teste não afirma execução nativa.
- E2E recusa porta ocupada, aguarda inicialização do próprio filho, usa loopback IPv4 explícito e encerra apenas o processo criado, com prazos limitados.
- Teste observa uma atualização automática do simulador e guarda o intervalo medido.
- Workflow com H2, serviço PostgreSQL, cliente/configuração e navegador, guardando relatórios e capturas.
- Identificação dos integrantes, roteiro Android e orientação de contribuições reais; .gitignore cobrindo ambientes e bancos fora de data/.

## Evidências executadas localmente

- Backend Maven verify: 12 testes passaram, zero falhas/erros.
- TypeScript passou; 11 testes do cliente/infraestrutura passaram.
- Expo Doctor: 20/20 verificações passaram.
- Introspecção: usesCleartextTraffic=true, allowBackup=false e módulos necessários diretos; não é QA em aparelho.
- Exportações web e Android Hermes passaram.
- E2E com API real passou, incluindo atualização, votação compartilhada, cache após reload, parada/reinício e persistência. A execução final passou em 38,3 s. O intervalo observado entre duas leituras automáticas foi 11.871 ms nesta execução; a configuração é de cerca de 12 s. Evidência em evidence/automatic-update-timing.json.

## Pendências honestas

- Executar o roteiro Android em aparelho/emulador, TalkBack e fonte ampliada, anexando evidências.
- Registrar contribuições reais de cada integrante e gravar a apresentação final.
- Reavaliar o aviso upstream descrito em SECURITY.md: há registros de severidade alta na árvore npm e não se declara “zero vulnerabilidades”.
- Validar os resultados remotos do workflow após publicação. Adicionar um job PostgreSQL não é prova de que ele passou.

Os arquivos de evidência em evidence/ distinguem testes locais de execução remota. Os relatórios anteriores permanecem históricos de suas versões.

## Publicação

O código revisado ficou preparado e commitado localmente, com origin apontando para VitorPDB/GS-mobile-dev. Nenhuma alteração foi gravada no GitHub por esta sessão: a integração retornou 403 e o Git local não tinha autenticação não interativa disponível. Por orientação do usuário, o push será executado por ele no próprio terminal. CI remoto e PostgreSQL continuam pendentes até essa publicação e a conclusão dos jobs.
