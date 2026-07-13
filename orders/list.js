// ============================================
// 고객 - 주문내역 목록
// ============================================

function renderOrderList() {
  const orders = getMyOrders().slice().reverse();
  const container = $('#orderList');
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
        <a href="detail.html?id=${order.id}" class="order-card__link">
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
  renderOrderList();
  $('#orderList').addEventListener('click', handleReorderClick);
}

document.addEventListener('DOMContentLoaded', init);
