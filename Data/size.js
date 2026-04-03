$(document).ready(function () {
  function resizeGame() {
    let windowWidth = $(window).width();
    let r = windowWidth / 500;
    document.body.style.zoom = String(r);

    let gameContainer = document.getElementById("game-container");
    if (gameContainer) {
      gameContainer.style.transform = "";
    }
  }

  resizeGame();
  $(window).resize(resizeGame);
});
