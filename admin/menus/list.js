// ============================================
// 관리자 - 메뉴 목록
// ============================================

let currentCategory = 'all';

function renderFilterTabs() {
  const tabsHtml = CATEGORIES.map(cat =>
    `<button class="filter-tab" data-category="${cat.id}">${cat.name}</button>`
  ).join('');
  $('#filterTabs').insertAdjacentHTML('beforeend', tabsHtml);
}

function renderMenuTable() {
  const menus = getMenus().filter(m => currentCategory === 'all' || m.category === currentCategory);
  const tbody = $('#menuTableBody');
  const emptyState = $('#emptyState');

  if (menus.length === 0) {
    tbody.innerHTML = '';
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  renderList(tbody, menus, (menu) => `
    <tr data-id="${menu.id}">
      <td class="menu-table__image">
        ${menu.image
          ? `<img src="${escapeHtml(menu.image)}" alt="${escapeHtml(menu.name)}">`
          : '<div class="menu-table__no-image">☕</div>'}
      </td>
      <td>${escapeHtml(menu.name)}</td>
      <td>${getCategoryName(menu.category)}</td>
      <td>${formatPrice(menu.price)}</td>
      <td class="menu-table__actions">
        <a href="detail.html?id=${menu.id}" class="btn btn-sm">상세</a>
        <a href="edit.html?id=${menu.id}" class="btn btn-sm">수정</a>
        <button class="btn btn-sm btn-danger" data-delete="${menu.id}">삭제</button>
      </td>
    </tr>
  `);
}

function handleFilterClick(e) {
  const tab = e.target.closest('.filter-tab');
  if (!tab) return;
  $$('.filter-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  currentCategory = tab.dataset.category;
  renderMenuTable();
}

function handleTableClick(e) {
  const deleteBtn = e.target.closest('[data-delete]');
  if (!deleteBtn) return;
  const id = Number(deleteBtn.dataset.delete);
  const menu = getMenuById(id);
  if (menu && confirm(`'${menu.name}' 메뉴를 삭제하시겠습니까?`)) {
    deleteMenu(id);
    renderMenuTable();
    showToast(`'${menu.name}' 메뉴를 삭제했습니다.`);
  }
}

function init() {
  renderFilterTabs();
  renderMenuTable();
  $('#filterTabs').addEventListener('click', handleFilterClick);
  $('#menuTableBody').addEventListener('click', handleTableClick);
}

document.addEventListener('DOMContentLoaded', init);
