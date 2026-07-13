// ============================================
// 로그인
// ============================================

function init() {
  renderCartBadge();

  if (getCurrentUser()) {
    window.location.href = '../index.html';
    return;
  }

  $('#loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#email').value.trim();
    const password = $('#password').value;

    const result = login(email, password);
    if (!result.ok) {
      showToast(result.message, 'error');
      return;
    }
    showToast('로그인 되었습니다.');
    window.location.href = '../index.html';
  });
}

document.addEventListener('DOMContentLoaded', init);
