# Conselho — Produto e Requisitos — auditoria de entrega, rodada 2

Data: 17/11/2026. Escopo: aprovação do conteúdo candidato para incorporação e publicação, ainda sujeita à conferência final do remoto pelo coordenador.

## Evidências examinadas

Revisei README.md atualizado, docs/ENTREGA.md, docs/AUDITORIA-ENTREGA.md, docs/TESTE-ANDROID.md, docs/CONTRIBUICOES.md, SECURITY.md e a evidência `docs/evidence/automatic-update-timing.json`. Não executei a aplicação nesta passagem; os resultados técnicos são relatados pelo coordenador e permanecem no escopo de Qualidade e das áreas técnicas.

## Correções da primeira rodada

| Problema | Resultado |
|---|---|
| Repositório vazio não contém o projeto | **Conteúdo pronto para publicação.** O candidato reúne as duas stacks, configuração, instruções, testes e documentação. A matriz não afirma que já estão no GitHub; o coordenador verificará a publicação e o CI remoto depois da aprovação. |
| Integrantes/RMs em branco | **Resolvido.** README identifica Lucas Zolla Assis — 557952, Lucas Baraldi Rodrigues — 555407 e Vitor Pantarotto de Brito — 554961, conforme informação do usuário. |
| Histórico assistido confundido com contribuição real | **Tratado de forma honesta.** A contribuição individual continua marcada pendente; CONTRIBUICOES.md orienta alterações reais e seus commits, sem fabricar autores nem participação. |
| Evidências dispersas e versões antigas confundidas com validação atual | **Resolvido para esta entrega candidata.** AUDITORIA-ENTREGA.md reúne o ponto de partida, os três riscos, mudanças, resultados atuais e pendências. ENTREGA.md liga cada requisito a implementação/evidência/estado. |
| Android e indicadores sem prova suficiente | **Limites explícitos.** Doctor/introspecção/bundle não são apresentados como execução em aparelho. TESTE-ANDROID.md está não executado e descreve o roteiro. O intervalo de atualização medido foi 11.871 ms entre leituras, distinto da latência HTTP e sem alegação de acurácia ou pesquisa de usabilidade. |

## Aderência ao enunciado

O recorte atende às alternativas permitidas: sensores simulados, lista em vez de mapa e análise explicável em vez de modelo treinado. Mantém arquitetura em camadas, persistência, REST priorizada, fonte/confiança, painel, histórico, avisos em primeiro plano e tratamento de indisponibilidade. A documentação oferece execução das duas stacks e roteiro com queda e reconexão.

Os limites de escalabilidade e disponibilidade são proporcionais ao protótipo e explícitos. O aviso transitivo de dependências está documentado em SECURITY.md; testes/Doctor aprovados não são apresentados como ausência de vulnerabilidades ou prontidão de produção. Não há necessidade de exigir funcionalidade adicional de produto para corrigir os três problemas desta revisão.

## Pendências que permanecem reais

- Confirmar que o conteúdo aprovado chegou ao GitHub e conferir o resultado do workflow remoto. Criar jobs não é prova de execução.
- Executar e registrar o roteiro em Android real/emulador, inclusive TalkBack e fonte ampliada.
- Registrar contribuições verdadeiras de cada integrante e realizar a gravação/ensaio final.
- Acompanhar o risco transitivo sem correção, sem prometer segurança de produção.

Essas pendências impedem anunciar que todos os atos acadêmicos e testes de dispositivo foram concluídos. Não impedem aprovar este conteúdo candidato para publicação, mantendo a informação fiel ao seu estado.

## Veredito

**Nota: 4,7/5 — aprovado para incorporação e publicação do candidato acadêmico.** Os bloqueadores documentais da primeira rodada foram resolvidos ou transformados em pendências explícitas que exigem ação humana/externa. A verificação final de GitHub/CI pertence ao coordenador e não foi antecipada neste parecer.

Refinamento editorial sem bloqueio: na matriz, “1001 leituras concorrentes no histórico” pode ser simplificado para “1001 leituras de outro grupo”, evitando que o leitor interprete como teste de execução simultânea se a regressão se refere ao volume do histórico.
