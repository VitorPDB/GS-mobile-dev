# URIP v1.2 — votos e confiança

Marca URIP em maiúsculas em desktop e celular. Reações de like (heart) e dislike (thumb-down) sob cada publicação, com contadores compartilhados, seleção, envio, falha e estado desabilitado offline/em leitura antiga. Clicar no mesmo tipo retira; clicar no outro troca.

## Regra

Confiança = (base da fonte × 4 + likes) / (4 + likes + dislikes). Base em fração: sensor 0,90, base pública 0,80 e comunidade 0,55. Para sensor: zero votos 90%; um like 92%; um dislike 72%; dois likes 93,33% (93% na UI). Sem votos mantém a base. Detalhe do post mostra origem, base e fórmula.

Votos ativos das últimas 24 h por risco+bairro, compartilhados entre leituras, com no máximo um por UUID de instalação. O servidor calcula os contadores; não aceita contadores enviados pelo app. Repetir PUT com o mesmo voto é idempotente. Constraint única e versão de linha protegem contra duplicação/perda em concorrência; conflitos retornam 409. Seleção persiste após recarregar.

Gravidade física, pontuação e ordenação por prioridade não mudam com reações. É um índice demonstrativo de fonte+apoio comunitário, não probabilidade, acurácia ou certificação da leitura. Não há login ou garantia de uma pessoa por voto; múltiplas instalações/UUIDs permitem manipulação. Não usar para decisão real sem validação e antifraude.

## Dados e retenção

UUID aleatório ExpoCrypto salvo localmente. Banco guarda UUID pseudônimo, chave de risco/bairro, voto e horário. Não coleta nome, GPS ou telefone. Não expõe UUIDs nos dashboards. Votos deixam de contar em 24 h e limpeza horária remove expirados (até aproximadamente 25 h de retenção). Sem armazenamento local, desabilita voto; não cria identidades descartáveis em cada ação. Não há fila offline. Cache separado por servidor e instalação, respostas personalizadas no-store.

## Verificação

Consulte [VALIDACAO.md](VALIDACAO.md) para os resultados e limites dos testes.
