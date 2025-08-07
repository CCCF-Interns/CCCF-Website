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