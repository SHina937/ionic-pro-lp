(function () {
  const openButton = document.getElementById("menu-open");
  const closeButton = document.getElementById("menu-close");
  const menu = document.getElementById("mobile-menu");

  if (!openButton || !closeButton || !menu) return;

  function openMenu() {
    menu.hidden = false;
    // hidden解除を描画に反映させてからクラスを付け、開くアニメーションを発火させる
    requestAnimationFrame(() => {
      menu.classList.add("is-open");
    });
    openButton.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    openButton.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    openButton.focus();
    // 閉じるアニメーションが終わってからDOM上も非表示にする
    menu.addEventListener(
      "transitionend",
      () => {
        if (!menu.classList.contains("is-open")) menu.hidden = true;
      },
      { once: true }
    );
  }

  openButton.addEventListener("click", openMenu);
  closeButton.addEventListener("click", closeMenu);

  menu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  menu.querySelectorAll(".mobile-menu__link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
})();
