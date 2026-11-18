# Conselho de desenvolvimento

Regra solicitada pelo usuário: incorporar somente quando **todos os cinco membros** avaliarem com nota **≥4,5 de 5**. Cada membro é um agente separado, com área própria e parecer independente. Nenhuma média substitui uma reprovação.

O desenvolvimento ocorre numa cópia candidata. Os pareceres não são certificações de produção, funcionamento nativo não testado ou nota acadêmica garantida.

| Membro | Rodada 1 | Rodada 2 | Estado |
|---|---:|---:|---|
| Produto e requisitos | 4,6 | — | Aprovado para protótipo |
| Backend e dados | 4,5 | 4,7 | Aprovado após refinamentos |
| Análise e privacidade | 4,4 | 4,7 | Aprovado após correções |
| Mobile e experiência | 4,4 | 4,6 | Aprovado após correção |
| Qualidade e operação | 4,4 | 4,7 | Aprovado após correções e E2E |

## Correções exigidas na versão inicial

- Análise: mostrar base + incremento = pontuação; corrigir arredondamento da janela de 30 minutos e testar seus limites.
- Backend: transação atômica por rodada do simulador; repetição do pacote após liberar o JAR em uso no Windows.
- Mobile/Qualidade: rejeitar leituras e alertas malformados antes de renderizar; testar cache com leitura nula e valores inválidos.
- Qualidade: tornar E2E reproduzível com preview automático, usar API isolada também no cenário compacto e comprovar leitura persistida após reiniciar.
- Produto: finalizar instruções de validação e registro do conselho.

Pareceres integrais incluídos em `reviews/`. Todos os cinco membros atingiram o mínimo: **incorporação aprovada**. Versão promovida para `main` somente após o último parecer. A falha temporária de empacotamento citada nos pareceres técnicos foi resolvida e Maven verify terminou com BUILD SUCCESS; veja `VALIDACAO.md`. Limitações nativas e de infraestrutura permanecem declaradas no relatório de validação.

## Redesign v1.1 — incorporação aprovada

Pedido: branco/creme/preto, feed inspirado no Instagram, marca Urban Risk Intelligence Platform / URIP, remoção da página Conexão. Candidato desenvolvido isoladamente em relação à versão em execução.

| Membro | Rodada 1 | Rodada 2 | Estado |
|---|---:|---:|---|
| Produto e requisitos | 4,7 | — | Aprovado |
| Backend e dados | 4,7 | — | Aprovado; backend intacto |
| Análise e privacidade | 4,7 | — | Aprovado |
| Mobile e experiência | 4,3 | 4,6 | Aprovado após correção do Panorama compacto |
| Qualidade e operação | 4,7 | — | Aprovado após testes |

O membro Mobile exigiu Panorama abaixo de 1200 px; corrigido com seção expansível no início do feed. O E2E revelou glifo no nome acessível de Entendi; corrigido com rótulos explícitos e wrapper de ícone oculto da árvore de acessibilidade. Passagem final Mobile: **ship**, restrita à correção e às regressões examinadas.

Todos os cinco atingiram ≥4,5. A versão v1.1 foi incorporada somente depois da última aprovação. Pareceres completos: `reviews/redesign-*.md`. A validação cobre web e exportação Hermes; não certifica execução nativa Android.

## Votação v1.2 — incorporação aprovada

Pedido: likes/dislikes com contadores que alterem diretamente a confiança e assinatura URIP em maiúsculas.

| Membro | Rodada 1 | Rodada 2 | Estado |
|---|---:|---:|---|
| Produto e requisitos | 4,7 | — | Aprovado |
| Backend e dados | 4,7 | 4,7 | Aprovado, incluindo escrita síncrona H2 |
| Análise e privacidade | 4,7 | — | Aprovado |
| Mobile e experiência | 4,4 | 4,7 | Aprovado após recaptura dos controles em 320/390 px |
| Qualidade e operação | 4,3 | 4,7 | Aprovado após correção de persistência e E2E |

O E2E identificou perda de gravação recente no encerramento abrupto com o buffer padrão H2. Corrigido com WRITE_DELAY=0 na execução local e no teste, sem relaxar as asserções. Nova execução preservou leitura, ID e voto. O membro Mobile exigiu evidência da faixa de reações no celular; novas capturas comprovaram os controles, a confiança e a análise.

Todos os membros ≥4,5; incorporação autorizada somente após o último parecer. Pareceres integrais em reviews/votes-*.md. O veredito Mobile ship cobre a alteração inspecionada e a demonstração web, não QA nativo Android.

## Auditoria para entrega no GitHub — 17/11/2026

Antes de editar, foram considerados três grupos de riscos: entrega/publicação incompleta, configuração/validação Android e integridade/reprodutibilidade. Os cinco membros analisaram o candidato antes das correções; nenhuma nota da primeira rodada autorizava publicação.

| Membro | Rodada 1 | Rodada 2 | Estado do candidato |
|---|---:|---:|---|
| Produto e requisitos | 4,1 | 4,7 | Aprovado para incorporar/publicar |
| Backend e dados | 4,3 | 4,7 | Aprovado após cobertura e tempo exato |
| Mobile e experiência | 4,2 | 4,7 | Aprovado após configuração Android |
| Análise e privacidade | 4,3 | 4,6 | Aprovado com risco upstream explícito |
| Qualidade e operação | 4,2 | 4,7 | Aprovado após isolamento do E2E |

Todas as áreas atingiram o mínimo de 4,5 antes da incorporação/publicação. Pareceres em reviews/delivery-*.md. Essa aprovação não certifica aparelho Android, contribuições individuais, execução remota ainda não observada nem segurança de produção. O estado final do GitHub/CI deve ser conferido após publicar.
