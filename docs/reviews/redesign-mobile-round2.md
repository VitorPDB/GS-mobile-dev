# Parecer Mobile e Experiência — URIP, rodada 2

## 1. Escopo e evidência
Passagem independente sobre o bloqueador da rodada 1 e regressões das correções, sem editar o projeto. Examinei com view_image as recapturas web urip-desktop-feed.png, urip-compact-feed.png (390 px), urip-small-feed.png (320 px) e urip-compact-panorama.png. Reli DESIGN.md, implementação do Panorama em mobile/App.tsx, Icon.tsx e os trechos relevantes de mobile/e2e/application.spec.ts. O responsável informou typecheck aprovado, dois E2E aprovados em 30,4 s, reinício real da API com ID preservado e exportação Android Hermes aprovada. Li as asserções pertinentes; não executei novamente esses comandos. Screenshots continuam sendo WEB, não evidência de dispositivo Android.

## 2. Usabilidade
O bloqueador foi resolvido: abaixo de 1200 px existe agora Panorama expansível no início, antes dos filtros. A captura de 390 px mostra seis ocorrências em atenção no acionador e, ao abrir, dois de três em cada um dos três riscos. Os valores vêm do mesmo conjunto de alertas por prioridade, conforme código; não são números decorativos. A posição inicial torna a síntese localizável sem exigir percorrer nove publicações. O recolhimento preserva a leitura de feed. DESIGN.md descreve corretamente essa mudança.

O desktop mantém o painel lateral e sua composição anterior. As capturas compactas preservam duas abas superiores, atualização no cabeçalho, conexão e aviso acadêmico. A amostra de 320 px continua sem overflow global observável; o filtro Energia mantém o recorte horizontal local já registrado na rodada 1. Não observei regressão de composição causada pelo wrapper dos ícones.

## 3. Acessibilidade
O acionador do Panorama tem minHeight 48, role de botão, nome explícito e estado expanded; os dados expandidos são texto legível com rótulos por risco. Entendi e Tentar agora recebem nomes explícitos, e o wrapper dos ícones recebe aria-hidden, evitando incorporar glifos decorativos ao nome acessível na web. Permanecem os contrastes calculados na rodada 1 e as gravidades expressas em palavras, sem dependência de cor.

O teste recebido cobre foco programático na aba Atividade seguido de Enter e presença do histórico. Isso comprova ativação por Enter nesse caminho, mas não certifica Tab/Shift+Tab, foco visível de todos os controles ou leitura por TalkBack. Fontes e capturas não substituem validação nativa de safe areas, escala 1,3 e gesto Voltar. Essas limitações devem acompanhar qualquer apresentação do resultado como compatibilidade Android; a exportação Hermes valida empacotamento, não experiência em dispositivo. A paleta fixa clara é decisão explícita e permanece válida com preferência de sistema escura.

## 4. Falhas
Não restam bloqueadores observados nesta passagem para incorporar o redesign ao protótipo acadêmico. O desaparecimento do Panorama foi corrigido e documentado.

Duas melhorias menores permanecem: o Panorama aberto repete o título logo abaixo do acionador; o filtro Energia cortado em 320 px poderia ter indicação de continuidade mais clara. Nenhuma impede entender os três riscos ou executar as ações principais. Não exigem rebuild nem nova rodada antes da incorporação.

Limitações de certificação: não há captura Android nativa, fonte 1,3 ou ensaio TalkBack; o teste de teclado cobre uma ativação, sem auditoria integral da sequência de foco. São limites de evidência declarados, não defeitos de execução comprovados.

## 5. Veredito
Nota: **4,6/5**. Disposition: **ship**, para incorporar o redesign ao protótipo acadêmico e demonstrá-lo na web. O limiar de 4,5 foi atingido após resolver o bloqueador concreto da rodada 1. O parecer não certifica execução nativa Android; essa afirmação depende de instalação e captura em emulador/dispositivo. Não foram modificadas fontes do projeto.
