export const SHOP = {
  brand: 'Belavie',
  product: 'Belavie Precision',
  productId: 'BELAVIE-PRECISION',
  price: 97,
  referencePrice: {value:297, confirmed:false},
  checkoutUrl: 'https://pay.kaiross.com.br/AEU5dYvSC1MC',
  offerName: 'Kit Sobrancelha Inteligente',
  campaignEnd: '', // A data confirmada deve incluir o fuso, por exemplo 2026-11-27T23:59:00-03:00.
  postCampaign: null, // Defina {price, checkoutUrl} com as condições vigentes após o encerramento.
  images: [
    {src:'assets/product.webp', width:1050, height:1050, alt:'Caneta depiladora branca com acabamento rosé', label:'Produto', caption:'Cores sortidas'},
    {src:'assets/modelo.webp', width:840, height:840, alt:'Modelo mostrado no checkout, com vistas do aparelho e da sobrancelha', label:'No checkout', caption:'Modelo apresentado no checkout'},
    {src:'assets/ponta.webp', width:433, height:760, alt:'Detalhe da ponta depiladora em acabamento dourado', label:'Ponta', caption:'Cores sortidas'},
    {src:'assets/uso.webp', width:840, height:840, alt:'Vista do aparelho e detalhe da aplicação na sobrancelha', label:'Aplicação', caption:'Imagem de referência · Cores sortidas'},
    {src:'assets/demo.webp', width:1050, height:1050, alt:'Renderização de aplicação da caneta na sobrancelha', label:'Demonstração', caption:'Retoque na sobrancelha'}
  ],
  whatsapp: {
    verified:false,
    number:'555192631334',
    display:'+55 51 9263-1334',
    message:'Olá! Vim pela página da Belavie Precision e gostaria de tirar algumas dúvidas sobre a caneta depiladora e a oferta de Black Friday. 💕',
    hours:''
  },
  delivery: {preparation:'', estimate:'', freight:'', regions:'', carrier:'', trackingUrl:''},
  payments: '',
  packageContents: '',
  guarantee: {days:14, confirmed:false, policyUrl:'', summary:''},
  doubleKit: {name:'Kit Dupla Economia', price:147, checkoutUrl:'', logisticsConfirmed:false},
  reviewsEnabled: false,
  reviews: [], // {rating: 1–5, name, comment, image?, imageAlt?, verifiedPurchase?}
  submitReviewUrl: '',
  company: {legalName:'', taxId:'', address:''},
  policies: {privacy:'', terms:'', shipping:'', returns:''},
  tracking: {pixelId:''}
};
