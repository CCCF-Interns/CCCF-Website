const whatsappContainer = document.querySelector("#whatsapp-container");
const bubble = document.querySelector("#bubble");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

whatsappContainer.addEventListener("mouseenter", async () => {
    whatsappContainer.style.transform = "translate(0, -5px)";
    bubble.style.display = "block";
    await sleep(1);
    bubble.style.opacity = "100%";
});

whatsappContainer.addEventListener("mouseleave", async () => {
    whatsappContainer.style.transform = "translate(0, 0)";
    bubble.style.opacity = "0%";
    await sleep(250);
    bubble.style.display = "none";
});