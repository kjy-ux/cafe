// ============================================
// 고객 - 메인 페이지
// ============================================

function renderFeaturedMenus() {
  const menus = getMenus();
  const featured = CATEGORIES
    .map(cat => menus.find(m => m.category === cat.id))
    .filter(Boolean);

  renderList($('#featuredGrid'), featured, (menu) => `
    <a href="menus/detail.html?id=${menu.id}" class="menu-card">
      <div class="menu-card__image-link">
        ${menu.image
          ? `<img src="${escapeHtml(menu.image)}" alt="${escapeHtml(menu.name)}">`
          : '<div class="menu-card__no-image">☕</div>'}
      </div>
      <div class="menu-card__body">
        <span class="menu-card__category">${getCategoryName(menu.category)}</span>
        <span class="menu-card__name">${escapeHtml(menu.name)}</span>
        <p class="menu-card__price">${formatPrice(menu.price)}</p>
      </div>
    </a>
  `);
}

function init() {
  renderCartBadge();
  renderFeaturedMenus();
}

document.addEventListener('DOMContentLoaded', init);
