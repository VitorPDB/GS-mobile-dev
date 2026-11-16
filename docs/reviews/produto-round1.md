# Conselho — Produto e Requisitos — rodada 1

Data: 16/11/2026. Escopo avaliado: protótipo acadêmico local Vigia Urbana, três riscos, app Android e apresentação web no Windows.

**Nota: 4,6/5. Aprovado no escopo de Produto e Requisitos.**

## Rastreabilidade

| Requisito | Evidência no candidato | Avaliação |
|---|---|---|
| Spring Boot e React Native no mesmo repositório | backend/pom.xml e mobile/package.json, index.ts e App.tsx | Atendido |
| Receber sensores, bases e registros comunitários | SourceType e POST /api/readings; simulador gera as três categorias | Atendido com simulação explícita |
| Persistir e expor REST priorizada | Repository, MonitoringService.dashboard e documentação de H2/PostgreSQL | Atendido em desenho e implementação; QA de ambiente pertence aos membros técnicos |
| Origem e confiança | AlertRow mostra categoria da fonte e confiança; servidor atribui confiança | Atendido |
| Painel e lista ou mapa | Visão geral, lista priorizada, filtros e detalhes | Atendido pela alternativa lista |
| Notificações | useMonitoring detecta nova ocorrência/mudança de gravidade; App mostra aviso acessível | Atendido como aviso em primeiro plano; push não foi especificado pelo enunciado e a limitação está clara |
| Análise ou IA | Pontuação por faixas e tendência, com justificativa | Atendido pela alternativa análise; não alega modelo treinado |
| Desconexão sem travar e recuperação | Cache por servidor, estados offline, leitura antiga, retry automático e roteiro de apresentação | Fluxo implementado; aprovação end-to-end depende do membro Qualidade |
| Arquitetura, testes e execução | Camadas, testes e README com comandos Windows, Expo Go e Docker | Atendido |
| Escalabilidade, disponibilidade e dados pessoais | Consulta limitada, retenção, configuração, escrita com chave e discussão honesta dos limites | Adequado ao protótipo; não certifica produção |
| Indicadores | Latência medida, última sincronização, testes de análise, validação de usabilidade declarada como pendente | Adequado sem métricas inventadas |
| Entrega e evolução | README identifica campos da equipe e explica commits assistidos; publicação não realizada | Adequado ao momento; equipe deverá preencher nomes/RMs e contribuir no Git |

## Evidências examinadas

README.md, PRODUCT.md, mobile/App.tsx, mobile/src/useMonitoring.ts, mobile/src/sync.ts, backend/api/MonitoringController.java, backend/service/DemoSimulator.java e scripts de execução. Relato de testes do construtor foi considerado como contexto, sem declarar execução própria.

## Limitações da aprovação

Não executei o app nem o backend nesta revisão. Não certifico Android instalado, PostgreSQL/Docker, acessibilidade em leitor de tela, CI remoto ou o teste E2E em andamento. Esses pontos devem ser registrados pelo membro Qualidade e Operação. A nota aprova aderência e escopo do produto, não substitui as outras quatro avaliações.

## Recomendações sem bloqueio

- Finalizar docs/VALIDACAO.md e docs/CONSELHO.md citados no README antes de empacotar. Devem distinguir execução real e pendências.
- Manter no relatório final a informação de que Android teve export de bundle, se não houver teste em dispositivo.
- Confirmar com o professor, antes da apresentação, se deseja push em segundo plano. O enunciado fornecido não o exige expressamente.
- Preencher nomes/RMs e registrar contribuição real dos integrantes; não fabricar histórico de equipe.

Não há bloqueador adicional de produto para este recorte acadêmico.
