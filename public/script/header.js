const headerLinks = document.querySelectorAll(".header-link");

headerLinks.forEach((e) => {
    const underline = e.querySelector(".underline");
    e.addEventListener("mouseenter", () => {
        underline.style.width = "100%";
    });
    e.addEventListener("mouseleave", () => {
        underline.style.width = "0";
    });
});

// Mobile menu logic
const burger = document.querySelector('.burger');
const headerEl = document.querySelector('.header');
const mobileMenu = document.getElementById('mobile-menu');

if (burger && headerEl && mobileMenu) {
  function closeMenu() {
    headerEl.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
    burger.setAttribute('aria-label', 'Open menu');
  }
  function openMenu() {
    headerEl.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    mobileMenu.hidden = false;
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');
    burger.setAttribute('aria-label', 'Close menu');
  }
  burger.addEventListener('click', () => {
    headerEl.classList.contains('menu-open') ? closeMenu() : openMenu();
  });
  mobileMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' || e.target.closest('button')) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && headerEl.classList.contains('menu-open')) closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 840 && headerEl.classList.contains('menu-open')) closeMenu();
  });
}