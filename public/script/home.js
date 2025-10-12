const heroRadioButtons = document.querySelectorAll(".radio-button");
const heroCover = document.querySelector("#hero-cover");
const heroText = document.querySelector("#hero-text-section");
const faqItems = document.querySelectorAll(".faq-item");

let currentCover = 1;
let coverTimer;

function changeCover() {
  const buttons = document.querySelectorAll(".radio-button");
  const covers = heroCover.querySelectorAll("img");
  const texts = heroText.querySelectorAll(".hero-text");

  currentCover = currentCover === 3 ? 1 : currentCover + 1;

  buttons.forEach(e => e.classList.remove("radio-clicked"));
  covers.forEach(e => { e.style.opacity = "0"; });
  texts.forEach(e => { e.style.display = "none"; });

  document.querySelector(`#hero-page-${currentCover}`).classList.add("radio-clicked");
  document.querySelector(`#hero-cover-${currentCover}`).style.opacity = "1";
  document.querySelector(`#hero-text-${currentCover}`).style.display = "flex";
}

function startCoverTimer() {
  coverTimer = setInterval(changeCover, 5000);
}

heroRadioButtons.forEach((e, index) => {
  e.addEventListener("click", () => {
    currentCover = index;
    changeCover();
    clearInterval(coverTimer);
    startCoverTimer();
  });
});

faqItems.forEach(e => {
  let expanded = false;
  let arrow = e.querySelector("img");
  e.addEventListener("click", () => {
    if (!expanded) {
      e.style.height = e.scrollHeight + "px";
      arrow.src = "/assets/svg/arrow_up.svg";
    } else {
      e.style.height = "48px";
      arrow.src = "/assets/svg/arrow_down.svg";
    }
    expanded = !expanded;
  });
});

startCoverTimer();

// blog scroll
document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.createElement("div");
  viewport.className = "blogs-viewport";
  const container = document.querySelector("#latest-blogs");
  container.classList.add("cards-track");
  const parentWrapper = container.parentNode;
  parentWrapper.insertBefore(viewport, container);
  viewport.appendChild(container);

  const nextBtn = document.getElementById("blogs-next-btn");
  const prevBtn = document.getElementById("blogs-prev-btn");
  // Nav row wrapper (for mobile bottom placement)
  const navRow = document.createElement("div");
  navRow.className = "blogs-nav-row";
  // Insert navRow after viewport so we can move buttons into it conditionally
  viewport.after(navRow);

  // Responsive: 1 card on mobile, 3 on larger screens
  const DESKTOP_PARTIAL_FRACTION = 0.35; // desktop only
  let PARTIAL_FRACTION = DESKTOP_PARTIAL_FRACTION;
  const SLIDE_DURATION = 650;
  let visibleFull = 3;

  let totalCards = 0;
  let index = 0;
  let cardWidth = 360;
  let gapPx = 24;
  let stepWidth = cardWidth + gapPx;
  let animating = false;
  let baseOffset = 0;

  // Drag/swipe state
  let isDragging = false;
  let dragStartX = 0;
  let dragStartIndex = 0;
  let dragProgress = 0;

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function calculateVisibleFull() {
    visibleFull = window.matchMedia("(max-width: 768px)").matches ? 1 : 3;
    // Move buttons based on breakpoint
    const isMobile = visibleFull === 1;
    if (isMobile) {
      if (!navRow.contains(prevBtn)) navRow.appendChild(prevBtn);
      if (!navRow.contains(nextBtn)) navRow.appendChild(nextBtn);
    } else {
      // Ensure buttons are positioned absolutely outside viewport edges (original DOM order)
      if (navRow.contains(prevBtn)) viewport.before(prevBtn);
      if (navRow.contains(nextBtn)) viewport.after(nextBtn);
    }
  }

  function ensurePrefade(partialIdx) {
    // No prefade on mobile (single card view)
    if (visibleFull === 1) return;
    if (partialIdx >= 0 && partialIdx < totalCards) {
      container.children[partialIdx]?.classList.add("partial-fade");
    }
  }

  function buildCard(blog) {
    const card = document.createElement("div");
    card.className = "card flex-container";
    card.innerHTML = `
      <div class='card-image secondary-image'>
        <img class='image' src='${blog.poster || "#"}' alt='${blog.title}'>
      </div>
      <div class='card-section-2 bg-white flex-container'>
        <div class='card-header flex-container'>
          <div class='card-category'>${blog.categories?.[0]?.title || "Awareness"}</div>
          <div class='sub-text'>
            ${blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"}) : ""}
          </div>
        </div>
        <h3 class='card-heading'>${blog.title}</h3>
        <div>${blog.excerpt || "Learn how to recognize early signs of childhood cancer in your child"}</div>
        <a href="/blogs/${blog._id}" class='transparent-button button-container'>
          Read More
          <img src='/assets/svg/chevron_right.svg' alt='Read More'>
        </a>
      </div>
    `;
    return card;
  }

  function buildViewMoreCard() {
    const card = document.createElement("div");
    card.className = "card flex-container";
    card.innerHTML = `
      <div class='card-image secondary-image'>
        <img class='image' src='/assets/images/cover.webp' alt='View More'>
      </div>
      <div class='card-section-2 bg-white flex-container'>
        <div class='card-header flex-container'>
          <div class='card-category'>More</div>
          <div class='sub-text'></div>
        </div>
        <h3 class='card-heading'>View More Blogs</h3>
        <div>See all our latest insights and updates</div>
        <a href="/blogs" class='transparent-button button-container'>
          View More
          <img src='/assets/svg/chevron_right.svg' alt='View More'>
        </a>
      </div>
    `;
    return card;
  }

  function measure() {
    if (!container.firstElementChild) return;
  calculateVisibleFull();
  // On mobile disable partial peek
  PARTIAL_FRACTION = visibleFull === 1 ? 0 : DESKTOP_PARTIAL_FRACTION;
    container.style.transform = "translateX(0px)";

    const styles = getComputedStyle(container);
    gapPx = parseFloat(styles.gap) || 0;

    const firstRect = container.firstElementChild.getBoundingClientRect();
    cardWidth = firstRect.width;
    stepWidth = cardWidth + gapPx;

    const vpLeft = viewport.getBoundingClientRect().left;
    const firstLeft = firstRect.left;
    baseOffset = -(firstLeft - vpLeft);
  const vpWidth = cardWidth * (visibleFull + PARTIAL_FRACTION) + gapPx * (visibleFull - 1);
  const parentWidth = parentWrapper?.getBoundingClientRect().width || viewport.parentElement?.getBoundingClientRect().width || vpWidth;
  const capped = Math.min(Math.round(vpWidth), Math.round(parentWidth));
  viewport.style.width = capped + "px";

    // Clamp index if responsive change reduces max index
    const maxIndex = Math.max(0, totalCards - visibleFull);
    if (index > maxIndex) index = maxIndex;
  }

  function clearFades() {
    [...container.children].forEach(c => c.classList.remove("partial-fade"));
  }

  function applyFades() {
    clearFades();
    if (visibleFull === 1) return; // no fades on mobile
    const partialIdx = index + visibleFull;
    if (partialIdx < totalCards) {
      container.children[partialIdx].classList.add("partial-fade");
    }
  }

  function updateButtons() {
    prevBtn.style.display = index > 0 ? "inline-flex" : "none";
    const canGoNext = index < (totalCards - visibleFull);
    nextBtn.style.display = canGoNext ? "inline-flex" : "none";
  }

  function applyTransform(progressIndex = index) {
    const x = baseOffset - progressIndex * stepWidth;
    container.style.transform = `translateX(${Math.round(x)}px)`;
  }

  function snap() {
    applyTransform(index);
  }

  // Animate from a (possibly fractional) start to integer newIndex
  function animateTo(newIndex, startProgress = index) {
    if (animating) return;
    // If same index, still snap & cleanup fades (covers tap/no-move case)
    if (newIndex === index) {
      index = Math.round(index);
      snap();
      applyFades();
      return;
    }
    animating = true;

    // Prefade the incoming partial so it doesn't flash unfaded
    ensurePrefade(newIndex + visibleFull);

    const startIndex = startProgress;
    const delta = newIndex - startIndex;
    const startTime = performance.now();
    const ease = t => t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;

    function frame(ts) {
      const p = Math.min(1, (ts - startTime) / SLIDE_DURATION);
      const e = ease(p);
      const current = startIndex + delta * e;
      applyTransform(current);
      if (p < 1) {
        requestAnimationFrame(frame);
      } else {
        index = newIndex;
        snap();
        applyFades();
        updateButtons();
        animating = false;
      }
    }
    requestAnimationFrame(frame);
  }

  nextBtn.addEventListener("click", () => {
    if (index >= totalCards - visibleFull || animating) return;
    animateTo(index + 1);
  });

  prevBtn.addEventListener("click", () => {
    if (index <= 0 || animating) return;
    animateTo(index - 1);
  });

  window.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") nextBtn.click();
    else if (e.key === "ArrowLeft") prevBtn.click();
  });

  // Swipe/drag support with Pointer Events
  viewport.style.touchAction = "pan-y"; // allow vertical scrolling
  viewport.addEventListener("pointerdown", e => {
    // If the user is clicking a blog link, don't start dragging
    if (e.target.closest("#latest-blogs .card-section-2 a")) {
      return;
    }
    if (animating || totalCards <= visibleFull) return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartIndex = index;
    dragProgress = index;
    try { viewport.setPointerCapture(e.pointerId); } catch {}
    // No pre-fade on pointerdown; handled dynamically only after commit
  });

  viewport.addEventListener("pointermove", e => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    const maxIndex = Math.max(0, totalCards - visibleFull);
    dragProgress = clamp(dragStartIndex - dx / stepWidth, 0, maxIndex);
    applyTransform(dragProgress);
  });

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    try { viewport.releasePointerCapture(e.pointerId); } catch {}
    const dx = e.clientX - dragStartX;
    const threshold = stepWidth * 0.25; // 25% swipe to advance
    const maxIndex = Math.max(0, totalCards - visibleFull);

    if (Math.abs(dx) > threshold) {
      const dir = dx < 0 ? 1 : -1; // left swipe -> next; right swipe -> prev
      const target = clamp(dragStartIndex + dir, 0, maxIndex);
      animateTo(target, dragProgress);
    } else {
      // Snap back to starting index cleanly
      index = dragStartIndex;
      snap();
      applyFades();
    }
  }

  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
  viewport.addEventListener("pointerleave", endDrag);

  function reflow() {
    measure();
    snap();
    applyFades(); // will no-op (except clearing) on mobile
    updateButtons();
  }

  fetch("/api/blogs/0/5")
    .then(r => r.json())
    .then(blogs => {
      blogs.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      const use = blogs.slice(0, 5);
      container.innerHTML = "";
      use.forEach(b => container.appendChild(buildCard(b)));
      container.appendChild(buildViewMoreCard());
      totalCards = container.children.length;
      reflow();
      setTimeout(reflow, 50);
      setTimeout(reflow, 300);
    });

  let resizeTO;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(reflow, 120);
  });
});

// Defensive: ensure blog links are always clickable
document.addEventListener("click", function(e) {
  // Only target blog card links
  if (e.target.closest("#latest-blogs .card-section-2 a")) {
    // Let the link work normally
    return;
  }
  // ...existing code...
});