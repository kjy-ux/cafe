// ============================================
// 고객 - 주문 상세
// ============================================

function getOrderIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function renderNotFound(container) {
  container.innerHTML = `
    <div class="order-detail__not-found">
      <p>주문을 찾을 수 없습니다.</p>
    </div>
  `;
}

function renderOrderDetail(container, order) {
  container.innerHTML = `
    <div class="order-detail__header">
      <div>
        <span class="badge ${getStatusBadgeClass(order.status)}">${getStatusLabel(order.status)}</span>
        <p class="order-detail__id">주문번호 ${escapeHtml(order.id)}</p>
      </div>
      <span class="order-detail__date">${formatDate(order.createdAt)}</span>
    </div>
    <div class="order-detail__items">
      ${order.items.map(item => {
        const optionsLabel = formatOptionsLabel(item.category, item.options);
        return `
          <div class="order-detail__item">
            <span class="order-detail__item-name">
              ${escapeHtml(item.name)}${optionsLabel ? ` <span class="order-detail__item-options">(${escapeHtml(optionsLabel)})</span>` : ''} × ${item.quantity}
            </span>
            <span class="order-detail__item-subtotal">${formatPrice(item.price * item.quantity)}</span>
          </div>
        `;
      }).join('')}
    </div>
    <div class="order-detail__total">
      <span>총 금액</span>
      <span>${formatPrice(order.total)}</span>
    </div>
    <div class="order-detail__actions">
      <button id="reorderBtn" class="btn btn-primary">다시 담기</button>
    </div>
  `;

  $('#reorderBtn').addEventListener('click', () => reorder(order));
}

function init() {
  renderCartBadge();
  const container = $('#orderDetail');
  const order = getOrderById(getOrderIdFromUrl());

  if (!order) {
    renderNotFound(container);
    return;
  }
  renderOrderDetail(container, order);
}

document.addEventListener('DOMContentLoaded', init);
