# Conselho — Backend e Dados — redesign URIP, rodada 1

**Nota: 4,7/5 — aprovado no escopo da alteração.**

## Escopo

Revisão do candidato `work/redesign` contra a versão aplicada `outputs/vigia-urbana`, para o pedido de feed em branco/creme/preto, marca Urban Risk Intelligence Platform / urip e remoção da página de conexão. Não é uma nova certificação de produção.

## Evidências examinadas

- Comparei independentemente os hashes de **15 arquivos de fonte e configuração do backend**; todos permanecem idênticos à versão aprovada.
- O contrato de `GET /api/dashboard`, ingestão, persistência, origem/confiança e análise não foi alterado.
- `useMonitoring.ts` agora usa `EXPO_PUBLIC_API_URL` ou o endereço padrão da plataforma. A antiga configuração persistida de endereço não é lida, de modo que remover a página não deixa um endpoint antigo prendendo o app.
- Cache permanece separado pela URL normalizada e reaproveita o formato existente; validação completa do payload, retry de 5 segundos, timeout, cancelamento e proteção contra respostas obsoletas permanecem.
- O README orienta a configuração da API em Android físico por variável de ambiente e documenta o caráter incorporado no bundle; o emulador conserva `10.0.2.2:8080`.
- O E2E candidato direciona o host para uma API real isolada em 8082, configura CORS para o preview em 8091 e preserva a verificação de restart e leitura persistida. Verifica também que um endereço legado não prevalece sobre a configuração atual. Não executei o E2E nesta revisão; o resultado cabe à área de Qualidade.

## Avaliação

A remoção da configuração de servidor da interface não altera a arquitetura ou API e simplifica a operação do app. A escolha técnica continua disponível no ambiente de desenvolvimento, sem credenciais embarcadas. Não identifiquei regressão bloqueadora em Backend e Dados.

## Limites

A aprovação cobre o impacto do redesign no protótipo acadêmico local. Não certifica instalação nativa Android, PostgreSQL/Docker, execução remota do CI, carga ou alta disponibilidade. Não houve necessidade de repetir testes do backend sem alterações de fontes; a aprovação anterior e a comparação byte a byte sustentam este escopo.
