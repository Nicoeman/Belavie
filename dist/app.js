import { SHOP } from './config.js';

const $ = id => document.getElementById(id);
const money = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'});
const format = value => money.format(value);
let currentOffer = SHOP;
let expired = false;
const attribution = new URLSearchParams(location.search);

function checkoutLink(base) {
  const url = new URL(base);
  for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','fbclid','gclid']) {
    if (attribution.has(key) && !url.searchParams.has(key)) url.searchParams.set(key, attribution.get(key));
  }
  return url.toString();
}

function renderOffers() {
  const available = Boolean(currentOffer?.checkoutUrl);
  const reference = SHOP.referencePrice;
  const showReference = !expired && reference.confirmed && reference.value > SHOP.price;
  document.querySelectorAll('[data-offer]').forEach(node => {
    node.innerHTML = `<p class="offer-label">${expired ? 'BELAVIE PRECISION' : 'OFERTA ESPECIAL BLACK FRIDAY'}</p>
      <h3>${SHOP.offerName}</h3><p class="offer-unit">1 caneta Belavie Precision</p>
      ${showReference ? `<p class="prior-price">De <del>${format(reference.value)}</del> por apenas</p>` : ''}<p class="price" data-price></p><a class="btn" data-buy>Comprar agora</a>
      <p class="fine">${available ? 'Confira as condições de pagamento e entrega ao finalizar seu pedido.' : 'A campanha foi encerrada.'}</p>`;
  });
  document.querySelectorAll('[data-price]').forEach(node => {
    node.textContent = available ? format(currentOffer.price) : '';
  });
  document.querySelectorAll('[data-buy]').forEach(link => {
    link.hidden = !available;
    if (available) link.href = checkoutLink(currentOffer.checkoutUrl);
    else link.removeAttribute('href');
  });
  $('sticky-buy').hidden = !available;
  document.querySelector('[data-hero-price]').hidden = !available;
  document.querySelector('[data-bar-offer]').hidden = !available || expired;
  document.querySelector('.bar-divider').hidden = !available || expired;
  if (expired) document.querySelectorAll('[data-campaign]').forEach(node => { node.textContent = 'BELAVIE PRECISION'; });
  const kit = SHOP.doubleKit;
  $('kit').hidden = expired || !kit.logisticsConfirmed || !kit.checkoutUrl;
  if (!$('kit').hidden) {
    $('kit').innerHTML = `<article class="offer-card"><h3>${kit.name}</h3><p>2 canetas Belavie Precision · Uma para você e outra para presentear.</p><p class="price">${format(kit.price)}</p><p>Economize ${format(2 * SHOP.price - kit.price)} em relação a duas unidades individuais.</p><a class="btn">Comprar kit com duas unidades</a></article>`;
    $('kit').querySelector('a').href = checkoutLink(kit.checkoutUrl);
  }
  document.getElementById('product-schema')?.remove();
  const schema = document.createElement('script');
  schema.id = 'product-schema';
  schema.type = 'application/ld+json';
  schema.textContent = JSON.stringify({
    '@context':'https://schema.org', '@type':'Product', name:SHOP.product, sku:SHOP.productId,
    image: SHOP.images.filter(item => item.src).map(item => new URL(item.src,location.href).href),
    description:'Caneta depiladora elétrica portátil, recarregável via USB, para pequenos retoques na sobrancelha.',
    brand:{'@type':'Brand', name:SHOP.brand},
    ...(available ? {offers:{'@type':'Offer', url:currentOffer.checkoutUrl, priceCurrency:'BRL', price:currentOffer.price}} : {})
  });
  document.head.append(schema);
}

const endTime = Date.parse(SHOP.campaignEnd);
function updateTimer() {
  const remaining = Math.ceil((endTime - Date.now()) / 1000);
  if (remaining <= 0) {
    expired = true;
    currentOffer = SHOP.postCampaign;
    $('timer').hidden = true;
    renderOffers();
    return;
  }
  $('timer').hidden = false;
  const units = [[86400,'d'],[3600,'h'],[60,'min'],[1,'s']];
  let seconds = remaining;
  $('timer').innerHTML = 'Termina em ' + units.map(([factor,label]) => {
    const value = Math.floor(seconds / factor);
    seconds %= factor;
    return `<b>${String(value).padStart(2,'0')} ${label}</b>`;
  }).join('');
  setTimeout(updateTimer, 1000);
}
renderOffers();
if (Number.isFinite(endTime)) updateTimer();

$('menu-button').addEventListener('click', () => {
  const open = $('nav').classList.toggle('open');
  $('menu-button').setAttribute('aria-expanded', open);
  $('menu-button').setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
$('nav').addEventListener('click', event => {
  if (event.target.closest('a') && $('nav').classList.contains('open')) $('menu-button').click();
});

const imageDialog = $('image-dialog');
let zoomTrigger;
function zoom(trigger) {
  zoomTrigger = trigger;
  const photo = trigger.firstElementChild.cloneNode(true);
  photo.removeAttribute('id');
  imageDialog.querySelector('.zoom-content').replaceChildren(photo);
  imageDialog.showModal();
}
imageDialog.querySelector('button').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', event => { if (event.target === imageDialog) imageDialog.close(); });
imageDialog.addEventListener('close', () => zoomTrigger?.focus());

let photoIndex = 0;
function selectPhoto(index) {
  photoIndex = (index + SHOP.images.length) % SHOP.images.length;
  const item = SHOP.images[photoIndex];
  const image = $('gallery-image');
  image.src = item.src;
  image.alt = item.alt;
  image.width = item.width;
  image.height = item.height;
  $('gallery-caption').textContent = item.caption;
  Array.from($('thumbs').children).forEach((button, i) => button.setAttribute('aria-pressed', i === photoIndex));
}

SHOP.images.forEach((item,index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'thumb';
  button.setAttribute('aria-label', item.label);
  const image = new Image(item.width,item.height);
  image.src = item.src;
  image.alt = '';
  button.append(image);
  const label = document.createElement('span');
  label.textContent = item.label;
  button.append(label);
  button.addEventListener('click', () => selectPhoto(index));
  $('thumbs').append(button);
});
selectPhoto(0);
$('gallery-prev').addEventListener('click', () => selectPhoto(photoIndex - 1));
$('gallery-next').addEventListener('click', () => selectPhoto(photoIndex + 1));
$('gallery-open').addEventListener('click', event => zoom(event.currentTarget));
$('gallery').addEventListener('keydown', event => {
  if (['ArrowLeft','ArrowRight'].includes(event.key)) {
    event.preventDefault();
    selectPhoto(photoIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
let touchStart = null;
$('gallery').addEventListener('touchstart', event => { touchStart = event.changedTouches[0]; }, {passive:true});
$('gallery').addEventListener('touchend', event => {
  if (!touchStart) return;
  const touchEnd = event.changedTouches[0];
  const deltaX = touchEnd.clientX - touchStart.clientX;
  const deltaY = touchEnd.clientY - touchStart.clientY;
  if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) selectPhoto(photoIndex + (deltaX < 0 ? 1 : -1));
  touchStart = null;
}, {passive:true});

const monthly = $('monthly');
monthly.addEventListener('input', () => {
  const valid = monthly.validity.valid && Number.isFinite(monthly.valueAsNumber);
  $('annual-result').hidden = !valid;
  $('annual').value = valid ? format(monthly.valueAsNumber * 12) : '';
});

const motion = matchMedia('(prefers-reduced-motion: reduce)');
const examples = [
  {title:'Gastos com retoques', width:760, height:1286},
  {title:'Portabilidade', width:760, height:1292},
  {title:'Alternativa à pinça', width:638, height:1347},
  {title:'Preço e praticidade', width:642, height:1347},
  {title:'Retoques no seu tempo', width:642, height:1347}
];
const track = $('routine-track');
const dots = $('routine-dots');
examples.forEach(({title, width, height}, i) => {
  const item = {src:`assets/conversa-${i + 1}.webp`, alt:`Conversa simulada sobre ${title.toLowerCase()}`, width, height};
  const card = document.createElement('article');
  card.className = 'routine-card conversation-card';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'image-button';
  button.setAttribute('aria-label', 'Ampliar conversa simulada sobre ' + title.toLowerCase());
  const image = new Image(width,height);
  image.src = item.src;
  image.alt = item.alt;
  image.loading = 'lazy';
  // The supplied cards have a 48px title strip above the conversation.
  const frame = document.createElement('span');
  frame.className = 'conversation-frame';
  frame.style.setProperty('--frame-ratio', width / (height - 48));
  frame.append(image);
  button.append(frame);
  button.addEventListener('click', () => zoom(button));
  const heading = document.createElement('h3');
  heading.textContent = title;
  card.append(button,heading);
  track.append(card);
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', 'Avançar para ' + title.toLowerCase());
  dot.addEventListener('click', () => moveRoutine(i));
  dots.append(dot);
});
const stride = () => track.children[1].offsetLeft - track.children[0].offsetLeft;
const currentSlide = () => Math.round(track.scrollLeft / stride());
function moveRoutine(index) { track.scrollTo({left:index * stride(), behavior:motion.matches ? 'instant' : 'smooth'}); }
function refreshRoutine() {
  const max = Math.max(0,track.scrollWidth - track.clientWidth);
  const last = Math.round(max / stride());
  $('routine-prev').disabled = track.scrollLeft < 2;
  $('routine-next').disabled = max - track.scrollLeft < 2;
  Array.from(dots.children).forEach((dot,index) => {
    dot.hidden = index > last;
    dot.setAttribute('aria-current', index === currentSlide());
  });
}
$('routine-prev').addEventListener('click', () => moveRoutine(currentSlide() - 1));
$('routine-next').addEventListener('click', () => moveRoutine(currentSlide() + 1));
track.addEventListener('scroll', refreshRoutine, {passive:true});
new ResizeObserver(refreshRoutine).observe(track);

function appendLink(container, label, url) {
  if (!url) return;
  const link = document.createElement('a');
  link.href = url;
  link.textContent = label;
  container.append(link);
}

const footer = $('footer-links');
const delivery = SHOP.delivery;
if (delivery.trackingUrl) {
  appendLink($('nav'), 'Rastrear pedido', delivery.trackingUrl);
  appendLink(footer, 'Rastrear pedido', delivery.trackingUrl);
  appendLink($('delivery-details'), 'Rastrear meu pedido', delivery.trackingUrl);
}
for (const [label,value] of [['Prazo de preparação',delivery.preparation],['Prazo de entrega',delivery.estimate],['Frete',delivery.freight],['Regiões atendidas',delivery.regions],['Transportadora',delivery.carrier]]) {
  if (!value) continue;
  const p = document.createElement('p');
  p.textContent = label + ' · ' + value;
  $('delivery-details').append(p);
}
for (const [name,label] of Object.entries({privacy:'Política de privacidade',terms:'Termos de uso',shipping:'Política de entrega',returns:'Trocas e devoluções'})) appendLink(footer,label,SHOP.policies[name]);

const {whatsapp, guarantee} = SHOP;
if (whatsapp.verified) {
  const url = 'https://wa.me/' + whatsapp.number + '?text=' + encodeURIComponent(whatsapp.message);
  $('atendimento').hidden = false;
  $('support-link').href = url;
  $('support-link').textContent = 'Falar com nosso suporte no WhatsApp';
  $('support-link').classList.add('green');
  $('support-copy').textContent = 'Tire dúvidas sobre o produto, a entrega ou seu pedido pelo WhatsApp ' + whatsapp.display + '.';
  $('support-hours').textContent = whatsapp.hours;
  $('whatsapp').href = url;
  $('whatsapp').hidden = false;
  appendLink(footer,'WhatsApp ' + whatsapp.display,url);
}
if (guarantee.confirmed && guarantee.policyUrl && guarantee.summary) {
  const section = $('garantia');
  section.innerHTML = '<div class="wrap section-head"><p class="eyebrow">GARANTIA DE SATISFAÇÃO</p><h2></h2><p></p><div class="text-link"></div></div>';
  section.querySelector('h2').textContent = guarantee.days + ' dias de garantia comercial';
  section.querySelector('h2 + p').textContent = guarantee.summary + ' A garantia comercial preserva os direitos legais da consumidora.';
  appendLink(section.querySelector('.text-link'), 'Consultar política de garantia', guarantee.policyUrl);
  appendLink(footer,'Política de garantia',guarantee.policyUrl);
  section.hidden = false;
}
const company = Object.values(SHOP.company).filter(Boolean);
if (SHOP.payments) company.push(SHOP.payments);
if (company.length) {
  const paragraph = document.createElement('p');
  paragraph.textContent = company.join(' · ');
  $('copyright').append(paragraph);
}

const faq = [
  ['A Belavie Precision é recarregável?','Sim. O carregamento é feito via USB, conforme as instruções do fabricante.'],
  ['Para que serve a caneta depiladora?','Ela auxilia nos pequenos retoques dos pelos da sobrancelha.'],
  ['Preciso continuar frequentando o salão?','A Belavie ajuda nos retoques entre atendimentos. O design profissional pode continuar fazendo parte da sua rotina.'],
  ['A caneta substitui a pinça?','A caneta é uma alternativa elétrica para determinados retoques. Cada método funciona de um jeito.'],
  ['A utilização é dolorosa?','A experiência pode variar conforme a sensibilidade e a forma de uso. Siga as orientações do fabricante.'],
  ['Os pelos param de crescer?','Os pelos continuam crescendo depois do retoque.'],
  ['Posso levar na bolsa?','Sim. O formato compacto facilita o transporte.'],
  ['Posso escolher a cor?','As cores são sortidas. Consulte a disponibilidade antes da compra.'],
  ['Qual é o prazo de entrega?',delivery.estimate || 'O prazo depende do endereço e das condições logísticas. Consulte o checkout.'],
  ['Como acompanho meu pedido?',delivery.trackingUrl ? 'Use o link de rastreamento na seção de entrega.' : 'Consulte as informações de acompanhamento disponibilizadas no envio.'],
  ['Quais formas de pagamento são aceitas?',SHOP.payments || 'O checkout apresenta as opções disponíveis.'],
  ['Existe garantia?',!$('garantia').hidden ? 'Consulte as condições da garantia comercial na seção de garantia.' : 'Aplicam-se os direitos legais previstos para a compra.'],
  ['O que acompanha o produto?',SHOP.packageContents || 'A oferta inclui uma unidade da Belavie Precision. Consulte as condições do pedido sobre acessórios.'],
  ['Como posso higienizar o aparelho?','Siga as orientações de limpeza do fabricante.'],
  ['Posso utilizar em outras partes do rosto?','Use o aparelho apenas nas regiões autorizadas pelo fabricante.']
];
if (whatsapp.verified) faq.push(['Como entro em contato com a loja?', 'Fale com o atendimento pelo WhatsApp ' + whatsapp.display + '.']);
faq.forEach(([question,answer]) => {
  const detail = document.createElement('details');
  detail.name = 'perguntas';
  const title = document.createElement('summary');
  title.textContent = question;
  const p = document.createElement('p');
  p.textContent = answer;
  detail.append(title,p);
  $('faq-list').append(detail);
});

const reviews = SHOP.reviews.filter(review => Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5);
if (SHOP.reviewsEnabled && reviews.length) {
  const section = $('avaliacoes');
  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  section.innerHTML = '<div class="section-head"><p class="eyebrow">AVALIAÇÕES</p><h2>A experiência de quem usou</h2><p class="gold"></p></div><dl class="specs"></dl><label for="review-filter">Filtrar por nota</label><br><select id="review-filter"><option value="0">Todas as notas</option></select><ul class="reviews-list"></ul>';
  section.querySelector('.gold').textContent = average.toLocaleString('pt-BR',{maximumFractionDigits:1}) + ' de 5 · ' + reviews.length + (reviews.length === 1 ? ' avaliação' : ' avaliações');
  [5,4,3,2,1].forEach(rating => {
    const label = rating + (rating === 1 ? ' estrela' : ' estrelas');
    const count = reviews.filter(review => review.rating === rating).length;
    const row = document.createElement('div');
    const title = document.createElement('dt');
    title.textContent = label;
    const data = document.createElement('dd');
    data.textContent = count + (count === 1 ? ' avaliação' : ' avaliações');
    row.append(title,data);
    section.querySelector('dl').append(row);
    $('review-filter').add(new Option(label, rating));
  });
  function renderReviews() {
    const rating = Number($('review-filter').value);
    const list = section.querySelector('.reviews-list');
    list.replaceChildren();
    const display = reviews.filter(review => !rating || review.rating === rating);
    if (!display.length) {
      const item = document.createElement('li');
      item.textContent = 'Nenhuma avaliação com esta nota.';
      list.append(item);
    }
    display.forEach(review => {
      const article = document.createElement('li');
      const title = document.createElement('h3');
      title.textContent = review.name + (review.verifiedPurchase ? ' · Compra verificada' : '');
      const stars = document.createElement('p');
      stars.className = 'gold';
      stars.textContent = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
      stars.setAttribute('aria-label', review.rating + ' de 5 estrelas');
      const comment = document.createElement('p');
      comment.textContent = review.comment;
      article.append(title,stars,comment);
      if (review.image) {
        const photo = new Image(180,180);
        photo.src = review.image;
        photo.alt = review.imageAlt || 'Imagem enviada com a avaliação';
        photo.loading = 'lazy';
        article.append(photo);
      }
      list.append(article);
    });
  }
  $('review-filter').addEventListener('change', renderReviews);
  renderReviews();
  appendLink(section,'Enviar uma avaliação',SHOP.submitReviewUrl);
  section.hidden = false;
  document.querySelector('[data-reviews]').hidden = false;
}

const pixelId = SHOP.tracking.pixelId;
if (/^\d+$/.test(pixelId)) {
  const consent = $('consent-dialog');
  const setting = 'belavie-meta-consent';
  let enabled = false;
  function enableTracking() {
    if (enabled) {
      window.fbq?.('consent','grant');
      return;
    }
    enabled = true;
    const fbq = function () {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
      else fbq.queue.push(arguments);
    };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    window.fbq = window._fbq = fbq;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.append(script);
    fbq('init',pixelId);
    fbq('track','PageView');
    fbq('track','ViewContent',{content_name:SHOP.product, content_ids:[SHOP.productId], content_type:'product', value:currentOffer?.price ?? SHOP.price, currency:'BRL'});
  }
  $('privacy-options').hidden = false;
  $('privacy-options').addEventListener('click', () => consent.showModal());
  for (const [button,allowed] of [['allow-consent',true],['deny-consent',false]]) {
    $(button).addEventListener('click', () => {
      try { localStorage.setItem(setting, allowed ? 'yes' : 'no'); } catch { /* A preferência ainda vale nesta página. */ }
      if (allowed) enableTracking();
      else window.fbq?.('consent','revoke');
      consent.close();
    });
  }
  let previous;
  try { previous = localStorage.getItem(setting); } catch { previous = null; }
  if (previous === 'yes') enableTracking();
  if (!previous) consent.showModal();
}
