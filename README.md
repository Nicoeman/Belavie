# Belavie Precision

Vitrine estática para a campanha Black Friday 2026. O diretório `dist/` contém o site completo. Sirva-o por HTTP para carregar os módulos ES. O projeto não requer instalação de dependências nem etapa de compilação.

## Configuração comercial

Edite `dist/config.js`. Ative `referencePrice.confirmed` após comprovar o preço anterior de R$ 297,00. Confirme preço, produto e conteúdo de embalagem no checkout da Kaiross, além dos prazos, custos de frete, meios de pagamento, rastreamento e dados da empresa. Informe as URLs das políticas aprovadas.

- **Campanha:** informe o encerramento real em ISO 8601 com fuso e configure `postCampaign` com o preço e checkout vigentes. Sem oferta sucessora, os CTAs de compra são retirados no encerramento.
- **Imagens e vídeos:** a galeria inclui a foto do checkout e imagens de referência identificadas como ilustrativas. Os cinco cards de conversas são simulações e incluem identificação na imagem. `caneta-em-uso.mp4` aparece após a primeira oferta. `demonstracao.mp4` aparece em Detalhes do produto. Confirme os direitos de uso e as alegações dos vídeos antes de ampliar a distribuição.
- **WhatsApp:** valide o cadastro do número fornecido antes de habilitar `whatsapp.verified`. O campo de horário é opcional.
- **Garantia e kit duplo:** confirme as regras de garantia e publique a política. Para o kit duplo, confira a logística e configure seu checkout específico.
- **Avaliações:** use somente comentários e imagens autorizados. Habilite a seção com dados reais e informe o canal de envio de avaliações, quando disponível.
- **Meta:** configure `tracking.pixelId` depois de aprovar a política de privacidade e validar a integração da Kaiross. O site dispara PageView e ViewContent após consentimento. Configure InitiateCheckout no início efetivo da finalização e Purchase após confirmação de pagamento na Kaiross ou em um servidor autorizado. Se houver duplicidade entre navegador e API de Conversões, gere um identificador por evento e passe o mesmo event_id nos dois canais. Mantenha tokens no servidor e valide compras de teste no Gerenciador de Eventos.
- **SEO:** ao mudar de domínio, atualize a URL canônica e a imagem Open Graph no HTML.
