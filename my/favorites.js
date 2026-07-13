// ============================================
// 고객 - 나만의 메뉴 (찜한 메뉴 + 내 레시피)
// ============================================

function init() {
  renderCartBadge();
  renderFavorites();
  renderRecipes();
  $('#favoriteGrid').addEventListener('click', handleFavoriteGridClick);
  $('#recipeList').addEventListener('click', handleRecipeListClick);
}

document.addEventListener('DOMContentLoaded', init);
