# Conselho — Produto e Requisitos — auditoria de entrega, rodada 1

Data: 17/11/2026. Revisão anterior às melhorias. Candidato: `work/delivery-audit`, comparado ao enunciado e ao estado remoto informado pela consulta do coordenador.

## Escopo e evidências

Examinei README.md, docs/VALIDACAO.md, docs/CONSELHO.md e mobile/App.tsx. O coordenador comprovou que `VitorPDB/GS-mobile-dev` está vazio: tamanho zero, contents retornando repositório vazio e ausência de commits. Não tratei os arquivos locais como se já estivessem publicados.

O produto local tem recorte coerente: Spring Boot e React Native no mesmo projeto, três riscos simulados, painel, lista priorizada, histórico, origem/confiança, análise explicável, reações e recuperação de conexão. Lista satisfaz a alternativa “lista ou mapa”; análise satisfaz “IA ou análise”; sensores simulados são permitidos. Avisos em primeiro plano são explicitamente descritos, sem alegar push. Não há motivo de produto para exigir mapa, modelo treinado ou fontes oficiais nesta versão.

## Três pontos ruins antes de agir

### 1. A entrega pública não contém o trabalho

**Bloqueador de entrega.** O avaliador que abrir o link fornecido não encontrará código, instruções, testes ou histórico. A existência de uma cópia funcional no computador não satisfaz a exigência de repositório no GitHub.

**Correção mínima:** preparar um conjunto limpo com backend, mobile, scripts, configuração e documentação; submeter o candidato ao conselho; publicar a versão aprovada e verificar arquivos, branch e CI no remoto. Excluir .tools, node_modules, bancos, logs, .env real e artefatos pesados. A publicação é uma etapa final, depois da aprovação do conteúdo; não há necessidade de exigir que o candidato já esteja publicado para autorizar sua publicação.

### 2. Identificação e contribuição da equipe estão incompletas

**Bloqueador documental:** README ainda tem “A preencher pela equipe”. O usuário já forneceu os dados necessários: Lucas Zolla Assis — RM557952; Lucas Baraldi Rodrigues — RM555407; Vitor Pantarotto de Brito — RM554961.

**Pendência acadêmica real:** o histórico técnico examinado foi produzido por Codex. Isso demonstra evolução assistida, mas não comprova contribuições individuais dos integrantes, como o enunciado pede.

**Correção mínima:** preencher os três integrantes e manter declaração honesta sobre assistência. Adicionar orientação de contribuição com tarefas reais para cada integrante executar e registrar com sua própria conta. Não fabricar autores, commits retroativos, revisão humana ou trabalho individual. Se não houver contribuições reais até a entrega, declarar essa pendência no relatório final; documentação não a transforma em requisito atendido.

### 3. Evidência da versão atual está espalhada e pode ser confundida com certificação

**Bloqueador para anunciar “pronto para entregar”.** docs/VALIDACAO.md mistura um registro inicial de quatro testes com links para versões posteriores. Há comandos de verificação e relatos históricos, mas falta uma matriz atual que permita ao professor identificar cada requisito e o que foi efetivamente executado no candidato.

O README declara corretamente que Android físico, acessibilidade nativa e usabilidade com moradores não foram comprovados. Essas limitações devem permanecer visíveis. O bundle Hermes e screenshots em largura compacta não demonstram funcionamento em aparelho Android. O CI remoto ainda não foi executado em um repositório vazio.

**Correção mínima:** criar relatório atual de entrega com requisito, implementação, evidência e estado (“verificado”, “implementado mas pendente de teste” ou “pendente”). Registrar comandos/resultados/versão dos novos testes, separar histórico anterior, incluir checklist de apresentação com API ativa, queda e reconexão e checklist de Android real. Nos indicadores, usar tempo de atualização e latência realmente medidos; qualidade dos alertas por cenários conhecidos; facilidade de uso como tarefa manual a validar, sem inventar pesquisa ou acurácia.

## O que falta e o que não deve ser prometido

- Falta publicar o conjunto aprovado no GitHub e conferir a execução remota do CI.
- Falta completar a identificação no README; os dados agora estão disponíveis.
- Falta produzir um retrato atual e rastreável da validação e da entrega.
- Continua pendente executar o roteiro no Android real e registrar as contribuições reais da equipe. O coordenador pode melhorar os procedimentos e a configuração, mas não deve marcar essas ações humanas como concluídas sem evidência.
- Não prometer nota do professor, alta disponibilidade de produção, antifraude, alertas oficiais, push em segundo plano ou validação de usabilidade não executada.

## Veredito

**Nota do estado atual de entrega: 4,1/5 — fix.** O núcleo do protótipo parece aderente; os bloqueadores são entrega, identificação e evidência. A nota não invalida as revisões técnicas históricas, mas elas também não certificam um repositório vazio.

Após as correções documentais e a validação atual do candidato, a área de Produto pode aprovar seu conteúdo para publicação (mínimo 4,5), condicionando apenas a verificação final de que o conteúdo aprovado chegou ao remoto. Isso evita transformar a regra “aprovar antes de publicar” em um bloqueio circular. Pendências de Android real e contribuição humana devem continuar explícitas e não impedem uma avaliação honesta do candidato acadêmico para publicação.
