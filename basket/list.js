// ============================================
// 고객 - 장바구니
// ============================================

function renderBasket() {
  const cart = getCart();
  const list = $('#basketList');
  const summary = $('#basketSummary');
  const emptyState = $('#emptyState');

  if (cart.length === 0) {
    list.innerHTML = '';
    summary.hidden = true;
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  summary.hidden = false;

  renderList(list, cart, (item) => {
    const menu = getMenuById(item.menuId);
    const image = menu && menu.image;
    const optionsLabel = formatOptionsLabel(item.category, item.options);
    return `
      <div class="basket-item" data-line-id="${escapeHtml(item.lineId)}">
        <div class="basket-item__image">
          ${image
            ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(item.name)}">`
            : '<div class="basket-item__no-image">☕</div>'}
        </div>
        <div class="basket-item__body">
          <p class="basket-item__name">${escapeHtml(item.name)}</p>
          ${optionsLabel ? `<p class="basket-item__options">${escapeHtml(optionsLabel)}</p>` : ''}
          <p class="basket-item__price">${formatPrice(item.price)}</p>
        </div>
        <div class="qty-stepper">
          <button type="button" data-qty-minus="${escapeHtml(item.lineId)}" aria-label="수량 감소">-</button>
          <span>${item.quantity}</span>
          <button type="button" data-qty-plus="${escapeHtml(item.lineId)}" aria-label="수량 증가">+</button>
        </div>
        <p class="basket-item__subtotal">${formatPrice(item.price * item.quantity)}</p>
        <button class="basket-item__remove" data-remove="${escapeHtml(item.lineId)}" aria-label="삭제">✕</button>
      </div>
    `;
  });

  $('#totalPrice').textContent = formatPrice(getCartTotal());
}

function handleListClick(e) {
  const minusBtn = e.target.closest('[data-qty-minus]');
  const plusBtn = e.target.closest('[data-qty-plus]');
  const removeBtn = e.target.closest('[data-remove]');

  if (minusBtn) {
    const lineId = minusBtn.dataset.qtyMinus;
    const item = getCart().find(c => c.lineId === lineId);
    if (item) updateCartQuantity(lineId, item.quantity - 1);
    renderBasket();
    renderCartBadge();
  } else if (plusBtn) {
    const lineId = plusBtn.dataset.qtyPlus;
    const item = getCart().find(c => c.lineId === lineId);
    if (item) updateCartQuantity(lineId, item.quantity + 1);
    renderBasket();
    renderCartBadge();
  } else if (removeBtn) {
    const lineId = removeBtn.dataset.remove;
    const item = getCart().find(c => c.lineId === lineId);
    removeFromCart(lineId);
    renderBasket();
    renderCartBadge();
    if (item) showToast(`'${item.name}'${josa(item.name, '을', '를')} 삭제했습니다.`);
  }
}

function handleOrder() {
  const cart = getCart();
  if (cart.length === 0) return;

  const total = getCartTotal();
  createOrder(cart, total);
  clearCart();
  renderCartBadge();
  showToast('주문이 완료되었습니다.');
  setTimeout(() => { window.location.href = '../orders/list.html'; }, 900);
}

function init() {
  renderCartBadge();
  renderBasket();
  $('#basketList').addEventListener('click', handleListClick);
  $('#orderBtn').addEventListener('click', handleOrder);
}

document.addEventListener('DOMContentLoaded', init);
