// ============================================
// 관리자 - 대시보드
// ============================================

requireAdmin();

function renderStats() {
  const menus = getMenus();
  const orders = getOrders();
  const pending = orders.filter(o => o.status === ORDER_STATUS.PENDING.value);
  const revenue = orders
    .filter(o => o.status !== ORDER_STATUS.CANCELLED.value)
    .reduce((sum, o) => sum + o.total, 0);

  $('#statMenus').textContent = `${menus.length}개`;
  $('#statOrders').textContent = `${orders.length}건`;
  $('#statPending').textContent = `${pending.length}건`;
  $('#statRevenue').textContent = formatPrice(revenue);
}

function renderRecentOrders() {
  const orders = getOrders().slice().reverse().slice(0, 5);
  const tbody = $('#recentOrdersBody');
  const emptyState = $('#emptyState');

  if (orders.length === 0) {
    tbody.innerHTML = '';
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  renderList(tbody, orders, (order) => {
    const itemSummary = order.items.length > 1
      ? `${escapeHtml(order.items[0].name)} 외 ${order.items.length - 1}건`
      : escapeHtml(order.items[0].name);

    return `
      <tr data-id="${escapeHtml(order.id)}">
        <td>${escapeHtml(order.id)}</td>
        <td>${formatDate(order.createdAt)}</td>
        <td>${itemSummary}</td>
        <td>${formatPrice(order.total)}</td>
        <td><span class="badge ${getStatusBadgeClass(order.status)}">${getStatusLabel(order.status)}</span></td>
      </tr>
    `;
  });
}

function handleRowClick(e) {
  const row = e.target.closest('tr[data-id]');
  if (!row) return;
  window.location.href = `orders/detail.html?id=${row.dataset.id}`;
}

function init() {
  renderStats();
  renderRecentOrders();
  $('#recentOrdersBody').addEventListener('click', handleRowClick);
}

document.addEventListener('DOMContentLoaded', init);
