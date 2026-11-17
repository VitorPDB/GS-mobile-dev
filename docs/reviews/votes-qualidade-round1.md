# Conselho — Qualidade e Operação — votação — rodada 1

## Escopo e evidências

Revisão da versão candidata em work/reactions, alteração de likes/dislikes, confiança e marca URIP. Inspecionados hook, transporte/validação, identidade, testes de integração e E2E, serviço de reações e documentação. Log Maven confirma BUILD SUCCESS, nove testes, zero falhas/erros.

## Bloqueador

O E2E final observado em mobile/test-results/.last-run.json está **failed**. A asserção de persistência mostrou 10 leituras antes do encerramento e apenas 9 depois. O teste usa kill abrupto logo após os commits e H2 está configurado sem WRITE_DELAY explícito. O padrão H2 de 500 ms entre commit e flush explica a perda observada; deve ser removida essa janela para a demonstração de restart abrupto. Não afrouxar a asserção.

Recomendação: acrescentar WRITE_DELAY=0 à URL H2 local e do E2E, repetir Maven e E2E mantendo as verificações de leitura e voto persistidos. A documentação oficial confirma o ajuste em [SET WRITE_DELAY](https://h2database.com/html/commands.html#set_write_delay). Isso reduz a janela de escrita do log; não equivale a certificação de durabilidade de hardware.

## Pontos adequados

- PUT idempotente, UUID persistente e unicidade do banco evitam duplicação simples; versão otimista identifica concorrência.
- Fórmula no servidor, contadores validados e gravidade separada.
- Cache por instalação/servidor, respostas no-store e votação desabilitada offline.
- Hook invalida polling em voo ao mutar e só reabilita controles após a atualização.
- Testes cobrem troca/retirada, expiração, leitura antiga, falha HTTP, identidade e concorrência.

## Recomendações sem bloqueio

Acrescentar um cenário de duas instalações com votos compartilhados reforçaria a prova de agregação. Limites de identidade não autenticada e ausência de antifraude estão corretamente documentados.

## Veredito

**4,3/5 — reprovado nesta rodada (fix).** Aguardar correção de persistência e E2E final aprovado. Android nativo, Docker/PostgreSQL e CI remoto não foram certificados.
