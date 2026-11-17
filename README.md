# Urban Risk Intelligence Platform — URIP

Urban Risk Intelligence Platform acadêmica. Java/Spring Boot + React Native/Expo no mesmo repositório. Monitora **alagamentos, calor extremo e falta de energia** em três bairros fictícios. Sensores, bases públicas e relatos comunitários são **simulados**, inclusive quando enviados pela API. Não há integração com fontes oficiais.

## Executar no Windows

Requisitos: Node.js 24, JDK 21 e Maven 3.9+. Caso não tenha Java/Maven, execute o instalador portátil abaixo; ele baixa ferramentas oficiais para `.tools/` e verifica checksums. Não modifica o Java instalado.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Setup-Windows.ps1
```

Em um terminal na raiz:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Start-Backend.ps1
```

Em outro terminal:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Start-App.ps1
```

Abra http://localhost:8081. API: http://localhost:8080/api/dashboard. Saúde: http://localhost:8080/actuator/health. O primeiro início do backend e do app baixa dependências. O modo local usa H2 **em arquivo** na pasta `backend/data/`, que preserva leituras ao reiniciar. Não execute dois backends usando o mesmo arquivo.

Alternativa com JDK/Maven já instalados: `cd backend` e `mvn spring-boot:run`; para o app: `cd mobile`, `npm ci`, `npm run web`. Use um terminal novo para cada processo.

## Android

Instale a versão do Expo Go compatível com o SDK 58 em https://expo.dev/go (selecione Android e SDK 58). Na pasta `mobile`, execute `npm start` e escaneie o QR code pelo Expo Go. Celular e computador devem estar na mesma rede. Antes de iniciar o Expo, defina `$env:EXPO_PUBLIC_API_URL='http://IP-DO-COMPUTADOR:8080'`; use `ipconfig` no Windows para consultar o IPv4. Permita a porta 8080 no firewall apenas na rede privada usada para a apresentação. Redes de universidade podem bloquear comunicação entre aparelhos.

No Android Emulator, o endereço padrão é `http://10.0.2.2:8080`. Com um emulador já aberto e o Android SDK configurado, use `npm run android`. O app usa componentes React Native reais, safe areas, paleta clara branco/creme e preto e tamanho de fonte do sistema. A versão web serve à demonstração no Windows; não é um executável nativo de Windows.

HTTP é permitido para desenvolvimento local no Android. Antes de publicar fora da rede local, use HTTPS e gere uma build apropriada. Não há APK assinado incluído. `npx expo export --platform android` verifica o bundle JavaScript, mas não substitui instalação e teste em aparelho.

## PostgreSQL / Docker

Com Docker Desktop instalado, na raiz execute `docker compose up --build`. Ele inicia PostgreSQL com volume persistente e backend em 8080. O app continua sendo iniciado separadamente. Para a demonstração, pare apenas o backend com `docker compose stop backend` e recupere com `docker compose start backend`. `docker compose down` preserva o volume; não use `-v` se quiser preservar os dados.

Copie `.env.example` para `.env` se precisar alterar parâmetros do backend. O app usa `mobile/.env` a partir de `mobile/.env.example` para o endereço da API, sem página de conexão. Variáveis EXPO_PUBLIC são incorporadas no bundle: reinicie o Expo ou exporte novamente após alterá-las. Endereços salvos pela antiga página de conexão são ignorados. Os valores padrão são exclusivos de desenvolvimento. No modo sem Docker, variáveis podem ser definidas no PowerShell antes de iniciar o backend, por exemplo `$env:DEMO_ENABLED='false'`. Com o modo demo desligado é obrigatório definir `INGEST_TOKEN` diferente do padrão. Fontes continuam marcadas como simuladas, pois esta versão é um protótipo.

## Demonstração sugerida

1. Inicie backend e app. Confirme **Conectado**, três riscos, horários e atualização das leituras a cada 12 segundos.
2. Abra um alerta. Explique medida, origem, confiança, pontuação, tendência e orientação. Use filtros e a aba Atividade.
3. Pare o backend com Ctrl+C no terminal dele (ou `docker compose stop backend`). Não pare o servidor Expo.
4. Em até cerca de 10 segundos, veja **Sem conexão**. Navegue pelos últimos dados, ainda disponíveis. Após 90 segundos sem novas leituras, elas aparecem como antigas. Atualização automática não apaga o cache ao falhar.
5. Recarregue o app com backend parado para mostrar persistência local (desde que o servidor Expo ainda esteja disponível). Um primeiro acesso sem cache mostra um estado vazio explicativo.
6. Reinicie o backend. O app reconecta automaticamente e recebe dados novos. Não precisa fechar o aplicativo.
7. Para demonstrar mudança de gravidade, envie a leitura abaixo e observe o aviso no app aberto. O simulador pode sobrescrever a leitura na rodada seguinte de 12 s. Avisos são **dentro do app em primeiro plano**, sem push ou execução em segundo plano. Se a avaliação exigir push, esse é um requisito adicional a implementar.

```powershell
$headers = @{ 'X-Ingest-Token' = 'local-demo-only' }
$body = @{ type='HEAT'; source='PUBLIC_DATA'; district='Vila Esperança'; value=42 } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:8080/api/readings -Method Post -Headers $headers -ContentType 'application/json' -Body $body
```

## API

| Método | Rota | Uso |
|---|---|---|
| GET | `/api/dashboard` | Alertas priorizados, 30 leituras recentes, horário do servidor, total persistido |
| POST | `/api/readings` | Ingestão de leitura simulada; exige `X-Ingest-Token` |
| POST | `/api/demo/tick` | Gera imediatamente nove leituras; exige chave e modo demo ativo |
| GET | `/actuator/health` | Disponibilidade |

Tipos: `FLOOD`, `HEAT`, `OUTAGE`. Fontes: `SENSOR`, `PUBLIC_DATA`, `COMMUNITY`. Corpo: `type`, `source`, `district` (até 60 caracteres), `value` numérico e `observedAt` ISO-8601 opcional. Valores aceitos: chuva 0–300 mm/h, temperatura 0–65 °C, interrupção 0–10080 min. Horário deve estar nas últimas 24 h, com tolerância futura de 30 s. Sem horário, usa o do servidor. Confiança é atribuída pelo servidor e não pode ser escolhida no payload.

## Análise explicável

Recurso de **análise**, atendendo à alternativa “IA ou análise” do enunciado. Não é um modelo treinado nem uma previsão validada. Faixas demonstrativas:

| Risco | Moderado (35 pontos) | Alto (65 pontos) | Crítico (90 pontos) |
|---|---|---|---|
| Chuva | ≥10 mm/h | ≥30 mm/h | ≥50 mm/h |
| Calor | ≥30 °C | ≥35 °C | ≥40 °C |
| Falta de energia | ≥15 min | ≥60 min | ≥120 min |

Abaixo da primeira faixa: 10 pontos, baixo. Tendência crescente adiciona 5 pontos (limite 100), comparando a leitura anterior da mesma fonte, risco e bairro nos últimos 30 minutos. Variação deve superar 0,5 °C ou 2 unidades para os outros riscos. A lista usa a pontuação decrescente e desempate estável. Valores antigos continuam visíveis e marcados; não são prova de risco atual.

Confiança fixa da categoria: sensor 90%, base pública 80%, comunidade 55%. **Não é probabilidade de ocorrência nem acurácia medida.** A confiança não reduz a gravidade física de um relato. Calibração desses valores e dos limiares com especialistas é necessária para uso real. Chuva é um indicador demonstrativo; sem drenagem, relevo e nível da água não determina alagamento real.

## Arquitetura, proteção e limites

`api → service → repository → database`, com domínio separado. App: interface, hook de sincronização, cliente/validação e cache versionado por servidor. API de escrita protegida por chave; ela não é embarcada no app, que apenas consulta dados públicos simulados. CORS permite origens explícitas, não autentica clientes. No navegador usando outro host/porta, ajuste `CORS_ORIGINS` e reinicie o backend. No app nativo não se aplica CORS.

Nenhum nome, GPS, telefone ou identificador pessoal é necessário. Banco guarda bairro fictício, medida, tipo, fonte e horário. App salva endereço da API e último snapshot no armazenamento local, sem criptografia por não conter dados pessoais ou credenciais. Leituras com mais de sete dias são removidas periodicamente. Não envie dados pessoais nos campos livres.

Consulta e análise limitam-se às últimas **1000 leituras** (cerca de 22 minutos no simulador), para conter o custo no protótipo. Um bairro sem leitura nessa janela pode deixar a visão geral. Não é garantia de cobertura histórica. Até 30 leituras são devolvidas como histórico. Para uso em escala, materializar o estado por bairro/risco, paginar histórico, usar migrações versionadas e índices compostos, limitar ingestão, autenticar produtores por identidade, validar fontes, configurar HTTPS, backups e monitoramento. O simulador deve rodar em instância única; múltiplas réplicas exigiriam um produtor externo/coordenado. Não se promete alta disponibilidade com uma única instância.

## Verificar

Backend: `mvn -B -f backend/pom.xml verify` ou `scripts/Start-Backend.ps1 -Test`.

Na pasta `mobile`:

```powershell
npm ci
npx expo install --check
npm run typecheck
npm test
npm run build:web
npx expo export --platform android --output-dir dist-android
```

Os testes cobrem limiares, tendência, confiança, leitura antiga, validação, chave de ingestão, CORS, cache, falha de rede e reconexão. O relatório em `docs/VALIDACAO.md` distingue execução comprovada de verificações ainda manuais. O CI roda verificações das duas stacks em pushes e pull requests.

### Teste completo no navegador (E2E)

Com JDK 21 disponível e o JAR gerado por `mvn -B -f backend/pom.xml package`, na pasta `mobile`:

```powershell
npm ci
npm run build:web
npx playwright install chromium
npm run test:e2e
```

O Playwright inicia o preview web automaticamente em 8091 e uma API própria em 8082, usando uma pasta `data/e2e-*` nova por execução como banco (preservada no reinício interno). **Não precisa iniciar o backend em 8080.** Reserve as portas 8091/8082 e não use um backend manual na porta 8082. O teste desliga e reinicia apenas a API que ele mesmo criou. A porta 8091 deve estar livre. O teste redireciona apenas o host das chamadas HTTP do app para a API real em 8082. Nenhuma resposta JSON é simulada pelo Playwright. A API de teste é encerrada ao terminar.

Se o Java 21 não estiver no PATH, defina `$env:TEST_JAVA='C:\caminho\jdk-21\bin\java.exe'`. O instalador portátil cria esse executável dentro de `.tools/jdk/`. Opcionalmente, para usar um Chromium já instalado em vez do download do Playwright, defina `$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE='C:\caminho\navegador.exe'`.

Há um override transitivo de `@expo/fingerprint → minimatch` para a versão 11 corrigida. Expo CLI, resolução de dependências, exportação web e Hermes foram verificados com essa combinação. Reavalie o override ao atualizar o Expo.

Indicadores: latência da resposta medida no app; horário da última sincronização; atualização simulada a cada 12 s e consulta a cada 5 s. Qualidade dos alertas é demonstrada por testes dos cenários/limiares, **sem alegar acurácia real**. Facilidade de uso precisa ser validada com usuários; não há pesquisa inventada.

## Conselho e equipe

As revisões dos cinco membros e o critério mínimo de 4,5 para todos ficam em `docs/CONSELHO.md`. Código em revisão é candidato até passar por todos.

**Preencher antes da entrega:**

| Integrante | RM |
|---|---|
| A preencher pela equipe | A preencher |

O repositório inclui histórico técnico gerado durante a construção assistida. Ele **não substitui commits reais dos integrantes** ao longo do desenvolvimento. A equipe deve compreender, adaptar e registrar sua contribuição antes de entregar. Não há publicação automática no GitHub.
