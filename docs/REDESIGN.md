# URIP v1.1 — redesign aplicado

Nome exibido: Urban Risk Intelligence Platform, assinatura urip. Fundo branco, blocos em creme/pedra e preto/grafite. Paleta clara fixa, inclusive quando o sistema prefere modo escuro, conforme solicitação.

Feed de ocorrências em coluna, filtros circulares por risco e publicações com medida, unidade, bairro, gravidade textual, fonte, confiança, recomendação e análise expansível. Desktop amplo inclui panorama lateral; telas menores têm panorama expansível no início. Duas abas: Feed e Atividade. Página Conexão removida.

Configuração da API apenas por EXPO_PUBLIC_API_URL no ambiente ou mobile/.env. Valores padrão: localhost:8080 no web e 10.0.2.2:8080 no emulador Android. No aparelho físico definir o IPv4 do computador antes de iniciar Expo. A configuração antiga salva no dispositivo é ignorada, mantendo cache por URL e reconexão.

## Evidências executadas

- 15 arquivos do backend idênticos por SHA-256 à versão anterior; API e banco em execução preservados.
- TypeScript sem erros; seis testes unitários passando, conferidos também por Qualidade.
- Dois testes E2E passaram em 30,4 s: filtros, marca, ausência de Conexão/textbox, análise, notificação, API realmente desligada e reiniciada, cache após reload e ID persistido; compacto 390/320 px, preferência escura com paleta clara, panorama expansível, Enter na navegação e primeiro acesso sem cache.
- Build web de produção e exportação Android Hermes (640 módulos, 1,8 MB) passaram.
- Capturas web em images/urip-desktop-feed.png, urip-desktop-analysis.png, urip-desktop-offline.png, urip-compact-feed.png, urip-compact-panorama.png, urip-small-feed.png e urip-compact-empty.png.

Capturas compactas não são capturas de Android. QA nativo Android, TalkBack, fonte ampliada nativa, Docker/PostgreSQL e CI remoto continuam sem execução. O backend não foi recompilado nesta alteração porque suas fontes não mudaram; foi reutilizado o artefato aprovado.

## Conselho

Produto 4,7; Backend 4,7; Análise 4,7; Mobile 4,6; Qualidade 4,7. Aprovação de todas as áreas no escopo de protótipo acadêmico. Pareceres e histórico em CONSELHO.md.
