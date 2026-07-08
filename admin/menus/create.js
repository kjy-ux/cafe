// ============================================
// 관리자 - 메뉴 추가
// ============================================

function populateCategoryOptions() {
  $('#category').innerHTML = CATEGORIES.map(c =>
    `<option value="${c.id}">${c.name}</option>`
  ).join('');
}

function updateImagePreview() {
  const url = $('#image').value.trim();
  const preview = $('#imagePreview');

  if (!url) {
    preview.hidden = true;
    preview.innerHTML = '';
    return;
  }

  preview.hidden = false;
  preview.innerHTML = `<img src="${escapeHtml(url)}" alt="미리보기">`;
  preview.querySelector('img').addEventListener('error', () => {
    preview.innerHTML = '<span class="image-preview__error">이미지를 불러올 수 없습니다</span>';
  }, { once: true });
}

function handleSubmit(e) {
  e.preventDefault();

  const name = $('#name').value.trim();
  const category = $('#category').value;
  const price = Number($('#price').value);
  const image = $('#image').value.trim();
  const description = $('#description').value.trim();

  if (!name) {
    showToast('메뉴 이름을 입력해주세요.', 'error');
    return;
  }
  if (!price || price <= 0) {
    showToast('올바른 가격을 입력해주세요.', 'error');
    return;
  }

  addMenu({ name, category, price, description, image });
  showToast(`'${name}' 메뉴를 추가했습니다.`);
  setTimeout(() => { window.location.href = 'list.html'; }, 900);
}

function init() {
  populateCategoryOptions();
  $('#menuForm').addEventListener('submit', handleSubmit);
  $('#image').addEventListener('input', updateImagePreview);
}

document.addEventListener('DOMContentLoaded', init);
