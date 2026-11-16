# Conselho — Backend e Dados — rodada 2

Nota final da revisão das fontes: **4,7 / 5,0 — aprovado** para o protótipo acadêmico local.

## Correções conferidas

- Comparação de duração agora usa `compareTo(Duration.ofMinutes(30)) <= 0`, sem truncar segundos. Teste distingue 1800 de 1801 segundos.
- O simulador usa um timestamp comum para nove leituras e chama `MonitoringService.ingestBatch(...)`. A transação pública no serviço é chamada pelo proxy entre beans; chamadas internas a `ingest` participam da transação já aberta. Isso resolve a rodada parcial identificada anteriormente.
- A explicação agora demonstra base, incremento por elevação e total. O teste confirma o texto de 90 + 5 = 95.
- O log de validação registra quatro testes sem falhas/erros após as mudanças.

## Ressalva de verificação operacional

O arquivo `work/backend-validation.log` inspecionado nesta rodada termina em **BUILD FAILURE** na etapa `spring-boot:repackage`: não conseguiu renomear o JAR para `.jar.original`. Isso é compatível com bloqueio de arquivo de um processo Java ainda usando o JAR no Windows, não com falha de compilação/teste. Avisei o responsável. É necessário parar o processo e repetir o empacotamento antes de afirmar que o pacote final foi validado; esta nota aprova as fontes e não transforma o log de empacotamento em sucesso.

Mantêm-se os limites explicitados na rodada 1: mil leituras na janela global, sem certificação de PostgreSQL/Docker, carga ou produção. Esses limites estão descritos no README e não impedem o cenário acadêmico local.
