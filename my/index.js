// ============================================
// 고객 - 마이페이지
// ============================================

function renderSummary() {
  const orders = getOrders();
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  $('#totalOrders').textContent = `${orders.length}건`;
  $('#totalSpent').textContent = formatPrice(totalSpent);
}

function renderFavorites() {
  const menus = getFavorites().map(id => getMenuById(id)).filter(Boolean);
  const grid = $('#favoriteGrid');
  const emptyState = $('#favoriteEmptyState');

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

function renderRecentOrders() {
  const orders = getOrders().slice().reverse().slice(0, 3);
  const container = $('#recentOrders');
  const emptyState = $('#emptyState');

  if (orders.length === 0) {
    container.innerHTML = '';
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  renderList(container, orders, (order) => {
    const itemSummary = order.items.length > 1
      ? `${escapeHtml(order.items[0].name)} 외 ${order.items.length - 1}건`
      : escapeHtml(order.items[0].name);

    return `
      <div class="order-card">
        <a href="../orders/detail.html?id=${order.id}" class="order-card__link">
          <div class="order-card__header">
            <span class="badge ${getStatusBadgeClass(order.status)}">${getStatusLabel(order.status)}</span>
            <span class="order-card__date">${formatDate(order.createdAt)}</span>
          </div>
          <p class="order-card__items">${itemSummary}</p>
          <p class="order-card__total">${formatPrice(order.total)}</p>
        </a>
        <button class="btn btn-sm order-card__reorder" data-reorder="${escapeHtml(order.id)}">다시 담기</button>
      </div>
    `;
  });
}

function handleReorderClick(e) {
  const btn = e.target.closest('[data-reorder]');
  if (!btn) return;
  const order = getOrderById(btn.dataset.reorder);
  if (order) reorder(order);
}

function init() {
  renderCartBadge();
  renderSummary();
  renderFavorites();
  renderRecentOrders();
  $('#recentOrders').addEventListener('click', handleReorderClick);
  $('#favoriteGrid').addEventListener('click', handleFavoriteGridClick);
}

document.addEventListener('DOMContentLoaded', init);
