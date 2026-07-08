// ============================================
// 관리자 - 주문 목록
// ============================================

let currentStatus = 'all';

function renderFilterTabs() {
  const tabsHtml = Object.values(ORDER_STATUS).map(s =>
    `<button class="filter-tab" data-status="${s.value}">${s.label}</button>`
  ).join('');
  $('#filterTabs').insertAdjacentHTML('beforeend', tabsHtml);
}

function statusOptions(selected) {
  return Object.values(ORDER_STATUS).map(s =>
    `<option value="${s.value}" ${s.value === selected ? 'selected' : ''}>${s.label}</option>`
  ).join('');
}

function renderOrderTable() {
  const orders = getOrders().slice().reverse()
    .filter(o => currentStatus === 'all' || o.status === currentStatus);
  const tbody = $('#orderTableBody');
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
        <td>
          <select class="status-select" data-status-select="${escapeHtml(order.id)}">
            ${statusOptions(order.status)}
          </select>
        </td>
        <td><a href="detail.html?id=${order.id}" class="btn btn-sm">상세</a></td>
      </tr>
    `;
  });
}

function handleFilterClick(e) {
  const tab = e.target.closest('.filter-tab');
  if (!tab) return;
  $$('.filter-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  currentStatus = tab.dataset.status;
  renderOrderTable();
}

function handleStatusChange(e) {
  const select = e.target.closest('[data-status-select]');
  if (!select) return;
  updateOrderStatus(select.dataset.statusSelect, select.value);
  showToast('주문 상태를 변경했습니다.');
  renderOrderTable();
}

function init() {
  renderFilterTabs();
  renderOrderTable();
  $('#filterTabs').addEventListener('click', handleFilterClick);
  $('#orderTableBody').addEventListener('change', handleStatusChange);
}

document.addEventListener('DOMContentLoaded', init);
