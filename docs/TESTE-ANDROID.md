# Registro de teste em Android

**Estado: pendente de execução em aparelho/emulador.** O diagnóstico de configuração e o bundle Hermes não preenchem este registro automaticamente.

## Preparar

1. Iniciar o backend seguindo o README.
2. Consultar o IPv4 do computador com `ipconfig`. Celular e computador devem estar na mesma rede privada.
3. Na pasta `mobile`, definir o endereço **antes** de iniciar o Expo:

```powershell
$env:EXPO_PUBLIC_API_URL='http://IP-DO-COMPUTADOR:8080'
npm start
```

4. Usar Expo Go compatível com o SDK 58 e abrir pelo QR code. Em emulador Android padrão, usar `http://10.0.2.2:8080`.
5. Se a rede bloquear comunicação entre aparelhos, testar em outra rede privada. Não compartilhar senha de rede no repositório.

## Preencher após testar

- Responsável e data:
- Modelo do aparelho/emulador:
- Versão do Android:
- Versão do Expo Go:
- Commit testado:
- Evidências (vídeo/capturas, sem dados pessoais):

| Verificação | Resultado observado |
|---|---|
| Abre e mostra Conectado com os três riscos | Não executado |
| Panorama e filtros funcionam | Não executado |
| Medida, gravidade, origem e confiança legíveis | Não executado |
| Like/dislike, troca, retirada e confiança atualizam | Não executado |
| Dados e seleção continuam após fechar/reabrir | Não executado |
| Mudança de gravidade gera aviso com app aberto | Não executado |
| Backend parado: consulta continua e voto desabilita | Não executado |
| Backend reiniciado: reconecta sem fechar o app | Não executado |
| Fonte ampliada e TalkBack sem perder controles | Não executado |
| Barra de status, recortes e botão Voltar funcionam | Não executado |

Não trocar “Não executado” por “Aprovado” sem observar o comportamento. Avisos são dentro do aplicativo; não há push em segundo plano.
