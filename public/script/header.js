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

// Header hides when go down, shows when go up, smooth transition
let lastScrollTop = 0;
const header = document.querySelector(".header");
const burger = document.querySelector("#menu-toggle");
window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        // Scrolling down
        if (scrollTop > 72) {
            header.style.top = "-72px"; // Adjust based on header height
        }
    } else {
        // Scrolling up
        header.style.top = "0";
    }
    burger.checked = false; // Close mobile menu when scrolling down
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
});

