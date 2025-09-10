let locationIcon = document.querySelector("#location");
let locationArea = document.querySelector("#location-area");
let locationHeading = document.querySelector("#location-heading");

locationArea.addEventListener("mouseenter", () => {
    locationIcon.style.width = "76px";
    locationHeading.style.color = "#0000EE";
});

locationArea.addEventListener("mouseleave", () => {
    locationIcon.style.width = "64px";
    locationHeading.style.color = "black";
});

locationHeading.addEventListener("mouseenter", () => {
    locationHeading.style.color = "#5555FF";   // lighter blue
    locationHeading.style.textDecoration = "underline";
    locationHeading.style.cursor = "pointer";
});

locationHeading.addEventListener("mouseleave", () => {
    locationHeading.style.color = "#0000EE";   // normal blue
    locationHeading.style.textDecoration = "none";
});

locationHeading.addEventListener("click", () => {
    window.open("https://maps.app.goo.gl/gAY9EXMF4ZhD6J9NA");
});