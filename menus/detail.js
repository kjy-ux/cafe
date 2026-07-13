// ============================================
// 고객 - 메뉴 상세
// ============================================

let quantity = 1;

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

function renderOptionGroups(menu) {
  const keys = CATEGORY_OPTIONS[menu.category] || [];
  if (keys.length === 0) return '';

  return `
    <div class="option-groups">
      ${keys.map(key => {
        const group = MENU_OPTIONS[key];
        return `
          <div class="option-group">
            <span class="option-group__label">${group.label}</span>
            <div class="option-group__choices">
              ${group.choices.map((choice, i) => `
                <label class="option-choice">
                  <input type="radio" name="opt-${key}" value="${choice.id}" ${i === 0 ? 'checked' : ''}>
                  <span>${choice.name}${choice.priceDelta > 0 ? ` (+${formatPrice(choice.priceDelta)})` : ''}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function getSelectedOptions(menu) {
  const keys = CATEGORY_OPTIONS[menu.category] || [];
  const options = {};
  keys.forEach(key => {
    const checked = document.querySelector(`input[name="opt-${key}"]:checked`);
    options[key] = checked ? checked.value : MENU_OPTIONS[key].choices[0].id;
  });
  return options;
}

function updatePriceDisplay(menu) {
  const options = getSelectedOptions(menu);
  const unitPrice = menu.price + getOptionsPriceDelta(menu.category, options);
  $('#unitPrice').textContent = formatPrice(unitPrice);
  $('#totalPrice').textContent = formatPrice(unitPrice * quantity);
}

function renderMenuDetail(container, menu) {
  container.innerHTML = `
    <div class="detail-card__image">
      ${menu.image
        ? `<img src="${escapeHtml(menu.image)}" alt="${escapeHtml(menu.name)}">`
        : '<div class="detail-card__no-image">☕</div>'}
    </div>
    <div class="detail-card__body">
      <div class="detail-card__title-row">
        <span class="detail-card__category">${getCategoryName(menu.category)}</span>
        <button type="button" class="favorite-btn${isFavorite(menu.id) ? ' is-active' : ''}" id="favoriteBtn" aria-label="즐겨찾기">♥ 즐겨찾기</button>
      </div>
      <h1 class="detail-card__name">${escapeHtml(menu.name)}</h1>
      <p class="detail-card__price" id="unitPrice">${formatPrice(menu.price)}</p>
      <p class="detail-card__description">${escapeHtml(menu.description)}</p>
      ${renderOptionGroups(menu)}
      <div class="detail-card__actions">
        <div class="qty-stepper">
          <button type="button" id="qtyMinus" aria-label="수량 감소">-</button>
          <span id="qtyValue">1</span>
          <button type="button" id="qtyPlus" aria-label="수량 증가">+</button>
        </div>
        <button id="addToCartBtn" class="btn btn-primary">장바구니 담기 · <span id="totalPrice">${formatPrice(menu.price)}</span></button>
      </div>
      ${(CATEGORY_OPTIONS[menu.category] || []).length > 0 ? `
        <div class="recipe-save">
          <span class="recipe-save__label">이 조합, 나만의 레시피로 저장해두면 다음에 한 번에 다시 담을 수 있어요.</span>
          <div class="recipe-save__row">
            <input type="text" id="recipeName" class="recipe-save__input" placeholder="레시피 이름 (예: 여름 바닐라 아이스)" maxlength="20">
            <button type="button" id="saveRecipeBtn" class="btn btn-outline">레시피 저장</button>
          </div>
        </div>
      ` : ''}
    </div>
  `;

  quantity = 1;

  $('#favoriteBtn').addEventListener('click', () => {
    const isFav = toggleFavorite(menu.id);
    $('#favoriteBtn').classList.toggle('is-active', isFav);
  });

  $$('.option-group__choices input').forEach(input => {
    input.addEventListener('change', () => updatePriceDisplay(menu));
  });

  $('#qtyMinus').addEventListener('click', () => {
    if (quantity > 1) {
      quantity -= 1;
      $('#qtyValue').textContent = quantity;
      updatePriceDisplay(menu);
    }
  });

  $('#qtyPlus').addEventListener('click', () => {
    quantity += 1;
    $('#qtyValue').textContent = quantity;
    updatePriceDisplay(menu);
  });

  $('#addToCartBtn').addEventListener('click', () => {
    const options = getSelectedOptions(menu);
    addToCart(menu.id, quantity, options);
    renderCartBadge();
    const label = formatOptionsLabel(menu.category, options);
    showToast(`'${menu.name}'${label ? ` (${label})` : ''} ${quantity}개를 장바구니에 담았습니다.`);
  });

  const saveRecipeBtn = $('#saveRecipeBtn');
  if (saveRecipeBtn) {
    saveRecipeBtn.addEventListener('click', () => {
      const nameInput = $('#recipeName');
      const name = nameInput.value.trim();
      if (!name) {
        showToast('레시피 이름을 입력해주세요.', 'error');
        nameInput.focus();
        return;
      }
      const options = getSelectedOptions(menu);
      addRecipe(name, menu, options);
      showToast(`'${name}' 레시피로 저장했습니다. 마이페이지에서 확인하세요.`);
      nameInput.value = '';
    });
  }
}

function init() {
  const container = $('#detailCard');
  const menu = getMenuById(getMenuIdFromUrl());

  renderCartBadge();

  if (!menu) {
    renderNotFound(container);
    return;
  }
  renderMenuDetail(container, menu);
}

document.addEventListener('DOMContentLoaded', init);
