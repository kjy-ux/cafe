// ============================================
// 공통 유틸리티
// ============================================

// ---- 가격 포맷팅 ----
function formatPrice(price) {
  return price.toLocaleString('ko-KR') + '원';
}

// ---- 데이터 ID 생성 ----
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// ---- 카테고리 이름 ----
function getCategoryName(id) {
  const cat = CATEGORIES.find(c => c.id === id);
  return cat ? cat.name : id;
}

// ---- 상태 라벨 ----
function getStatusLabel(value) {
  const status = Object.values(ORDER_STATUS).find(s => s.value === value);
  return status ? status.label : value;
}

// ---- 상태 배지 클래스 (css/variables.css의 .badge--* 와 매칭) ----
function getStatusBadgeClass(value) {
  return `badge--${value}`;
}

// ============================================
// 메뉴 옵션 (data.js의 MENU_OPTIONS, CATEGORY_OPTIONS)
// ============================================

// ---- 카테고리 기본 옵션 (예: HOT, Regular, 샷 없음) ----
function getDefaultOptions(category) {
  const keys = CATEGORY_OPTIONS[category] || [];
  const defaults = {};
  keys.forEach(key => { defaults[key] = MENU_OPTIONS[key].choices[0].id; });
  return defaults;
}

// ---- 선택된 옵션들의 추가 금액 합 ----
function getOptionsPriceDelta(category, options) {
  const keys = CATEGORY_OPTIONS[category] || [];
  return keys.reduce((sum, key) => {
    const choice = MENU_OPTIONS[key]?.choices.find(c => c.id === options[key]);
    return sum + (choice ? choice.priceDelta : 0);
  }, 0);
}

// ---- 선택된 옵션들을 "ICE · Large" 같은 문자열로 표시 ----
function formatOptionsLabel(category, options) {
  if (!options) return '';
  const keys = CATEGORY_OPTIONS[category] || [];
  const labels = keys
    .map(key => MENU_OPTIONS[key]?.choices.find(c => c.id === options[key])?.name)
    .filter(Boolean);
  return labels.join(' · ');
}

// ---- 조사 선택 (받침 유무에 따라 을/를, 이/가, 은/는 등) ----
function hasBatchim(str) {
  const lastChar = str.charCodeAt(str.length - 1);
  if (lastChar < 0xAC00 || lastChar > 0xD7A3) return false;
  return (lastChar - 0xAC00) % 28 !== 0;
}

function josa(word, withBatchim, withoutBatchim) {
  return hasBatchim(word) ? withBatchim : withoutBatchim;
}

// ---- HTML 이스케이프 (사용자 입력을 innerHTML에 넣을 때 사용) ----
function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(str).replace(/[&<>"']/g, (c) => map[c]);
}

// ---- 날짜 포맷팅 ----
function formatDate(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}`;
}

// ============================================
// 장바구니 (localStorage)
// ============================================

const CART_KEY = 'cafe_cart';

function getCart() {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(menuId, quantity = 1, options = {}) {
  const cart = getCart();
  const item = getMenuById(menuId);
  if (!item) return;

  const unitPrice = item.price + getOptionsPriceDelta(item.category, options);
  const optionsKey = JSON.stringify(options);
  const existing = cart.find(c => c.menuId === menuId && JSON.stringify(c.options || {}) === optionsKey);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      lineId: generateId(),
      menuId: item.id,
      name: item.name,
      price: unitPrice,
      category: item.category,
      options,
      quantity
    });
  }
  saveCart(cart);
}

function removeFromCart(lineId) {
  let cart = getCart();
  cart = cart.filter(c => c.lineId !== lineId);
  saveCart(cart);
}

function updateCartQuantity(lineId, quantity) {
  const cart = getCart();
  const item = cart.find(c => c.lineId === lineId);
  if (item) {
    if (quantity <= 0) {
      removeFromCart(lineId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
    }
  }
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function clearCart() {
  saveCart([]);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

// ---- 헤더 장바구니 배지 갱신 (id="cartBadge" 요소가 있는 페이지에서 사용) ----
function renderCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count;
  badge.hidden = count === 0;
}

// ============================================
// 메뉴 저장 (localStorage, MENU_ITEMS로 초기화)
// ============================================

const MENUS_KEY = 'cafe_menus';

function getMenus() {
  const data = localStorage.getItem(MENUS_KEY);
  if (data) return JSON.parse(data);
  saveMenus(MENU_ITEMS);
  return [...MENU_ITEMS];
}

function saveMenus(menus) {
  localStorage.setItem(MENUS_KEY, JSON.stringify(menus));
}

function getMenuById(id) {
  return getMenus().find(m => m.id === id);
}

function addMenu(menu) {
  const menus = getMenus();
  const newId = menus.length ? Math.max(...menus.map(m => m.id)) + 1 : 1;
  const newMenu = { id: newId, ...menu };
  menus.push(newMenu);
  saveMenus(menus);
  return newMenu;
}

function updateMenu(id, updates) {
  const menus = getMenus();
  const menu = menus.find(m => m.id === id);
  if (menu) {
    Object.assign(menu, updates);
    saveMenus(menus);
  }
  return menu;
}

function deleteMenu(id) {
  const menus = getMenus().filter(m => m.id !== id);
  saveMenus(menus);
}

// ============================================
// 주문 저장 (localStorage)
// ============================================

const ORDERS_KEY = 'cafe_orders';

function getOrders() {
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function createOrder(items, total) {
  const orders = getOrders();
  const order = {
    id: generateId(),
    items,
    total,
    status: ORDER_STATUS.PENDING.value,
    createdAt: new Date().toISOString(),
    completedAt: null
  };
  orders.push(order);
  saveOrders(orders);
  return order;
}

function getOrderById(id) {
  const orders = getOrders();
  return orders.find(o => o.id === id);
}

// ---- 재주문: 지난 주문의 아이템을 장바구니에 다시 담기 (고객 페이지 전용) ----
function reorder(order) {
  let addedCount = 0;
  order.items.forEach(item => {
    if (getMenuById(item.menuId)) {
      addToCart(item.menuId, item.quantity, item.options || {});
      addedCount++;
    }
  });
  renderCartBadge();

  if (addedCount === 0) {
    showToast('현재 판매하지 않는 메뉴라 담을 수 없습니다.', 'error');
  } else if (addedCount < order.items.length) {
    showToast('일부 메뉴만 장바구니에 담았습니다.');
  } else {
    showToast('장바구니에 다시 담았습니다.');
  }
}

function updateOrderStatus(id, status) {
  const orders = getOrders();
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    if (status === ORDER_STATUS.COMPLETED.value) {
      order.completedAt = new Date().toISOString();
    }
    saveOrders(orders);
  }
}

// ============================================
// 즐겨찾기 (localStorage)
// ============================================

const FAVORITES_KEY = 'cafe_favorites';

function getFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function isFavorite(menuId) {
  return getFavorites().includes(menuId);
}

function toggleFavorite(menuId) {
  let favorites = getFavorites();
  if (favorites.includes(menuId)) {
    favorites = favorites.filter(id => id !== menuId);
  } else {
    favorites.push(menuId);
  }
  saveFavorites(favorites);
  return favorites.includes(menuId);
}

// ============================================
// 나만의 레시피 (localStorage) - 옵션을 조합해 이름 붙여 저장, 재주문
// ============================================

const RECIPES_KEY = 'cafe_recipes';

function getRecipes() {
  const data = localStorage.getItem(RECIPES_KEY);
  return data ? JSON.parse(data) : [];
}

function saveRecipes(recipes) {
  localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
}

function addRecipe(name, menu, options) {
  const recipes = getRecipes();
  const unitPrice = menu.price + getOptionsPriceDelta(menu.category, options);
  const recipe = {
    id: generateId(),
    name,
    menuId: menu.id,
    menuName: menu.name,
    category: menu.category,
    options,
    unitPrice,
    createdAt: new Date().toISOString()
  };
  recipes.push(recipe);
  saveRecipes(recipes);
  return recipe;
}

function deleteRecipe(id) {
  const recipes = getRecipes().filter(r => r.id !== id);
  saveRecipes(recipes);
}

// ---- 저장된 레시피를 장바구니에 담기 (고객 페이지 전용) ----
function addRecipeToCart(recipe) {
  if (!getMenuById(recipe.menuId)) {
    showToast('현재 판매하지 않는 메뉴라 담을 수 없습니다.', 'error');
    return;
  }
  addToCart(recipe.menuId, 1, recipe.options);
  renderCartBadge();
  showToast(`'${recipe.name}' 레시피를 장바구니에 담았습니다.`);
}

// ---- 즐겨찾기/레시피 렌더링 (마이페이지, 나만의 메뉴 페이지 공용) ----
// 대상 페이지에 #favoriteGrid/#favoriteEmptyState, #recipeList/#recipeEmptyState 요소가 있어야 함
function renderFavorites() {
  const grid = $('#favoriteGrid');
  const emptyState = $('#favoriteEmptyState');
  if (!grid) return;

  const menus = getFavorites().map(id => getMenuById(id)).filter(Boolean);

  if (menus.length === 0) {
    grid.innerHTML = '';
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  renderList(grid, menus, (menu) => `
    <div class="menu-card" data-id="${menu.id}">
      <div class="menu-card__image-wrap">
        <a href="../menus/detail.html?id=${menu.id}" class="menu-card__image-link">
          ${menu.image
            ? `<img src="${escapeHtml(menu.image)}" alt="${escapeHtml(menu.name)}">`
            : '<div class="menu-card__no-image">☕</div>'}
        </a>
        <button type="button" class="menu-card__favorite is-active" data-favorite="${menu.id}" aria-label="즐겨찾기 해제">♥</button>
      </div>
      <div class="menu-card__body">
        <span class="menu-card__category">${getCategoryName(menu.category)}</span>
        <a href="../menus/detail.html?id=${menu.id}" class="menu-card__name">${escapeHtml(menu.name)}</a>
        <p class="menu-card__price">${formatPrice(menu.price)}</p>
      </div>
    </div>
  `);
}

function handleFavoriteGridClick(e) {
  const favBtn = e.target.closest('[data-favorite]');
  if (!favBtn) return;
  toggleFavorite(Number(favBtn.dataset.favorite));
  renderFavorites();
}

function renderRecipes() {
  const list = $('#recipeList');
  const emptyState = $('#recipeEmptyState');
  if (!list) return;

  const recipes = getRecipes().slice().reverse();

  if (recipes.length === 0) {
    list.innerHTML = '';
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  renderList(list, recipes, (recipe) => {
    const label = formatOptionsLabel(recipe.category, recipe.options);
    return `
      <div class="recipe-card" data-id="${recipe.id}">
        <div class="recipe-card__info">
          <span class="recipe-card__name">${escapeHtml(recipe.name)}</span>
          <span class="recipe-card__detail">${escapeHtml(recipe.menuName)}${label ? ` · ${escapeHtml(label)}` : ''}</span>
          <span class="recipe-card__price">${formatPrice(recipe.unitPrice)}</span>
        </div>
        <div class="recipe-card__actions">
          <button class="btn btn-sm" data-recipe-reorder="${recipe.id}">담기</button>
          <button class="recipe-card__delete" data-recipe-delete="${recipe.id}" aria-label="레시피 삭제">✕</button>
        </div>
      </div>
    `;
  });
}

function handleRecipeListClick(e) {
  const reorderBtn = e.target.closest('[data-recipe-reorder]');
  if (reorderBtn) {
    const recipe = getRecipes().find(r => r.id === reorderBtn.dataset.recipeReorder);
    if (recipe) addRecipeToCart(recipe);
    return;
  }
  const deleteBtn = e.target.closest('[data-recipe-delete]');
  if (deleteBtn) {
    deleteRecipe(deleteBtn.dataset.recipeDelete);
    renderRecipes();
  }
}

// ============================================
// 회원가입 / 로그인 (localStorage 흉내내기 - 실제 인증 아님, 비밀번호 평문 저장)
// ============================================

const USERS_KEY = 'cafe_users';
const CURRENT_USER_KEY = 'cafe_current_user';

function getUsers() {
  const data = localStorage.getItem(USERS_KEY);
  if (data) return JSON.parse(data);
  const seeded = [{ id: 'admin', name: '관리자', email: 'admin@cafe.com', password: 'admin1234', isAdmin: true }];
  saveUsers(seeded);
  return seeded;
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUserByEmail(email) {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

function getCurrentUser() {
  const email = localStorage.getItem(CURRENT_USER_KEY);
  return email ? findUserByEmail(email) : null;
}

function signup(name, email, password) {
  if (findUserByEmail(email)) {
    return { ok: false, message: '이미 가입된 이메일입니다.' };
  }
  const users = getUsers();
  users.push({ id: generateId(), name, email, password });
  saveUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, email);
  return { ok: true };
}

function login(email, password) {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return { ok: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
  }
  localStorage.setItem(CURRENT_USER_KEY, user.email);
  return { ok: true };
}

function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// ---- 헤더 로그인/회원가입 또는 사용자명/로그아웃 표시 (id="authNav" 요소가 있는 페이지에서 사용) ----
function renderAuthNav() {
  const container = $('#authNav');
  if (!container) return;

  const brand = $('.site-header__brand');
  const prefix = brand ? brand.getAttribute('href').replace(/index\.html$/, '') : '';
  const user = getCurrentUser();

  if (user) {
    container.innerHTML = `
      ${user.isAdmin ? `<a href="${prefix}admin/index.html">관리자 페이지</a>` : ''}
      <span class="auth-nav__user">${escapeHtml(user.name)}님</span>
      <button type="button" class="auth-nav__logout" id="logoutBtn">로그아웃</button>
    `;
    $('#logoutBtn', container).addEventListener('click', () => {
      logout();
      renderAuthNav();
      showToast('로그아웃 되었습니다.');
    });
  } else {
    container.innerHTML = `
      <a href="${prefix}auth/login.html">로그인</a>
      <a href="${prefix}auth/signup.html">회원가입</a>
    `;
  }
}

document.addEventListener('DOMContentLoaded', renderAuthNav);

// ---- 관리자 페이지 접근 제한 (admin 페이지 스크립트 최상단에서 호출) ----
function requireAdmin() {
  const user = getCurrentUser();
  if (user && user.isAdmin) return;
  const utilsScript = document.querySelector('script[src$="js/utils.js"]');
  const prefix = utilsScript ? utilsScript.getAttribute('src').replace('js/utils.js', '') : '';
  window.location.replace(prefix + 'index.html');
}

// ============================================
// DOM 헬퍼
// ============================================

function $(selector, parent = document) {
  return parent.querySelector(selector);
}

function $$(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

function renderList(container, items, renderFn) {
  container.innerHTML = items.map(renderFn).join('');
}

// ============================================
// 토스트 알림
// ============================================

function showToast(message, type = 'info') {
  let container = $('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast${type === 'error' ? ' toast--error' : ''}`;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast--show'));

  setTimeout(() => {
    toast.classList.remove('toast--show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 2200);
}
