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

## Correções exigidas

- Análise: mostrar base + incremento = pontuação; corrigir arredondamento da janela de 30 minutos e testar seus limites.
- Backend: transação atômica por rodada do simulador; repetição do pacote após liberar o JAR em uso no Windows.
- Mobile/Qualidade: rejeitar leituras e alertas malformados antes de renderizar; testar cache com leitura nula e valores inválidos.
- Qualidade: tornar E2E reproduzível com preview automático, usar API isolada também no cenário compacto e comprovar leitura persistida após reiniciar.
- Produto: finalizar instruções de validação e registro do conselho.

Pareceres integrais incluídos em `reviews/`. Todos os cinco membros atingiram o mínimo: **incorporação aprovada**. Versão promovida para `main` somente após o último parecer. A falha temporária de empacotamento citada nos pareceres técnicos foi resolvida e Maven verify terminou com BUILD SUCCESS; veja `VALIDACAO.md`. Limitações nativas e de infraestrutura permanecem declaradas no relatório de validação.
