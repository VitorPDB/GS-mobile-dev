# Conselho — Qualidade e Operação — auditoria de entrega, rodada 1

## Escopo

Revisão estática independente do candidato `work/delivery-audit`, antes de alterar fontes. Comparei CI, scripts Windows, testes de sincronização/votos e E2E com os requisitos acadêmicos fornecidos. Considerei como contexto a confirmação do coordenador de que `VitorPDB/GS-mobile-dev` está vazio. Não tratei relatórios antigos como execução atual nem aleguei testes Android nativos.

## Três riscos principais

1. **Entrega e evidência não existem no remoto.** Um workflow local não comprova que um clone limpo funciona; o GitHub vazio ainda não oferece código, README ou CI avaliáveis. Publicar uma árvore limpa após aprovação, preencher integrantes/RMs fornecidos e registrar a execução real do CI são correções necessárias. Guardar relatórios e capturas como artefatos de CI permite examinar falhas sem depender da máquina do desenvolvedor. Não fabricar commits de participação da equipe.

2. **A verificação Android atual não valida a configuração nativa.** O CI exporta Hermes e verifica versões, mas não executa Doctor nem confere o manifesto produzido. A configuração `android.usesCleartextTraffic` e a dependência de aparência Android foram identificadas pelo membro Mobile; corrigir plugin/dependência, adicionar diagnóstico e introspecção/prebuild verificável. Teste em aparelho, TalkBack e fonte ampliada devem continuar pendentes se não forem executados. PostgreSQL em CI é uma melhoria útil, mas H2 persistente já atende à persistência exigida no MVP.

3. **Bloqueador concreto de isolamento no E2E.** `startBackend()` inicia um filho e aceita qualquer resposta 200 em `localhost:8082/actuator/health`, sem recusar porta já ocupada ou observar a falha do processo filho. Se outra API URIP estiver em 8082, o teste pode usar a saúde desse serviço e enviar os seus POST/PUT a ele, embora tenha criado outro banco temporário. Isso invalida evidências de isolamento e pode alterar uma instância alheia ao teste. O fetch de saúde não possui timeout próprio; `stopBackend()` também espera indefinidamente por exit.

## Correções mínimas

- Recusar porta 8082 ocupada antes de criar o backend; não matar ou reutilizar o serviço existente.
- Observar erro de spawn e `exitCode` do filho durante a espera, com fetch de saúde de tempo limitado.
- Encerrar apenas o processo criado pelo teste, com prazo e fallback de término. Incluir teste de porta ocupada/recusa se o harness for extraído de forma testável.
- Manter as asserções fortes de ID/contador/voto após restart; não resolver falhas relaxando a persistência.
- Adicionar regressão que retenha ocorrência crítica antiga depois de 1001 leituras de outro grupo e o limite exato de 90 s, conforme Backend.
- Publicar fonte sem `node_modules`, `.tools`, bancos, `.env` real, logs ou dados de instalação. Incluir apenas exemplos de ambiente e evidências sanitizadas.
- Matriz requisito → implementação → teste/evidência → estado, e CI com diagnósticos/artefatos. Nomes/RMs preenchidos conforme resposta do usuário.

## Veredito

**4,2/5 — corrigir antes de incorporar/publicar.** Bloqueador de código desta área: isolamento do processo E2E. Configuração Android e ausência do remoto reforçam o risco de entrega. A nota é da prontidão da alteração para uma entrega acadêmica, não certificação de produção.

A reavaliação deverá examinar as correções e as execuções atuais. A aprovação do candidato pode anteceder a publicação para evitar bloqueio circular; a integridade da árvore publicada e o CI remoto precisam ser conferidos depois.
