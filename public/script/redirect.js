const text = document.querySelector("#text");
const link = document.querySelector("#link");
const meta = document.querySelector("#meta");

const target = window.location.href.split("/")[4];

if (target === "whatsapp") {
    meta.setAttribute("content", "3;url=https://wa.me/923188897434");
    text.textContent = "Redirecting you to our Whatsapp chat...";
    link.href = "https://wa.me/923188897434";
}