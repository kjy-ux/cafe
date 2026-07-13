// ============================================
// 관리자 - 메뉴 수정
// ============================================

requireAdmin();

function getMenuIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get('id'));
}

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

function populateForm(menu) {
  $('#name').value = menu.name;
  $('#category').value = menu.category;
  $('#price').value = menu.price;
  $('#image').value = menu.image;
  $('#description').value = menu.description;
}

function handleSubmit(e, id) {
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

  updateMenu(id, { name, category, price, description, image });
  showToast(`'${name}' 메뉴를 수정했습니다.`);
  setTimeout(() => { window.location.href = 'list.html'; }, 900);
}

function init() {
  const id = getMenuIdFromUrl();
  const menu = getMenuById(id);

  if (!menu) {
    $('#menuForm').hidden = true;
    $('#notFound').hidden = false;
    return;
  }

  populateCategoryOptions();
  populateForm(menu);
  updateImagePreview();
  $('#menuForm').addEventListener('submit', (e) => handleSubmit(e, id));
  $('#image').addEventListener('input', updateImagePreview);
}

document.addEventListener('DOMContentLoaded', init);
