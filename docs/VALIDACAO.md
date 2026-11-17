# Validação

**Versão atual v1.1:** veja [REDESIGN.md](REDESIGN.md) para os testes e capturas do novo feed. O registro abaixo documenta a versão inicial e suas limitações.

Data: 16/11/2026. Ambiente local: Windows, JDK Temurin 21.0.13, Maven 3.9.11, Node 24.16.0. Revisões automatizadas por agentes independentes não substituem avaliação do professor nem teste em dispositivos reais.

| Verificação | Evidência |
|---|---|
| Backend | Maven `verify`: BUILD SUCCESS, 4 testes, zero falhas/erros |
| Regras | Três riscos, limites críticos, confiança independente, staleness, tendência, janela exata em 30m e 30m1s e decomposição numérica da pontuação |
| API | Saúde, ingestão protegida, valor/horário/campos inválidos, CORS e indisponibilidade do endpoint demo quando desabilitado |
| TypeScript | `tsc --noEmit` passou |
| Sincronização | 6 testes passaram: cache, leituras/alertas corrompidos, URLs, avisos sem duplicar, envelhecimento e falha/recuperação |
| Dependências Expo | `expo install --check` passou, SDK 58 / React Native 0.88.1 |
| Auditoria npm | Zero vulnerabilidades reportadas após correções; não é garantia de ausência de vulnerabilidades |
| Exportação web | Bundle de produção gerado; uma fonte de ícones, importação direta |
| Android | Bundle Hermes gerado; instalação e execução nativa ainda não verificadas |
| E2E final | Dois cenários passaram (35,6 s), Brave/Chromium headless, preview automático e API isolada; sem servidores externos necessários |

## O que o teste de ponta a ponta verifica

API real em processo isolado e banco H2 em arquivo; frontend consumindo dados via HTTP; filtros, detalhes de origem/confiança; aviso por mudança de gravidade; encerramento real do backend; preservação dos dados após recarregar a página; reconexão automática; histórico. A versão final comparou total persistido e um ID de leitura antes/depois do restart; ambos foram preservados. Cada execução usou um banco novo, mantendo o mesmo banco apenas durante o reinício interno. A API em 8080 não é requisito dos testes.

O segundo cenário verifica largura de 390 px, tema escuro, ausência de overflow horizontal do documento e conexão a um servidor indisponível sem cache prévio. O scroll horizontal dos filtros é intencional.

## Capturas

- `images/desktop-online.png`: navegador Windows, conexão ativa e detalhe de alerta.
- `images/desktop-offline.png`: navegador Windows, últimos dados salvos após queda e recarga.
- `images/compact-dark-web.png`: navegador em largura compacta e tema escuro.
- `images/compact-first-offline-web.png`: primeiro acesso a servidor indisponível.

As capturas compactas **são web**, não capturas Android. Não foram executados testes em aparelho/emulador Android, TalkBack, fonte ampliada nativa, APK assinado, Docker/PostgreSQL, carga ou alta disponibilidade. Docker Desktop e dispositivo Android não estavam disponíveis para essas verificações. O CI foi escrito, mas ainda não executado em GitHub Actions.

## Antes da apresentação

Instalar Expo Go compatível com SDK 58 e repetir no Android: navegação, tamanho de fonte aumentado, tema claro/escuro, teclado na configuração, queda da API, cache após fechar/reabrir, reconexão e orientação de rede. Se escolher PostgreSQL, executar o mesmo roteiro com Docker Compose. Preencher integrantes/RMs e registrar contribuições reais no GitHub.

As fontes públicas e comunitárias são simuladas. Não houve validação de acurácia ou teste de usabilidade com moradores. A versão oferece avisos em primeiro plano; push não está incluído.

## Correções encontradas na revisão

O conselho exigiu decomposição da pontuação, janela exata da tendência, rejeição de cache corrompido e reprodução autônoma dos testes. Na repetição E2E, um banco de teste reutilizado já continha o estado crítico, invalidando a premissa de mudança de gravidade; o harness passou a criar um banco isolado por execução. A execução final passou com essas correções.
