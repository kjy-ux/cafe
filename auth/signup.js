// ============================================
// 회원가입
// ============================================

function init() {
  renderCartBadge();

  if (getCurrentUser()) {
    window.location.href = '../index.html';
    return;
  }

  $('#signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const password = $('#password').value;
    const passwordConfirm = $('#passwordConfirm').value;

    if (password !== passwordConfirm) {
      showToast('비밀번호가 일치하지 않습니다.', 'error');
      return;
    }

    const result = signup(name, email, password);
    if (!result.ok) {
      showToast(result.message, 'error');
      return;
    }
    showToast(`${name}님, 회원가입을 환영합니다!`);
    window.location.href = '../index.html';
  });
}

document.addEventListener('DOMContentLoaded', init);
