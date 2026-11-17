# Mobile e Experiência — reactions, rodada 1

## Escopo e evidência

Revisão independente do delta de likes/dislikes e marca URIP em `work/reactions`, sem editar fontes. Consultei PRODUCT.md, DESIGN.md, craft-floor.md, android.md e os fontes App.tsx, AlertRow.tsx, useMonitoring.ts, sync.ts e identity.ts. Inspecionei com view_image urip-reactions-like.png, urip-desktop-feed.png, urip-compact-feed.png e urip-small-feed.png. O launcher de contexto foi tentado e falhou por engine/cache indisponível; contexto lido diretamente. Nenhum detector rodou. Plataforma registrada: Android; este parecer usa inspeção de código nativo e renders WEB e não certifica execução Android, TalkBack, fonte ampliada ou gestos do sistema. Typecheck, nove unitários e nove testes backend foram informados pelo coordenador; não os reexecutei. E2E em andamento não foi contado como aprovado nesta avaliação.

## Usabilidade

A identidade creme/branco/preto e a coluna de feed estão preservadas. URIP aparece em caixa alta no rail e no topo compacto, com assinatura legível. A faixa de reações é reconhecível, fica junto do conteúdo a que pertence e não disputa com a medida nem com o nome da gravidade. Heart preenchido, superfície creme e contador 1 tornam inequívoco o like selecionado no render desktop. A evidência mostra confiança 90% sem votos e 92% com um like, coerente com a fórmula solicitada. Base da fonte, confiança combinada, janela de 24 h e ressalva sobre probabilidade estão presentes nos detalhes. Toggle remove e ação oposta troca no handler. Não há fluxo de cadastro novo.

O topo compacto usa navegação familiar e filtros horizontais; a última opção parcialmente visível em 320 sugere rolagem, sem alargar o documento. A leitura dos posts mantém hierarquia e orientação. Porém as duas capturas compactas terminam antes da faixa de ações: demonstram o shell e a publicação, mas não a composição móvel da feature revisada.

## Acessibilidade

A implementação oferece botões reais, rótulos por título/bairro, valor acessível com a contagem, selected e aria-pressed; não depende apenas de cor para seleção. Os alvos das reações medem no mínimo 64 × 48 dp, separados por 12 dp, atendendo ao mínimo Android. A análise tem expanded e rótulo contextual; gravidade permanece textual. Texto secundário da paleta fixa é suficientemente escuro nos fundos claros empregados. Estado pendente tem ActivityIndicator com rótulo, e ações ficam desabilitadas durante envio. SafeAreaProvider/SafeAreaView e escala padrão do Text permanecem no código.

Sem leitura real por TalkBack ou imagem Android, não afirmo anúncios de alteração, foco nativo ou escala 1,3 comprovados. Isso é limite da evidência, não justificativa para mudar a direção visual fixada.

## Falhas e recuperação

Erros de envio aparecem no post com papel alert e instrução de conferir conexão ou atualizar/tentar novamente. Há timeout de 5 s; a seleção não é inventada antes da confirmação. Cache por servidor e instalação, UUID Expo Crypto persistido e resposta individualizada preservam o voto após reabertura. Falha ao salvar a identidade desabilita a votação e explica o motivo. Offline, a página mantém dados e informa reconexão a cada 5 s; leituras antigas desabilitam ações e exibem aviso próprio. README distingue instalação de pessoa, ausência de antifraude e dados simulados. A confiança recebe votos sem alterar gravidade/prioridade.

P2, evidência incompleta: faltam imagens da faixa de reações e da confiança em 390 e 320 px, incluindo um selecionado e a análise aberta. Capturar com rolagem até o primeiro botão evita que o grande topo esconda a feature. Não encontrei defeito funcional bloqueante no delta inspecionado. Não solicito nova direção estética nem autenticação de produção.

## Veredito

Nota atual: **4,4/5**. Disposition: **recapture**. A implementação tem qualidade para aprovação, mas o pedido exige responsividade da feature e as capturas móveis atuais não a mostram. Aprovação retida apenas até inspecionar a faixa de ações/contadores/confiança nos dois tamanhos compactos; se sem corte ou colisão, o parecer pode subir a ≥4,5 sem alteração estética. Capturas web adicionais validam a demonstração web; não substituem validação Android.

Questions skipped: escopo e pedido já confirmados; a pendência é captura, não preferência do usuário.
