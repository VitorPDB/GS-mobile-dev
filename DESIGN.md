# Interface do URIP

A interface usa um feed de ocorrências, com fundo branco, superfícies creme e texto preto. A marca é Urban Risk Intelligence Platform, abreviada como URIP.

## Layout

A coluna de leitura tem largura máxima de 600 dp. Telas amplas apresentam navegação e panorama nas laterais; no celular, há duas abas (Feed e Atividade) e um panorama expansível. Filtros circulares permitem selecionar o risco.

Cada publicação apresenta bairro, medida, unidade, gravidade, origem, confiança, orientação e análise expansível. Likes e dislikes mostram contadores, seleção e estado de envio. A votação fica indisponível sem conexão ou quando a leitura está antiga.

## Cores e acessibilidade

| Uso | Cor |
|---|---|
| Papel | #FFFFFF |
| Creme | #F7F5F0 |
| Pedra | #EFEBE3 |
| Superfície de destaque | #E6E1D7 |
| Texto principal | #171715 |
| Texto secundário | #65625B |

A hierarquia usa tipografia, alinhamento, divisórias e espaçamento. A gravidade sempre tem descrição textual. Controles têm alvos de pelo menos 48 dp, rótulos acessíveis, safe areas e suporte ao tamanho de fonte do sistema.

Os dados simulados e a idade das leituras ficam identificados. A API é configurada por EXPO_PUBLIC_API_URL; o app reconecta automaticamente e preserva o último conteúdo disponível.