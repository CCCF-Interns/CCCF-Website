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

  const VISIBLE_FULL = 3;
  const PARTIAL_FRACTION = 0.35;
  const SLIDE_DURATION = 650;

  let totalCards = 0;
  let index = 0;
  let cardWidth = 360;
  let gapPx = 24;
  let stepWidth = cardWidth + gapPx;
  let animating = false;
  let baseOffset = 0;

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
        <a href="/blog/${blog._id}" class='transparent-button button-container'>
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
    container.style.transform = "translateX(0px)";

    const styles = getComputedStyle(container);
    gapPx = parseFloat(styles.gap) || 0;

    const firstRect = container.firstElementChild.getBoundingClientRect();
    cardWidth = firstRect.width;
    stepWidth = cardWidth + gapPx;

    const vpLeft = viewport.getBoundingClientRect().left;
    const firstLeft = firstRect.left;
    baseOffset = -(firstLeft - vpLeft);
    const vpWidth = cardWidth * (VISIBLE_FULL + PARTIAL_FRACTION) + gapPx * (VISIBLE_FULL - 1);
    viewport.style.width = Math.round(vpWidth) + "px";
  }

  function applyFades() {
    [...container.children].forEach(c => c.classList.remove("partial-fade"));
    const partialIdx = index + VISIBLE_FULL;
    if (partialIdx < totalCards) {
      container.children[partialIdx].classList.add("partial-fade");
    }
  }

  function updateButtons() {
    prevBtn.style.display = index > 0 ? "inline-flex" : "none";
    const canGoNext = index < (totalCards - VISIBLE_FULL);
    nextBtn.style.display = canGoNext ? "inline-flex" : "none";
  }

  function applyTransform(progressIndex = index) {
    const x = baseOffset - progressIndex * stepWidth;
    container.style.transform = `translateX(${Math.round(x)}px)`;
  }

  function snap() {
    applyTransform(index);
  }

  function animateTo(newIndex) {
    if (animating || newIndex === index) return;
    animating = true;
    const startIndex = index;
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
    if (index >= totalCards - VISIBLE_FULL) return;
    animateTo(index + 1);
  });

  prevBtn.addEventListener("click", () => {
    if (index <= 0) return;
    animateTo(index - 1);
  });

  window.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") nextBtn.click();
    else if (e.key === "ArrowLeft") prevBtn.click();
  });

  function reflow() {
    measure();
    snap();
    applyFades();
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