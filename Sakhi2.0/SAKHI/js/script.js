/*
  Sakhi Fashion - Shared frontend logic
  Handles product rendering, cart state, navigation, slider, and form validation.
*/

const PRODUCTS = [
  { id: 1, name: "Rose Chiffon Tiered Dress", price: 2299, oldPrice: 3199, discount: "28% OFF", category: "Dresses", image1: "https://picsum.photos/id/1027/600/800", image2: "https://picsum.photos/id/1025/600/800" },
  { id: 2, name: "Ivory Embroidered Kurti Set", price: 1899, oldPrice: 2599, discount: "27% OFF", category: "Kurtis", image1: "https://picsum.photos/id/1011/600/800", image2: "https://picsum.photos/id/1005/600/800" },
  { id: 3, name: "Blush Satin Wrap Top", price: 1299, oldPrice: 1799, discount: "24% OFF", category: "Tops", image1: "https://picsum.photos/id/1035/600/800", image2: "https://picsum.photos/id/1039/600/800" },
  { id: 4, name: "Beige Linen Co-ord Set", price: 2499, oldPrice: 3499, discount: "29% OFF", category: "Western Wear", image1: "https://picsum.photos/id/1047/600/800", image2: "https://picsum.photos/id/1048/600/800" },
  { id: 5, name: "Soft Gold Banarasi Saree", price: 3299, oldPrice: 4399, discount: "25% OFF", category: "Sarees", image1: "https://picsum.photos/id/1062/600/800", image2: "https://picsum.photos/id/1069/600/800" },
  { id: 6, name: "Petal Pink A-Line Dress", price: 2099, oldPrice: 2999, discount: "30% OFF", category: "Dresses", image1: "https://picsum.photos/id/1074/600/800", image2: "https://picsum.photos/id/1080/600/800" },
  { id: 7, name: "Classic Black Office Kurti", price: 1699, oldPrice: 2299, discount: "26% OFF", category: "Kurtis", image1: "https://picsum.photos/id/1081/600/800", image2: "https://picsum.photos/id/1082/600/800" },
  { id: 8, name: "Cream Floral Statement Top", price: 1399, oldPrice: 1999, discount: "30% OFF", category: "Tops", image1: "https://picsum.photos/id/1083/600/800", image2: "https://picsum.photos/id/1084/600/800" },
  { id: 9, name: "Modern Drape Saree", price: 2899, oldPrice: 3799, discount: "24% OFF", category: "Sarees", image1: "https://picsum.photos/id/1085/600/800", image2: "https://picsum.photos/id/1086/600/800" },
  { id: 10, name: "Chic Beige Shirt Dress", price: 2399, oldPrice: 3299, discount: "27% OFF", category: "Western Wear", image1: "https://picsum.photos/id/1087/600/800", image2: "https://picsum.photos/id/1089/600/800" }
];

const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const getCart = () => JSON.parse(localStorage.getItem("sakhi_cart") || "[]");
const saveCart = (cart) => localStorage.setItem("sakhi_cart", JSON.stringify(cart));

function updateCartBadge() {
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.dataset.count = count;
  });
}

function addToCart(productId) {
  const product = PRODUCTS.find((p) => p.id === Number(productId));
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image1, qty: 1 });
  }

  saveCart(cart);
  updateCartBadge();
}

function removeFromCart(productId) {
  const updated = getCart().filter((item) => item.id !== productId);
  saveCart(updated);
  updateCartBadge();
  renderCartPage();
}

function changeQty(productId, delta) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart(cart);
  updateCartBadge();
  renderCartPage();
}

function createProductCard(product) {
  return `
    <article class="product-card">
      <a class="product-media" href="product.html?id=${product.id}" aria-label="View ${product.name}">
        <img class="img-primary" src="${product.image1}" alt="${product.name}" loading="lazy" width="600" height="800" />
        <img class="img-secondary" src="${product.image2}" alt="${product.name} alternate view" loading="lazy" width="600" height="800" />
        <span class="badge">${product.discount}</span>
      </a>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <div class="price-row">
          <span class="price">${INR.format(product.price)}</span>
          <span class="old-price">${INR.format(product.oldPrice)}</span>
        </div>
        <div class="product-actions">
          <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">Add to Cart</button>
          <button class="icon-btn wishlist-btn" aria-label="Add ${product.name} to wishlist">&#9825;</button>
        </div>
      </div>
    </article>
  `;
}

function renderGrid(selector, products) {
  const grid = document.querySelector(selector);
  if (!grid) return;
  grid.innerHTML = products.map(createProductCard).join("");
}

function initHomeSections() {
  renderGrid("#featured-products", PRODUCTS.slice(0, 4));
  renderGrid("#new-arrivals", PRODUCTS.slice(4, 8));
  renderGrid("#best-sellers", PRODUCTS.slice(2, 6));
}

function initShopPage() {
  const shopGrid = document.querySelector("#shop-products");
  if (!shopGrid) return;

  const filterButtons = [...document.querySelectorAll(".filter-btn")];
  let filtered = [...PRODUCTS];

  const applyCategoryFilter = (category) => {
    const validCategory = filterButtons.some((btn) => btn.dataset.category === category) ? category : "All";
    filterButtons.forEach((node) => node.classList.toggle("active", node.dataset.category === validCategory));
    filtered = validCategory === "All" ? [...PRODUCTS] : PRODUCTS.filter((p) => p.category === validCategory);
    renderGrid("#shop-products", filtered);
  };

  applyCategoryFilter("All");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyCategoryFilter(btn.dataset.category);
    });
  });

  const params = new URLSearchParams(window.location.search);
  const queryCategory = params.get("category");
  if (queryCategory) {
    applyCategoryFilter(queryCategory);
  }

  const searchInput = document.querySelector("#shop-search");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      const shown = filtered.filter((item) => item.name.toLowerCase().includes(q));
      renderGrid("#shop-products", shown);
    });
  }
}
function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  if (!slides.length) return;

  let idx = 0;
  setInterval(() => {
    slides[idx].classList.remove("active");
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add("active");
  }, 4000);
}

function initMobileNav() {
  const toggle = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav-links");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

function initWishlistToggle() {
  document.addEventListener("click", (e) => {
    const target = e.target.closest(".wishlist-btn");
    if (!target) return;
    target.classList.toggle("active");
    target.innerHTML = target.classList.contains("active") ? "&#9829;" : "&#9825;";
  });
}

function initAddToCart() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart");
    if (!btn) return;
    addToCart(btn.dataset.productId);
    btn.textContent = "Added";
    setTimeout(() => {
      btn.textContent = "Add to Cart";
    }, 800);
  });
}

function initProductPage() {
  const root = document.querySelector("#product-detail-root");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id") || 1);
  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

  root.innerHTML = `
    <div class="detail-gallery">
      <div class="zoom-wrap" id="zoom-wrap">
        <img id="zoom-image" src="${product.image1}" alt="${product.name}" width="700" height="900" />
      </div>
    </div>
    <div>
      <h1 class="section-title">${product.name}</h1>
      <p class="product-meta">Category: ${product.category}</p>
      <div class="price-row">
        <span class="price">${INR.format(product.price)}</span>
        <span class="old-price">${INR.format(product.oldPrice)}</span>
        <span class="badge badge-inline">${product.discount}</span>
      </div>
      <p class="product-description">Crafted for elegant everyday looks with breathable comfort and premium finishing. Perfect for brunches, office styling, and festive layering.</p>
      <div class="product-actions product-actions-compact">
        <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">Add to Cart</button>
        <button class="icon-btn wishlist-btn" aria-label="Add ${product.name} to wishlist">&#9825;</button>
      </div>
      <div class="detail-notes">
        <p>Free shipping on orders above INR 999</p>
        <p>7-day easy return policy</p>
      </div>
    </div>
  `;

  const wrap = document.querySelector("#zoom-wrap");
  const image = document.querySelector("#zoom-image");
  if (wrap && image) {
    wrap.addEventListener("mousemove", (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      image.style.transformOrigin = `${x}% ${y}%`;
      image.style.transform = "scale(1.4)";
    });

    wrap.addEventListener("mouseleave", () => {
      image.style.transform = "scale(1)";
      image.style.transformOrigin = "center";
    });
  }

  renderGrid("#related-products", PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4));
}

function renderCartPage() {
  const itemsRoot = document.querySelector("#cart-items");
  const totalRoot = document.querySelector("#cart-total");
  const emptyRoot = document.querySelector("#empty-cart");
  if (!itemsRoot || !totalRoot || !emptyRoot) return;

  const cart = getCart();
  if (!cart.length) {
    itemsRoot.innerHTML = "";
    emptyRoot.style.display = "block";
    totalRoot.textContent = INR.format(0);
    return;
  }

  emptyRoot.style.display = "none";
  itemsRoot.innerHTML = cart.map((item) => `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.name}" width="120" height="150" loading="lazy" />
      <div>
        <h3>${item.name}</h3>
        <p>${INR.format(item.price)}</p>
        <div class="cart-item-row">
          <div class="qty-controls">
            <button type="button" class="qty-btn" data-id="${item.id}" data-delta="-1" aria-label="Decrease quantity">-</button>
            <span>${item.qty}</span>
            <button type="button" class="qty-btn" data-id="${item.id}" data-delta="1" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn btn-sm" data-remove="${item.id}">Remove</button>
        </div>
      </div>
    </article>
  `).join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalRoot.textContent = INR.format(total);
}

function initCartActions() {
  document.addEventListener("click", (e) => {
    const qtyBtn = e.target.closest(".qty-btn");
    if (qtyBtn) {
      changeQty(Number(qtyBtn.dataset.id), Number(qtyBtn.dataset.delta));
      return;
    }

    const removeBtn = e.target.closest("[data-remove]");
    if (removeBtn) {
      removeFromCart(Number(removeBtn.dataset.remove));
    }
  });
}

function initAuthSwitch() {
  const authCard = document.querySelector(".auth-card");
  if (!authCard) return;

  const tabs = [...document.querySelectorAll(".auth-tab")];
  const forms = {
    login: document.querySelector("#login-form"),
    signup: document.querySelector("#signup-form")
  };

  const setMode = (mode) => {
    const target = mode === "signup" ? "signup" : "login";
    tabs.forEach((tab) => {
      const active = tab.dataset.authTarget === target;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    Object.entries(forms).forEach(([key, form]) => {
      if (!form) return;
      form.classList.toggle("active", key === target);
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setMode(tab.dataset.authTarget));
  });

  document.querySelectorAll("[data-auth-link]").forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.dataset.authLink));
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get("mode") === "signup") {
    setMode("signup");
  }
}
function initForms() {
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = contactForm.querySelector("#contact-name");
      const email = contactForm.querySelector("#contact-email");
      const message = contactForm.querySelector("#contact-message");
      const error = contactForm.querySelector(".form-error");

      if (name.value.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(email.value) || message.value.trim().length < 10) {
        error.textContent = "Please enter a valid name, email, and message (minimum 10 characters).";
        return;
      }

      error.textContent = "Message sent successfully. Our team will contact you soon.";
      contactForm.reset();
    });
  }

  const loginForm = document.querySelector("#login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm.querySelector("#login-email");
      const password = loginForm.querySelector("#login-password");
      const error = loginForm.querySelector(".form-error");

      if (!/^\S+@\S+\.\S+$/.test(email.value) || password.value.length < 6) {
        error.textContent = "Use a valid email and password with at least 6 characters.";
        return;
      }

      error.textContent = "Login UI validation successful (frontend demo).";
      loginForm.reset();
    });
  }

  const signupForm = document.querySelector("#signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = signupForm.querySelector("#signup-name");
      const email = signupForm.querySelector("#signup-email");
      const pass = signupForm.querySelector("#signup-password");
      const confirm = signupForm.querySelector("#signup-confirm");
      const error = signupForm.querySelector(".form-error");

      if (name.value.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(email.value) || pass.value.length < 6 || pass.value !== confirm.value) {
        error.textContent = "Check name/email and ensure passwords match with at least 6 characters.";
        return;
      }

      error.textContent = "Signup UI validation successful (frontend demo).";
      signupForm.reset();
    });
  }

  const newsletter = document.querySelector("#newsletter-form");
  if (newsletter) {
    newsletter.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = newsletter.querySelector("input");
      const feedback = newsletter.querySelector(".form-error");
      if (!/^\S+@\S+\.\S+$/.test(email.value)) {
        feedback.textContent = "Please enter a valid email address.";
        return;
      }
      feedback.textContent = "Subscribed successfully to Sakhi updates.";
      newsletter.reset();
    });
  }
}

function initScrollTop() {
  const btn = document.querySelector("#scroll-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 300);
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initHeroSlider();
  initHomeSections();
  initShopPage();
  initProductPage();
  initAddToCart();
  initWishlistToggle();
  initCartActions();
  initAuthSwitch();
  initForms();
  initScrollTop();
  renderCartPage();
  updateCartBadge();
});




