# Parecer Mobile e Experiência — URIP, rodada 1

## 1. Escopo e evidência
Revisão independente, sem editar fontes, da implementação em work/redesign. Li DESIGN.md, PRODUCT.md, mobile/App.tsx e os componentes AlertRow, FeedFilters, Icon, theme, useMonitoring e sync. Consultei craft-floor.md e android.md. Examinei com view_image urip-desktop-feed.png, urip-desktop-analysis.png, urip-compact-feed.png (390 px), urip-small-feed.png (320 px) e redesign-before.png. Todas são capturas WEB: não demonstram execução Android. Não rodei detector, navegador, TalkBack nem teclado; o launcher/detector não forneceu evidência nesta rodada. Paleta clara fixa e inspiração no feed são decisões aprovadas e não são reabertas.

## 2. Usabilidade
A mudança tem direção reconhecível: leitura central, filtros circulares, identidade do bairro e publicação com medida, legenda e análise. A composição abandona os grandes recipientes de dashboard do antes. A referência ao Instagram ajuda na sequência de leitura sem introduzir likes ou ações sociais fictícias. O significado permanece urbano e acadêmico.

A hierarquia dá precedência ao bairro, gravidade e medida. Fonte/confiança e orientação estão junto da ocorrência; a conta explicável abre no mesmo contexto. Dois destinos são adequados à dimensão do protótipo: abas superiores no compacto e navegação lateral no expandido, sem página Conexão. Não cabe exigir uma barra inferior de três destinos quando o produto tem somente dois.

As capturas de 390 e 320 px mostram texto principal legível e nenhuma rolagem horizontal global. Em 320 px, Energia aparece parcial no carrossel: affordance aceitável de conteúdo rolável, embora a legenda parcial diminua a descoberta. O feed é deliberadamente alto: no celular a explicação fica abaixo da primeira dobra, algo compatível com a direção solicitada. O controle de atualização é consistente e o estado de conexão permanece visível. Cache, erro recuperável, reconexão e marca de leitura antiga aparecem preservados no código; esse parecer não substitui os testes dessas transições.

## 3. Acessibilidade
Gravidade não depende de cor: Crítico/Alto/Moderado/Baixo e prioridade numérica acompanham os tons. Os ícones decorativos estão ocultos da árvore acessível; atualização, abas, filtros e análise possuem rótulos e estados. Há role de botão, estado selecionado/expandido/desabilitado e anúncios de avisos. Os controles revisados têm altura de 48 dp ou maior: atualizar 48, abas 52/54, análise e tentativas 48, filtros com círculo de 62 mais legenda. Não tratar o avatar não interativo de 44 dp como falha de alvo.

Contrastes calculados a partir dos tokens, sem inferir pixels: #65625B contra branco 6,08:1; creme 5,58:1; pedra 5,12:1; superfície mais escura 4,67:1. O texto secundário nominal atende 4,5:1 nessas superfícies. O texto branco nos badges escuros tem margem alta. Linhas divisórias claras são decorativas; a seleção do filtro também recebe anel preto e peso, a aba recebe sublinhado.

SafeAreaProvider/SafeAreaView e escalonamento padrão de Text são sinais positivos no código. Não certifico comportamento em fonte 1,3, barras do sistema, TalkBack ou gesto Voltar com base em imagens web. Não há formulário/entrada de texto nesta interface; logo não existe fluxo de IME a validar. Em Windows ainda é necessário observar Tab/Shift+Tab, foco visível, ativação por Enter/Espaço e manutenção do foco ao abrir a análise. A semântica está presente, mas não prova esse comportamento.

## 4. Falhas
Bloqueador de incorporação nesta rodada, proporcional ao protótipo: abaixo de 1200 px o Panorama desaparece. DESIGN.md afirma que panorama e contexto vão ao final do feed em telas menores; App.tsx renderiza o Panorama exclusivamente dentro de showAside, enquanto mobileProvenance inclui somente o contexto. O usuário de Android perde a síntese por risco disponível no desktop. Extrair/reutilizar o Panorama e renderizá-lo também ao final abaixo de 1200 px resolve sem mudar a direção aprovada.

Pendências de evidência, sem confundir com defeitos observados: evidenciar teclado Windows e captura compacta de análise/Atividade; para afirmar compatibilidade Android, instalar e capturar dispositivo/emulador, incluindo fonte 1,3 e insets. A falta dessas capturas limita a certificação nativa, mas não exige reconstruir o protótipo.

Melhoria menor: em 320 px, o último filtro fica cortado sem indicador de rolagem. O recorte do círculo já sugere continuidade; ainda assim, preservar um trecho mais reconhecível de Energia ou mostrar indicador discreto melhoraria descoberta. Não é bloqueador.

## 5. Veredito
Nota: **4,3/5**. Disposition: **fix**. Aprovável esteticamente e coerente com o feed solicitado, mas ainda não elegível à incorporação pelo limiar de 4,5. Corrigir o desaparecimento do Panorama no compacto e reapresentar a evidência correspondente. Certificação Android permanece pendente de captura nativa; não há evidência que justifique rebuild. Não foram modificadas fontes do projeto.
