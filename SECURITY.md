# Limites de segurança do protótipo

O URIP é uma demonstração acadêmica com dados simulados. Não há garantia de alta disponibilidade, autenticação de moradores ou antifraude de votos. Use a demonstração em rede privada; não exponha o servidor de desenvolvimento Metro à internet.

## Dependência transitiva sem correção publicada

Na auditoria de 17/11/2026, `npm audit` reportou **26 registros de severidade alta em cascata** relacionados a `picomatch` na cadeia Expo/Metro/codegen. O aviso [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) informa ReDoS por padrões glob, afeta versões até 4.0.7 e não lista versão corrigida. O registro npm também tinha 4.0.7 como versão mais recente nesta verificação.

Não foi aplicado downgrade forçado do SDK, inventada versão corrigida nem suprimido o relatório. A árvore permanece compatível com o Expo e o CI guarda o resultado da auditoria como artefato, com etapa explicitamente não bloqueante para este risco upstream conhecido. **CI aprovado não significa auditoria sem vulnerabilidades.**

Nos pontos de entrada revisados, a API Java e o app não recebem expressões glob de moradores; o uso identificado está na cadeia de ferramentas de desenvolvimento/build. Isso limita o cenário observado, mas não comprova ausência de exposição em todas as dependências. Evite executar configurações de build de fontes não confiáveis. Reavaliar e atualizar quando houver correção oficial antes de qualquer uso em produção.

## Dados e publicação

- O app não solicita nome, telefone ou GPS; usa um UUID aleatório local para distinguir votos por instalação.
- O servidor armazena UUID pseudônimo, risco/bairro, reação e horário. Não publica UUIDs no dashboard. Votos expiram em 24 h e são removidos na limpeza horária.
- Os nomes/RMs no README são identificação acadêmica do grupo, fornecida para essa finalidade; não são dados coletados pelo app.
- O Android é configurado sem backup automático dos dados locais. Armazenamento local do protótipo não é criptografado.
- `.env*`, bancos, dumps e dependências instaladas não devem entrar no Git. Apenas `.env.example` com valores demonstrativos é publicado.
- A chave padrão `local-demo-only` e a senha do serviço PostgreSQL do CI são valores demonstrativos. Fora de demo, configure uma chave de ingestão própria e HTTPS.
