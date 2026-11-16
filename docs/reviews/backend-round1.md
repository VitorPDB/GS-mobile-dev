# Conselho — Backend e Dados — rodada 1

Nota: **4,5 / 5,0 — aprovado para o protótipo acadêmico descrito**.

Escopo: revisão estática do backend, testes, configuração e instruções do candidato. Conferido relatório Surefire com quatro testes, sem falhas ou erros. Não executei PostgreSQL/Docker nem ensaio de carga; a nota não certifica esses ambientes ou produção.

## Evidências

- Camadas API, serviço, repositório e domínio separadas; API REST consumível com dados de três riscos.
- Persistência JPA com H2 em arquivo por padrão e configuração PostgreSQL via ambiente/Compose. Ordenação por horário e ID torna a escolha da leitura mais recente determinística.
- DTO de entrada valida tipos, fonte, bairro e presença de valor. Serviço rejeita números não finitos, limites incompatíveis e horários fora da janela.
- Escrita exige chave, comparação usa `MessageDigest.isEqual`; chave não é necessária no app de consulta. Fora do modo demo, início falha com chave padrão/vazia. CORS usa origens explícitas e apenas health é exposto no Actuator.
- Confiança e origem chegam do servidor; simulação é declarada. Análise mantém gravidade de relatos com baixa confiança, explica limites e marca leituras antigas.
- Testes demonstram ingestão, rejeição sem chave, rejeição de valor/horário/bairro inválidos, CORS, limiar crítico, tendência e obsolescência.

## Observações não bloqueadoras

1. `Duration.between(...).toMinutes() <= 30` trunca segundos e aceita até 30m59s como histórico comparável. Preferível comparar a duração com `Duration.ofMinutes(30)` para corresponder exatamente ao README.
2. O agendamento e seed chamam `tick()` internamente; a anotação `@Transactional` de `tick` não torna essas chamadas atômicas por causa da autoinvocação Spring. Cada `service.ingest` ainda persiste em sua própria transação; o dashboard pode ver uma rodada parcial. Para uma rodada coerente, separar serviço transacional de geração/persistência em lote.
3. A janela global de mil leituras pode eliminar da visão um bairro sem dados recentes; o limite e a consequência estão explicitados no README. Para escala ou cobertura completa, materializar estado por risco/bairro.
4. Há abstrações mínimas e entidades mutáveis expostas na resposta de histórico; não há migrações versionadas, autenticação por produtor ou rate limiting. O README distingue corretamente esses pontos de uma arquitetura de produção.

Não encontrei bloqueador de incorporação no escopo acadêmico local. Recomendo registrar separadamente a verificação real de recuperação e persistência após reinício e não anunciar PostgreSQL como testado sem execução desse caminho.
