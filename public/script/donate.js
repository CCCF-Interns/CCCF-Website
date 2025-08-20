// filepath: f:\Documents\CCCF Actual\CCCF-Website\public\script\donate.js
// Fixed-duration smooth scroll (ignores browser instant anchor jump)
(function() {
  const heroBtn = document.getElementById("hero-donate-btn");
  if (heroBtn) {
    heroBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById("give");
      if (!target) return;
      smoothScrollTo(target, 650); // 650ms duration
    });
  }

  function smoothScrollTo(el, duration) {
    const start = window.scrollY || window.pageYOffset;
    const rect = el.getBoundingClientRect();
    const targetY = rect.top + start; // final absolute position
    const diff = targetY - start;
    let startTime = null;
    function easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
    function step(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min(1, (ts - startTime) / duration);
      const eased = easeInOutQuad(progress);
      window.scrollTo(0, start + diff * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Donation custom amount toggle
  const customInput = document.getElementById("custom-amount");
  const amountRadios = document.querySelectorAll("input[name='amount']");
  if (customInput && amountRadios.length) {
    amountRadios.forEach(r => r.addEventListener("change", () => {
      if (r.value === "custom") {
        customInput.disabled = false;
        customInput.focus();
      } else if (r.checked) {
        customInput.disabled = true;
        customInput.value = "";
      }
    }));
  }
})();