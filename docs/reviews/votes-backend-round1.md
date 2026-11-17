# Conselho — Backend e Dados — reações v1.2 — rodada 1

**Nota: 4,7/5 — aprovado para o protótipo acadêmico.**

## Escopo e evidência

Revisei Reaction, ReactionRepository, ReactionService, ReactionController, integração no dashboard/analisador, CORS, tratamento de conflitos, ReactionTest e README. Conferi work/reactions-backend.log: Maven verify terminou BUILD SUCCESS, nove testes, zero falhas/erros. Não executei uma segunda bateria independente nem certifico E2E, execução nativa Android, Docker/PostgreSQL ou migração em ambiente real.

## Avaliação

- Persistência tem unicidade por ocorrência (risco+bairro) e UUID de instalação, além de versão otimista. Tentativas concorrentes de criação não duplicam o mesmo voto; conflitos são tratados como 409 e há teste de concorrência.
- PUT representa o estado desejado LIKE/DISLIKE/NONE. Repetir o mesmo voto ativo é idempotente, trocar atualiza a linha e retirar remove a linha. Nenhum contador fornecido pelo cliente é aceito.
- Janela de 24 horas é aplicada na consulta; o mesmo risco/bairro mantém votos entre leituras do simulador. Expiração, renovação após expirar e preservação entre novas leituras estão cobertas. Limpeza horária é transacional e a retenção de até cerca de 25 h está declarada.
- Agregação faz contagens agrupadas para as chaves exibidas, com busca adicional apenas do voto do cliente; evita consultas por cada publicação. UUID não é exposto no dashboard. Resposta usa no-store para o estado personalizado.
- Confiança é calculada no servidor por (base × 4 + likes) / (4 + likes + dislikes), preservando medida, severidade e ordenação físicas. Os testes cobrem aumento, redução, limites e manutenção do nível crítico apesar de muitos dislikes.
- Validação de UUID/enum obrigatórios, leitura inexistente/antiga, CORS de PUT e campos de ingestão separados estão adequados. Votação pública é explicitamente distinta da ingestão protegida por chave.

## Limites não bloqueadores

A identidade é pseudônima e não autenticada: outro UUID permite outro voto. O README declara ausência de antifraude/rate limiting robusto e não promete uma pessoa por voto. Isso é adequado ao protótipo local, não a confiança operacional real. As consultas de totais e voto próprio usam READ_COMMITTED e podem refletir instantes ligeiramente diferentes sob alterações concorrentes; o polling corrige a visão. Para publicação em escala, usar autenticação/controle de abuso, índices orientados à carga e leitura agregada consistente.

O bloqueio de todas as ações em leitura antiga também impede retirar um voto enquanto não houver leitura recente; é uma decisão documentada, mas vale permitir retirada independente da idade em uma evolução. Nenhum desses pontos impede a incorporação no escopo acadêmico declarado.

## Veredito

**Aprovado, 4,7/5.** Sem bloqueador de Backend e Dados nesta rodada. A incorporação continua dependendo dos outros quatro membros e dos testes finais de integração.
