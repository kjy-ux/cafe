// ============================================
// 고객 - 메뉴 목록
// ============================================

let currentCategory = 'all';
let currentSearch = '';

function renderFilterTabs() {
  const tabsHtml = CATEGORIES.map(cat =>
    `<button class="filter-tab" data-category="${cat.id}">${cat.name}</button>`
  ).join('');
  $('#filterTabs').insertAdjacentHTML('beforeend', tabsHtml);
}

function renderMenuGrid() {
  const keyword = currentSearch.trim().toLowerCase();
  const menus = getMenus().filter(m =>
    (currentCategory === 'all' || m.category === currentCategory) &&
    (keyword === '' || m.name.toLowerCase().includes(keyword))
  );
  const grid = $('#menuGrid');

  if (menus.length === 0) {
    grid.innerHTML = `<p class="empty-state">${keyword ? '검색 결과가 없습니다.' : '등록된 메뉴가 없습니다.'}</p>`;
    return;
  }

  renderList(grid, menus, (menu) => `
    <div class="menu-card" data-id="${menu.id}">
      <div class="menu-card__image-wrap">
        <a href="detail.html?id=${menu.id}" class="menu-card__image-link">
          ${menu.image
            ? `<img src="${escapeHtml(menu.image)}" alt="${escapeHtml(menu.name)}">`
            : '<div class="menu-card__no-image">☕</div>'}
        </a>
        <button type="button" class="menu-card__favorite${isFavorite(menu.id) ? ' is-active' : ''}" data-favorite="${menu.id}" aria-label="즐겨찾기">♥</button>
      </div>
      <div class="menu-card__body">
        <span class="menu-card__category">${getCategoryName(menu.category)}</span>
        <a href="detail.html?id=${menu.id}" class="menu-card__name">${escapeHtml(menu.name)}</a>
        <p class="menu-card__price">${formatPrice(menu.price)}</p>
        <button class="btn btn-primary btn-sm menu-card__add-btn" data-add="${menu.id}">담기</button>
      </div>
    </div>
  `);
}

function handleFilterClick(e) {
  const tab = e.target.closest('.filter-tab');
  if (!tab) return;
  $$('.filter-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  currentCategory = tab.dataset.category;
  renderMenuGrid();
}

function handleGridClick(e) {
  const favBtn = e.target.closest('[data-favorite]');
  if (favBtn) {
    const isFav = toggleFavorite(Number(favBtn.dataset.favorite));
    favBtn.classList.toggle('is-active', isFav);
    return;
  }

  const addBtn = e.target.closest('[data-add]');
  if (!addBtn) return;
  const id = Number(addBtn.dataset.add);
  const menu = getMenuById(id);
  if (!menu) return;
  addToCart(id, 1, getDefaultOptions(menu.category));
  renderCartBadge();
  showToast(`'${menu.name}'${josa(menu.name, '을', '를')} 장바구니에 담았습니다.`);
}

function handleSearchInput(e) {
  currentSearch = e.target.value;
  renderMenuGrid();
}

function init() {
  renderFilterTabs();
  renderMenuGrid();
  renderCartBadge();
  $('#filterTabs').addEventListener('click', handleFilterClick);
  $('#menuGrid').addEventListener('click', handleGridClick);
  $('#searchInput').addEventListener('input', handleSearchInput);
}

document.addEventListener('DOMContentLoaded', init);
