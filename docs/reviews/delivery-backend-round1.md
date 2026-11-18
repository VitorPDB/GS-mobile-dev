# Conselho — Backend e Dados — auditoria pré-entrega, rodada 1

Escopo: candidato `work/delivery-audit`, comparado aos requisitos acadêmicos fornecidos. O coordenador comprovou que o repositório GitHub informado está vazio. Esta revisão é de fontes, testes e documentação; não executei outra instância nem alterei código.

## O que já atende

Spring Boot com domínio/API/serviço/repositório separados; persistência H2 em arquivo; alternativa PostgreSQL via Compose; ingestão validada e protegida por chave; API priorizada; três riscos simulados; origem e confiança explícitas; análise por intensidade e tendência explicada numericamente; confiança comunitária separada da gravidade; retenção; CORS explícito e respostas personalizadas no-store. Os nove testes existentes cobrem boa parte do fluxo HTTP e de votos, inclusive concorrência e expiração.

## Três pontos ruins e correções mínimas

### 1. Uma ocorrência silenciosa desaparece da visão geral quando outro grupo gera 1000 leituras — bloqueador

`MonitoringService.dashboard` começa em `findTop1000ByOrderByObservedAtDescIdDesc`, depois agrupa apenas esse subconjunto. Uma ocorrência crítica de um bairro que deixa de atualizar pode desaparecer inteiramente, em vez de permanecer visível como antiga. Exemplo determinístico: uma leitura crítica de FLOOD no bairro A, seguida por 1001 leituras HEAT no bairro B; a leitura A ainda existe no banco, mas o dashboard passa a devolver apenas B. O README admite a limitação, porém ela enfraquece justamente a transparência durante falhas de fonte.

Correção mínima: obter o último registro por risco+bairro independentemente da janela global do histórico; manter histórico em consulta limitada de 30 linhas; buscar a leitura anterior comparável da mesma fonte, com índice composto adequado. Adicionar teste de integração que insira a ocorrência crítica antiga mais 1001 leituras de outro grupo e confirme que ela continua presente, marcada como antiga e corretamente priorizada. Não é necessário introduzir infraestrutura distribuída.

### 2. A API marca leitura antiga apenas ao completar 91 segundos — ajuste de consistência

`RiskAnalyzer` usa `Duration.between(...).getSeconds() > 90`, que trunca a parte fracionária. Em 90,5 s, a API ainda informa `stale=false`, enquanto `ReactionService` já rejeita voto com comparação exata `isAfter(observedAt.plusSeconds(90))`. O frontend atualmente recompõe a idade em milissegundos e reduz o impacto, mas outros consumidores da API recebem estados inconsistentes.

Correção mínima: usar a mesma comparação exata de `Instant` no analisador e testar 90 s e 90 s + 1 ms. Não alterar o limite nem a gravidade por idade.

### 3. PostgreSQL está configurado, mas não tem evidência executada nem job no CI — não bloqueia o MVP com H2

Os testes usam H2 (`backend/src/test/resources/application.yml`) e o workflow tem apenas esse caminho. A aplicação promete uma alternativa PostgreSQL e usa UUID, índices, agrupamentos e versionamento que merecem validação no segundo banco. A documentação é honesta ao registrar que Docker/PostgreSQL não foram executados.

Melhoria proporcional: adicionar job de backend com serviço PostgreSQL no CI, sobrescrevendo `SPRING_DATASOURCE_URL`, usuário e senha, e guardar relatórios de teste. Só marcar a alternativa como validada depois de o job passar. Se não houver execução disponível, manter a pendência explícita; PostgreSQL não é uma exigência específica do enunciado.

## Veredito

**Nota: 4,3/5 — corrigir antes de incorporar/publicar como versão revisada.** O bloqueador é a cobertura do dashboard quando o volume de outro grupo cresce. O ajuste temporal deve acompanhar a correção. A lacuna PostgreSQL é melhoria de evidência, não motivo para exigir produção ou reescrever o projeto. Não certifico Android nativo, Docker ou CI remoto nesta rodada.
