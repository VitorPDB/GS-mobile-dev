# Conselho — Qualidade e Operação — votação — rodada 2

## Escopo e evidências

Reavaliação do bloqueador de persistência da rodada 1 e das verificações finais do candidato work/reactions. Não houve edição de fontes por este revisor.

- Conferi WRITE_DELAY=0 tanto na URL H2 local quanto na URL E2E.
- Maven verify confirmou BUILD SUCCESS: nove testes, zero falhas/erros; nova execução após o ajuste.
- Executei independentemente TypeScript e os dois arquivos de testes com node --import tsx: nove testes passaram, zero falhas.
- Conferi mobile/test-results/.last-run.json: passed, failedTests vazio. O coordenador confirmou saída final: dois E2E passaram em 34,0 s (19,1 s e 2,1 s).
- Coordenador confirmou exportação Hermes final de 648 módulos e 1,8 MB. Não instalei nem executei Android nativo.

## Correção do bloqueador

**Resolvido.** A janela de flush do log H2 foi removida para a execução local/teste. A asserção de persistência não foi enfraquecida: após encerrar e reiniciar a API real, o total não diminuiu, o ID distintivo continuou presente, o like permaneceu no banco e a instalação manteve seleção.

O ajuste é apropriado ao protótipo e à demonstração de encerramento abrupto, sem prometer durabilidade irrestrita de hardware.

## Cobertura e operação

O E2E ampliado demonstrou like → 92%, troca para dislike → 72%, retirada, recarga e restauração, votação desabilitada offline e restart com dados persistidos. Um segundo perfil de navegador adicionou outro like, elevou o contador compartilhado para dois e confiança para 93%; o primeiro perfil observou a alteração, e a retirada no segundo restaurou o contador para um. Não são contadores isolados no navegador.

Contratos e validação cobrem enums, UUID, contadores e porcentagens válidas; PUT é idempotente e unicidade/versão otimista protegem contra duplicação simples. Timeout/falha de voto não é exibido como sucesso. O hook invalida polling em voo ao mutar, evita novas consultas durante a escrita e reabilita os controles após obter a atualização. Cache fica separado por instalação/servidor. Falha de armazenamento preserva consulta e desabilita votação.

## Limites da aprovação

Sem certificação de Android em aparelho/emulador, TalkBack, Docker/PostgreSQL, carga ou CI remoto. Identidade pseudônima não autentica uma pessoa; múltiplos UUID podem manipular votação, limitação corretamente documentada. Esses limites são compatíveis com o escopo acadêmico e não são aprovação para uso operacional de emergência.

## Veredito

**4,7/5 — aprovado.** O bloqueador da rodada 1 foi resolvido e as evidências finais sustentam a incorporação do protótipo.
