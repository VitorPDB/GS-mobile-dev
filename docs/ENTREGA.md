# URIP — conferência da entrega

Esta matriz compara o enunciado com o código. Exportar um bundle Android não significa testar em aparelho; testes com dados simulados não medem acurácia no mundo real.

| Requisito | Implementação | Evidência / estado |
|---|---|---|
| Receber sensores, bases e comunidade | `SourceType`, simulador e `POST /api/readings` | Três categorias simuladas, validadas e persistidas |
| Persistir dados | Spring Data JPA, H2 em arquivo e opção PostgreSQL | Testes de repositório/API; E2E preserva leitura e voto após reiniciar |
| API REST priorizada | `MonitoringService` + `RiskAnalyzer` | Ordenação por pontuação; análise por intensidade e tendência |
| Origem e confiança | Fonte, base e fórmula de confiança retornadas pela API | Detalhes do feed; likes/dislikes não reduzem a gravidade física |
| React Native consumindo API | Expo, TypeScript e componentes nativos | TypeScript, testes e exportações web/Android |
| Painel de acompanhamento | Panorama lateral ou expansível | E2E desktop e larguras compactas |
| Lista ou mapa | Feed com filtros por risco | Atende pela alternativa lista |
| Notificações de alerta | Avisos acessíveis no app aberto | E2E de mudança de gravidade; sem push ou segundo plano |
| Interface simples e acessível | Rótulos, contraste, alvos de toque e navegação | Web/teclado verificados; TalkBack e fonte ampliada nativa pendentes |
| Arquitetura em camadas | API → serviço → repositório → banco | Código separado e testes de integração |
| IA ou análise | Regras explicáveis e tendência comparável | Atende por análise; não há modelo treinado |
| Escalabilidade | Índices por risco/bairro/fonte e histórico limitado a 30 registros | Último estado de cada grupo não depende da quantidade de outros grupos; teste com 1001 leituras de outro grupo |
| Disponibilidade | Cache, timeout, retry, recuperação e escrita H2 sem atraso intencional | E2E derruba processo real; não há cluster de alta disponibilidade |
| Proteção de dados | Sem nome/GPS no app; UUID pseudônimo e retenção de votos | Regras e limitações documentadas; ambientes e bancos locais excluídos da publicação |
| Código completo no mesmo GitHub | Pastas `backend/` e `mobile/` | Código organizado em um único repositório local; publicação pendente |
| README com integrantes e RMs | Três integrantes identificados | Dados fornecidos pelo grupo |
| Evolução por commits da equipe | Deve refletir contribuição real | Histórico de desenvolvimento e participação do grupo a conferir antes da entrega |
| Demonstração API + app | Roteiro de execução e de queda/reconexão | Ensaio e vídeo final são responsabilidade do grupo |

## Indicadores

- **Tempo de atualização:** o simulador produz a cada 12 s e o app consulta a cada 5 s; o E2E observa uma atualização automática e anexa o intervalo medido. A latência HTTP aparece no app e é diferente da frequência de geração.
- **Qualidade dos alertas:** testes de limiares, tendências, fontes, votos e leituras antigas. Não há alegação de precisão, recall ou taxa de acerto real.
- **Facilidade de uso:** filtros, análise expansível, estados offline e teclado verificados no navegador. Testes com moradores/agentes e validação nativa continuam pendentes.

## Antes de entregar

1. Executar e registrar o [teste em Android](TESTE-ANDROID.md).
2. Conferir o histórico de desenvolvimento do grupo no GitHub.
3. Ensaiar e gravar a API funcionando, queda do backend e reconexão automática.
4. Conferir os resultados do workflow e o risco transitivo descrito em [SECURITY.md](../SECURITY.md).
