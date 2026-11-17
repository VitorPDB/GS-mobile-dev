# Conselho — Backend e Dados — reações v1.2 — rodada 2

**Nota: 4,7/5 — aprovado no escopo de Backend e Dados.**

## Alteração examinada

A URL H2 local padrão em application.yml e a URL do banco isolado do E2E agora incluem WRITE_DELAY=0. O parâmetro não é acrescentado às URLs PostgreSQL fornecidas por DB_URL. Nenhuma regra Java de votos/confiança foi alterada nesta rodada.

## Fundamentação

A documentação oficial H2 define WRITE_DELAY como o atraso máximo entre commit e gravação do log, informa padrão de 500 ms e admite o parâmetro zero na própria URL. A configuração é pertinente ao cenário em que o teste encerra abruptamente o processo imediatamente após um voto confirmado. Ela remove o atraso intencional de gravação; o teste mantém as mesmas asserções de persistência, sem mascarar a falha com espera artificial ou relaxamento.

Referência: [H2 — SET WRITE_DELAY](https://h2database.com/html/commands.html#set_write_delay). Não se afirma garantia absoluta contra falha de energia/hardware: a própria documentação distingue essas condições da configuração de flush.

## Evidência e limites

Conferi work/reactions-backend.log atualizado: BUILD SUCCESS, nove testes sem falhas ou erros, empacotamento concluído. Esses testes validam regras/concorrência e não substituem o novo E2E em arquivo; a confirmação final de sobrevivência ao encerramento real pertence à execução de integração e ao membro Qualidade.

A contrapartida é mais trabalho de I/O por commit. Para o protótipo local e o volume de nove leituras a cada 12 s, a escolha é adequada. Uma URL H2 personalizada por DB_URL deverá incluir o parâmetro se quiser o mesmo comportamento; PostgreSQL continua com sua própria configuração de durabilidade.

## Veredito

**Mantida aprovação: 4,7/5.** A correção de configuração é apropriada, sem novo bloqueador nesta área. Mantêm-se os limites de anonimato/antifraude e de ambientes não executados do parecer anterior. A incorporação exige concluir o E2E final e as demais aprovações.
