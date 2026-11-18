# Verificação do projeto

Última execução local registrada: 17/11/2026, Windows, Java 21, Maven 3.9 e Node 24. Os resultados abaixo são da execução anterior à limpeza da documentação.

| Verificação | Resultado |
|---|---|
| Backend Maven verify | 12 testes, zero falhas/erros |
| TypeScript | Sem erros |
| Cliente e infraestrutura de testes | 11 testes, zero falhas |
| Expo Doctor | 20 de 20 verificações |
| Configuração Android | Plugins e manifesto verificados; HTTP local permitido e backup desabilitado |
| Exportações web e Android Hermes | Concluídas |
| E2E no navegador com API real | 2 cenários passaram em 38,3 s |
| Atualização automática observada | Intervalo de 11.871 ms; simulador configurado para 12 s |

Os comandos para reproduzir as verificações estão no README. Os resultados estruturados e os relatórios ficam em evidence/.

## Cobertura

Backend: limites dos três riscos, tendência comparável, confiança e votação, validação de entrada, chave de ingestão, CORS, envelhecimento das leituras e última ocorrência por risco/bairro após mais de mil leituras de outro grupo.

Cliente: validação de respostas, cache, identidade de instalação, falha de rede e recuperação. A infraestrutura de E2E verifica porta ocupada e falha de inicialização do processo.

E2E: filtros e detalhes, aviso por mudança de gravidade, votos compartilhados e mudança da confiança, atualização automática, encerramento e reinício da API, consulta offline, recarga com cache e persistência de leitura/voto no banco. Cada execução usa um banco novo, mantido durante o reinício interno. As capturas em images/ são do navegador, incluindo larguras compactas.

## Pendências

- Instalação e execução em Android, TalkBack e fonte ampliada nativa: seguir TESTE-ANDROID.md.
- Execução com PostgreSQL/Docker e resultado remoto do GitHub Actions.
- Testes de carga e disponibilidade em múltiplas instâncias.
- Validação de usabilidade e dos limiares com usuários e especialistas.

O bundle Hermes não comprova execução em aparelho. Os dados são simulados e os testes não medem acurácia real. Avisos funcionam no app aberto; não há push em segundo plano. O risco de dependência conhecido está descrito em ../SECURITY.md.