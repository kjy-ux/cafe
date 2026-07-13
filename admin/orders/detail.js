// ============================================
// 관리자 - 주문 상세
// ============================================

requireAdmin();

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

function statusOptions(selected) {
  return Object.values(ORDER_STATUS).map(s =>
    `<option value="${s.value}" ${s.value === selected ? 'selected' : ''}>${s.label}</option>`
  ).join('');
}

function renderOrderDetail(container, order) {
  container.innerHTML = `
    <div class="order-detail__header">
      <div>
        <select class="status-select" id="statusSelect">
          ${statusOptions(order.status)}
        </select>
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
  `;

  $('#statusSelect').addEventListener('change', (e) => {
    updateOrderStatus(order.id, e.target.value);
    showToast('주문 상태를 변경했습니다.');
  });
}

function init() {
  const container = $('#orderDetail');
  const order = getOrderById(getOrderIdFromUrl());

  if (!order) {
    renderNotFound(container);
    return;
  }
  renderOrderDetail(container, order);
}

document.addEventListener('DOMContentLoaded', init);
