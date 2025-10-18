const cardsContainer = document.querySelector(".cards-container");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const basketBtn = document.getElementById("basket-btn");
const basketPanel = document.getElementById("basket-panel");
const closeBasket = document.getElementById("close-basket");
const basketList = document.getElementById("basket-list");
const basketTotalEl = document.getElementById("basket-total");
const basketCountEl = document.getElementById("basket-count");
const favToggle = document.getElementById("fav-toggle");
const favPanel = document.getElementById("fav-panel");
const closeFav = document.getElementById("close-fav");
const favList = document.getElementById("fav-list");
const bookNowBtn = document.getElementById("book-now-btn");
const bookingForm = document.getElementById("booking-form");
let videoBtn = document.querySelectorAll(".vid-btn");
let cities = [];
let filtered = [];
let basket = JSON.parse(localStorage.getItem("st_basket") || "[]");
let favs = new Set(JSON.parse(localStorage.getItem("st_favs") || "[]"));

videoBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".controls .active").classList.remove("active");
    btn.classList.add("active");
    let src = btn.getAttribute("data-src");
    document.querySelector("#video-slider").src = src;
  });
});

function fetchCities() {
  fetch("cities.json")
    .then(r => r.json())
    .then(data => {
      cities = data;
      filtered = [...cities];
      renderCards(filtered);
      updateBasketUI();
      renderFavs();
    })
    .catch(err => console.error("Failed to load cities.json", err));
}

function renderCards(list) {
  cardsContainer.innerHTML = "";
  list.forEach(city => {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.slug = city.slug;
    card.innerHTML = `
      <button class="fav-btn ${favs.has(city.slug) ? "active" : ""}" aria-label="fav"><i class="fas fa-heart"></i></button>
      <img src="${city.imgs[0]}" alt="${city.name}">
      <div class="card-body">
        <h3>${city.name}</h3>
        <p>${city.desc}</p>
        <div class="row">
          <div>
            <div class="price-row"><span class="price">$${city.price}</span> <small style="text-decoration:line-through;color:#999;margin-left:6px">$${city.oldPrice}</small></div>
          </div>
          <div style="display:flex;gap:.4rem">
            <button class="btn add-btn">Add</button>
            <a class="btn ghost" href="city.html?city=${encodeURIComponent(city.slug)}">Details</a>
          </div>
        </div>
      </div>
    `;
    card.querySelector(".add-btn").addEventListener("click", () => addToBasket(city.slug));
    card.querySelector(".fav-btn").addEventListener("click", e => {
      e.stopPropagation();
      toggleFav(city.slug, e.currentTarget);
    });
    cardsContainer.appendChild(card);
  });
}
const cityData = {
  "London": { img: "https://cdn.pixabay.com/photo/2021/08/12/05/19/cathedral-6539937_1280.jpg", desc: "Classic London city vibe with iconic landmarks." },
  "Paris": { img: "https://cdn.pixabay.com/photo/2017/01/03/22/00/tower-1950742_1280.jpg", desc: "Romantic Paris with Eiffel Tower and museums." },
  "Moscow": { img: "https://cdn.pixabay.com/photo/2016/09/22/16/09/moscow-1687591_1280.jpg", desc: "Historic Moscow with Red Square and Kremlin." },
  "Dubai": { img: "https://cdn.pixabay.com/photo/2016/02/28/20/23/dubai-1227538_1280.jpg", desc: "Modern Dubai with skyscrapers and desert adventure." },
  "Baku": { img: "https://cdn.pixabay.com/photo/2017/01/25/13/33/travel-2007903_1280.jpg", desc: "Azerbaijani Baku with Caspian views and Flame Towers." },
  "Istanbul": { img: "https://cdn.pixabay.com/photo/2020/05/21/20/00/istanbul-5202424_1280.jpg", desc: "Cultural Istanbul bridging Europe & Asia." },
  "Tokyo": { img: "https://cdn.pixabay.com/photo/2025/05/16/09/16/imperial-palace-tokyo-9603413_1280.jpg", desc: "Tokyo's modern & traditional mix of city life." },
  "Berlin": { img: "https://cdn.pixabay.com/photo/2018/12/01/00/10/blue-hour-3848856_1280.jpg", desc: "Berlin's art, history, and nightlife combined." },
  "Rome": { img: "https://cdn.pixabay.com/photo/2022/06/05/20/24/rome-7244828_1280.jpg", desc: "Historic Rome with Colosseum and amazing cuisine." },
  "Barcelona": { img: "https://cdn.pixabay.com/photo/2018/12/29/14/11/barcelona-3901449_1280.jpg", desc: "Barcelona’s architecture and Mediterranean vibe." },
  "Amsterdam": { img: "https://cdn.pixabay.com/photo/2020/08/14/15/22/canal-5488271_1280.jpg", desc: "Amsterdam’s canals and charming streets." },
  "Vienna": { img: "https://cdn.pixabay.com/photo/2017/07/07/11/39/palm-house-2481208_1280.jpg", desc: "Vienna’s classical music and grand palaces." },
  "Prague": { img: "https://cdn.pixabay.com/photo/2017/12/10/17/40/prague-3010407_1280.jpg", desc: "Prague with its beautiful old town and bridges." },
  "Lisbon": { img: "https://cdn.pixabay.com/photo/2020/02/05/09/31/city-4820579_1280.jpg", desc: "Lisbon’s scenic hills and historic trams." },
  "Bangkok": { img: "https://cdn.pixabay.com/photo/2016/10/22/00/04/bangkok-1759467_1280.jpg", desc: "Bangkok with vibrant street food and temples." },
  "Singapore": { img: "https://cdn.pixabay.com/photo/2017/07/31/06/20/singapore-2556628_1280.jpg", desc: "Modern Singapore with gardens and city skyline." },
  "Seoul": { img: "https://plus.unsplash.com/premium_photo-1661886333708-877148b43ae1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2VvdWx8ZW58MHx8MHx8fDA%3D", desc: "Seoul combining tradition and modernity." },
  "Venice": { img: "https://cdn.pixabay.com/photo/2018/02/26/14/22/venice-3183168_1280.jpg", desc: "Venice’s romantic canals and gondolas." },
  "Toronto": { img: "https://cdn.pixabay.com/photo/2022/04/18/02/24/architecture-7139263_640.jpg", desc: "Toronto’s skyline and multicultural vibe." },
  "Beijing": { img: "https://www.thechinajourney.com/wp-content/uploads/2024/09/beijing-photo-for-pc-banner-1024x682.webp", desc: "Beijing with Forbidden City and history." }
};

const quizData = [
  {
    question: "What kind of weather do you prefer?",
    options: [
      { text: "Cool & rainy", cities: ["London", "Moscow", "Berlin", "Amsterdam", "Toronto", "Prague"] },
      { text: "Sunny & warm", cities: ["Dubai", "Lisbon", "Barcelona", "Rome", "Bangkok"] },
      { text: "Moderate / Mild", cities: ["Paris", "Baku", "Istanbul", "Vienna", "Venice", "Singapore"] },
      { text: "Cold / Snowy", cities: ["Seoul", "Beijing", "Tokyo"] }
    ]
  },
  {
    question: "Do you enjoy historical sites?",
    options: [
      { text: "Yes, lots of history", cities: ["Istanbul", "Rome", "Prague", "Beijing", "Baku", "Venice", "Paris"] },
      { text: "Some history is fine", cities: ["London", "Berlin", "Vienna", "Barcelona", "Tokyo"] },
      { text: "Not really", cities: ["Dubai", "Bangkok", "Singapore", "Toronto"] }
    ]
  },
  {
    question: "Preferred cuisine?",
    options: [
      { text: "Seafood", cities: ["Lisbon", "Tokyo", "Venice", "Barcelona", "Singapore"] },
      { text: "Street food", cities: ["Bangkok", "Istanbul", "Dubai", "Beijing"] },
      { text: "Gourmet & fine dining", cities: ["Paris", "Rome", "Vienna", "London"] },
      { text: "Local traditional", cities: ["Baku", "Seoul", "Toronto", "Moscow"] }
    ]
  }
];

let currentQuestion = 0;
let scores = {};

const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const nextBtn = document.getElementById('next-btn');
const quizResult = document.getElementById('quiz-result');


function loadQuestion() {
  quizQuestion.classList.remove('fade-in');
  quizOptions.classList.remove('fade-in');
  void quizQuestion.offsetWidth;
  void quizOptions.offsetWidth;

  quizQuestion.textContent = quizData[currentQuestion].question;
  quizOptions.innerHTML = '';

  quizData[currentQuestion].options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option.text;
    btn.onclick = () => selectOption(option.cities, btn);
    quizOptions.appendChild(btn);
  });

  quizQuestion.classList.add('fade-in');
  quizOptions.classList.add('fade-in');
}

function selectOption(cities, btn) {
  Array.from(quizOptions.children).forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  cities.forEach(city => {
    scores[city] = (scores[city] || 0) + 1;
  });
}

nextBtn.addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  let recommendedCity = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  quizQuestion.style.display = 'none';
  quizOptions.style.display = 'none';
  nextBtn.style.display = 'none';

  quizResult.style.opacity = "0";
  quizResult.innerHTML = `
    Your ideal city is: <strong>${recommendedCity}</strong>!<br>
    <img src="${cityData[recommendedCity].img}" alt="${recommendedCity}"><br>
    <p>${cityData[recommendedCity].desc}</p>
  `;

  setTimeout(() => { quizResult.style.opacity = "1"; }, 100);
}

loadQuestion();

function toggleFav(slug, btnEl) {
  if (favs.has(slug)) favs.delete(slug);
  else favs.add(slug);
  btnEl.classList.toggle("active");
  localStorage.setItem("st_favs", JSON.stringify(Array.from(favs)));
  renderFavs();
}

function renderFavs() {
  favList.innerHTML = "";
  favs.forEach(slug => {
    const city = cities.find(c => c.slug === slug);
    if (!city) return;
    const li = document.createElement("li");
    li.innerHTML = `
      <a class="fav-item-link" href="city.html?city=${encodeURIComponent(city.slug)}">
        <span class="fav-item-name">${city.name}</span>
        <span class="fav-item-price">$${city.price}</span>
      </a>
      <button class="remove-fav" aria-label="Remove favourite">✖</button>
    `;
    li.querySelector(".remove-fav").addEventListener("click", e => {
      e.stopPropagation();
      favs.delete(city.slug);
      localStorage.setItem("st_favs", JSON.stringify(Array.from(favs)));
      renderFavs();
      renderCards(filtered);
    });
    favList.appendChild(li);
  });
}

// ===== Basket functions =====
function addToBasket(slug) {
  const item = cities.find(c => c.slug === slug);
  if (!item) return;
  basket.push(slug);
  localStorage.setItem("st_basket", JSON.stringify(basket));
  updateBasketUI();
}

function removeFromBasketAt(idx) {
  basket.splice(idx, 1);
  localStorage.setItem("st_basket", JSON.stringify(basket));
  updateBasketUI();
}

function updateBasketUI() {
  basketList.innerHTML = "";
  let total = 0;
  basket.forEach((slug, i) => {
    const info = cities.find(c => c.slug === slug);
    if (!info) return;
    total += Number(info.price || 0);
    const li = document.createElement("li");
    li.innerHTML = `${info.name} <strong>$${Number(info.price).toFixed(2)}</strong> <button class="ghost" data-idx="${i}">Remove</button>`;
    li.querySelector("button").addEventListener("click", () => removeFromBasketAt(i));
    basketList.appendChild(li);
  });
  basketTotalEl.textContent = total.toFixed(2);
  basketCountEl.textContent = basket.length;
}

// ===== Event listeners =====
basketBtn.addEventListener("click", () => {
  basketPanel.classList.add("show");
  basketPanel.setAttribute("aria-hidden", "false");
});
closeBasket?.addEventListener("click", () => {
  basketPanel.classList.remove("show");
  basketPanel.setAttribute("aria-hidden", "true");
});

favToggle?.addEventListener("click", () => {
  favPanel.classList.add("show");
  favPanel.setAttribute("aria-hidden", "false");
});
closeFav?.addEventListener("click", () => {
  favPanel.classList.remove("show");
  favPanel.setAttribute("aria-hidden", "true");
});

document.getElementById("clear-basket")?.addEventListener("click", () => {
  if (!confirm("Clear basket?")) return;
  basket = [];
  localStorage.setItem("st_basket", JSON.stringify([]));
  updateBasketUI();
});

searchInput?.addEventListener("input", e => {
  const q = e.target.value.trim().toLowerCase();
  filtered = cities.filter(c => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
  renderCards(filtered);
});

sortSelect?.addEventListener("change", e => {
  const v = e.target.value;
  if (!v) filtered = [...cities];
  if (v === "price-asc") filtered.sort((a, b) => a.price - b.price);
  if (v === "price-desc") filtered.sort((a, b) => b.price - a.price);
  if (v === "name-asc") filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (v === "name-desc") filtered.sort((a, b) => b.name.localeCompare(a.name));
  renderCards(filtered);
});

bookNowBtn?.addEventListener("click", () => {
  if (basket.length === 0) return alert("Basket is empty");
  bookingForm.classList.remove("hidden");
});

bookingForm?.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("user-name").value.trim();
  const email = document.getElementById("user-email").value.trim();
  const phone = document.getElementById("user-phone").value.trim();
  const card = document.getElementById("user-card").value.trim();
  if (!name || !email || !phone || !card) return alert("Please fill all fields");

  const total = Number(basketTotalEl.textContent).toFixed(2);
  alert(`Booking confirmed!\nTotal: $${total}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}`);

  basket = [];
  localStorage.setItem("st_basket", JSON.stringify(basket));
  updateBasketUI();
  bookingForm.classList.add("hidden");
  basketPanel.classList.remove("show");
});

fetchCities();
