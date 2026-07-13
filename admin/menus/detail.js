// ============================================
// 관리자 - 메뉴 상세
// ============================================

requireAdmin();

function getMenuIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get('id'));
}

function renderNotFound(container) {
  container.innerHTML = `
    <div class="detail-card__not-found">
      <p>메뉴를 찾을 수 없습니다.</p>
    </div>
  `;
}

function renderMenuDetail(container, menu) {
  container.innerHTML = `
    <div class="detail-card__image">
      ${menu.image
        ? `<img src="${escapeHtml(menu.image)}" alt="${escapeHtml(menu.name)}">`
        : '<div class="detail-card__no-image">☕</div>'}
    </div>
    <div class="detail-card__body">
      <span class="detail-card__category">${getCategoryName(menu.category)}</span>
      <h1 class="detail-card__name">${escapeHtml(menu.name)}</h1>
      <p class="detail-card__price">${formatPrice(menu.price)}</p>
      <p class="detail-card__description">${escapeHtml(menu.description)}</p>
      <div class="detail-card__actions">
        <a href="edit.html?id=${menu.id}" class="btn btn-primary">수정</a>
        <button id="deleteBtn" class="btn btn-danger">삭제</button>
      </div>
    </div>
  `;

  $('#deleteBtn').addEventListener('click', () => {
    if (confirm(`'${menu.name}' 메뉴를 삭제하시겠습니까?`)) {
      deleteMenu(menu.id);
      showToast(`'${menu.name}' 메뉴를 삭제했습니다.`);
      setTimeout(() => { window.location.href = 'list.html'; }, 900);
    }
  });
}

function init() {
  const container = $('#detailCard');
  const menu = getMenuById(getMenuIdFromUrl());

  if (!menu) {
    renderNotFound(container);
    return;
  }
  renderMenuDetail(container, menu);
}

document.addEventListener('DOMContentLoaded', init);
