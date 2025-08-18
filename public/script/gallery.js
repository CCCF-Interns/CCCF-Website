const imagesContainer = document.querySelector("#images-container");
const loader = document.querySelector("#loader");
let images;

function createImage(title, link) {
    const container = document.createElement("div");
    const image = document.createElement("img");

    container.classList.add("grid-item");
    image.classList.add("image");

    image.src = link;

    container.appendChild(image);
    imagesContainer.appendChild(container);
}

async function createImages() {
    const response = await fetch ("/api/gallery");
    images = await response.json();

    for (let x of images.data) {
        createImage(x.title, x.image_url);
    }

    loader.style.display = "none";
    document.body.style.overflow = "auto";
}

createImages();