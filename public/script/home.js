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

    if (currentCover == 3)
        currentCover = 1;
    else
        currentCover++;

    buttons.forEach((e) => {
        e.classList.remove("radio-clicked");
    });
    covers.forEach((e) => {
        e.style.opacity = "0";
    });
    texts.forEach((e) => {
        e.style.display = "none";
    });

    document.querySelector(`#hero-page-${currentCover}`).classList.add(
        "radio-clicked");
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

faqItems.forEach((e) => {
    let expanded = false;
    let arrow = e.querySelector("img");
    e.addEventListener("click", () => {
        if (!expanded) {
            e.style.height = e.scrollHeight + "px";
            arrow.src = "/assets/svg/arrow_up.svg";
            expanded = true;
        }
        else {
            e.style.height = "48px";
            arrow.src = "/assets/svg/arrow_down.svg";
            expanded = false;
        }
    });
})

startCoverTimer();
