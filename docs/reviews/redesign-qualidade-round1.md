# Conselho — Qualidade e Operação — redesign URIP

Data: 16/11/2026. Candidato: `work/redesign`, comparado à versão aplicada em `outputs/vigia-urbana`.

**Nota: 4,7/5 — aprovado para o protótipo acadêmico e o impacto deste redesign.**

## Escopo

Revisei o hook de monitoramento, validação e cache, testes unitários e E2E, configuração Playwright, servidor de preview, CI e instruções de execução. A mudança solicitada é de interface e marca, com remoção da página de conexão. O backend continua o mesmo; não há novo comportamento de persistência ou análise a certificar nesta alteração.

## Evidências

- Executei independentemente `node node_modules/typescript/bin/tsc --noEmit`: passou sem erros.
- Executei independentemente `node --import tsx tests/sync.test.ts`: seis testes, zero falhas. Cobrem dados corrompidos, validação da URL, avisos sem duplicar, leitura antiga, falha de rede e recuperação.
- Inspecionei o E2E final e `mobile/test-results/.last-run.json`: `status: passed`, sem testes falhos. O coordenador confirmou dois cenários aprovados em 30,4 s. Não executei novamente esse E2E nesta revisão.
- O E2E inicia frontend próprio em 8091 e API real em 8082, com CORS explícito e banco novo por execução, preservado no restart interno. O roteamento do Playwright muda apenas o host HTTP; não fornece JSON falso.
- Há asserts para a ausência de Conexão e de caixas de configuração, ignorar endereço legado, filtros, análise, aviso, cache após reload offline, reconexão e sobrevivência de um ID de leitura/contador.
- O segundo cenário cobre 390 e 320 px sem overflow do documento, Panorama expansível, ativação da aba pelo teclado, preferência escura mantendo a paleta clara solicitada e primeiro acesso sem cache.
- O bundle Android final existe em `dist-android`; o coordenador confirmou export Hermes após as correções (640 módulos, 1,8 MB). Isso não equivale a execução nativa.

## Correções e operação

A primeira execução revelou um nome acessível incluindo o glifo do botão Entendi; o rótulo explícito e o wrapper de ícone oculto foram aplicados. O Panorama agora permanece disponível nas larguras compactas, e o E2E o abre para conferir seu conteúdo. Não encontrei bloqueador remanescente nesses fluxos.

O hook remove a configuração interativa e ignora a antiga chave de endereço, mas mantém cache por servidor, timeout, retry automático, cancelamento e validação. O README explica `EXPO_PUBLIC_API_URL` antes de iniciar o Expo no Android físico e a necessidade de reiniciar/reexportar após mudanças. O preview não reutiliza silenciosamente o frontend antigo de 8081 nos testes.

## Limites da aprovação

Não certifiquei instalação Android, TalkBack, fonte nativa ampliada, Docker/PostgreSQL, CI remoto, carga ou produção. A configuração por ambiente não recebeu um teste de build separado com endereço não padrão nesta revisão; o caminho está documentado e é compatível com a configuração pública já utilizada. O relatório de validação deve preservar essas distinções e registrar os novos screenshots e testes do redesign.

## Veredito

**Aprovado, 4,7/5.** As verificações e a documentação são proporcionais ao protótipo acadêmico local. Nenhuma alteração foi feita por este revisor nas fontes do candidato.
