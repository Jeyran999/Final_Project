const slug = new URLSearchParams(window.location.search).get('city');
const nameEl = document.getElementById('city-name');
const descEl = document.getElementById('city-longdesc');
const priceEl = document.getElementById('city-price');
const mapEl = document.getElementById('city-map');
const sliderEl = document.getElementById('media-slider');
const sliderControls = document.getElementById('slider-controls');
const addBtn = document.getElementById('city-add');
const basketCount = document.getElementById('city-basket-count');
const basketIcon = document.getElementById('city-basket');

let citiesData = [];
let currentIndex = 0;
let slides = [];
let autoplayTimer = null;
let basket = JSON.parse(localStorage.getItem('st_basket') || '[]');

fetch('cities.json')
  .then(r => r.json())
  .then(data => {
    citiesData = data;
    const city = data.find(c => c.slug === slug);
    if (!city) { nameEl.textContent = 'City not found'; return; }
    renderCity(city);
    updateBasketCount();
  });

function renderCity(city) {
  document.title = `Smart Travel — ${city.name}`;
  nameEl.textContent = city.name;
  descEl.textContent = city.longDesc || city.desc;
  priceEl.innerHTML = `$${city.price.toFixed(2)}`;
  mapEl.src = city.map || '';

  slides = [];

  if (city.video && city.video.length > 0) {
    city.video.forEach(v => slides.push({ type: 'video', src: v, autoplay: true }));
  }

  city.imgs.forEach(src => slides.push({ type: 'image', src }));
  buildSlider();
}

function buildSlider() {
  sliderEl.innerHTML = '';
  sliderControls.innerHTML = '';

  slides.forEach((s, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide' + (i === 0 ? ' active' : '');
    if (s.type === 'image') {
      const img = document.createElement('img');
      img.src = s.src;
      slide.appendChild(img);
    } else {
      const vid = document.createElement('video');
      vid.src = s.src;
      vid.autoplay = s.autoplay;
      vid.loop = true;
      vid.muted = true;
      vid.controls = true;
      slide.appendChild(vid);
      if (i === 0) vid.play();
    }
    sliderEl.appendChild(slide);

    const ctrl = document.createElement('button');
    ctrl.className = 'ghost';
    ctrl.innerText = i + 1;
    ctrl.addEventListener('click', () => gotoSlide(i));
    sliderControls.appendChild(ctrl);
  });

  startAutoplay();
}

function gotoSlide(idx) {
  const slideEls = sliderEl.querySelectorAll('.slide');
  slideEls.forEach((el, i) => el.classList.toggle('active', i === idx));
  currentIndex = idx;

  // autoplay video in current slide
  slideEls.forEach(el => {
    const vid = el.querySelector('video');
    if (vid) vid.pause();
  });
  const activeVid = slideEls[idx].querySelector('video');
  if (activeVid) activeVid.play();

  resetAutoplay();
}

function nextSlide() {
  const slideEls = sliderEl.querySelectorAll('.slide');
  currentIndex = (currentIndex + 1) % slides.length;
  gotoSlide(currentIndex);
}

function startAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(nextSlide, 4500);
}

function stopAutoplay() { if (autoplayTimer) clearInterval(autoplayTimer); }
function resetAutoplay() { stopAutoplay(); startAutoplay(); }

addBtn.addEventListener('click', () => {
  if (!slug) return;
  if (!basket.includes(slug)) basket.push(slug);
  localStorage.setItem('st_basket', JSON.stringify(basket));
  updateBasketCount();
  alert('Added to basket');
});

basketIcon.addEventListener('click', () => {
  const items = JSON.parse(localStorage.getItem('st_basket') || '[]');
  if (items.length === 0) { alert('Basket is empty!'); return; }

  let msg = 'Your Basket:\n';
  items.forEach(slug => {
    const city = citiesData.find(c => c.slug === slug);
    if (city) msg += `${city.name} - $${city.price}\n`;
  });

  if (confirm(msg + '\nDo you want to place order?')) {
    alert('Order placed!');
    localStorage.removeItem('st_basket');
    basket = [];
    updateBasketCount();
  }
});

function updateBasketCount() {
  basketCount.textContent = basket.length;
}
