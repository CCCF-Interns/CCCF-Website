const imagesContainer = document.querySelector("#images-container");
const loader = document.querySelector("#loader");
const imageOverlay = document.querySelector("#image-overlay");
const imagePreview = document.querySelector("#image-preview");
const previewLeft = document.querySelector("#preview-left");
const previewRight = document.querySelector("#preview-right");
const previewClose = document.querySelector("#preview-close");

let images;
let currentImageIndex;

function createImage(title, link, index) {
    const container = document.createElement("div");
    const image = document.createElement("img");

    container.classList.add("grid-item");
    image.classList.add("image");

    image.src = link;

    container.addEventListener("click", () => {
        imagePreview.src = link;
        imageOverlay.style.display = "block";
        document.body.style.overflow = "hidden";
        currentImageIndex = index;
    });

    container.appendChild(image);
    imagesContainer.appendChild(container);
}

async function createImages() {
    const response = await fetch ("/api/gallery");
    images = await response.json();
    let counter = 0;

    for (let x of images.data) {
        createImage(x.title, x.image_url, counter);
        ++counter;
    }

    loader.style.display = "none";
    document.body.style.overflow = "auto";
}

previewLeft.addEventListener("click", () => {
    if (!images)
        return;

    if (currentImageIndex == 0) {
        currentImageIndex = images.data.length - 1;
    }
    else {
        currentImageIndex--;
    }

    imagePreview.src = images.data[currentImageIndex].image_url;
    imageOverlay.style.display = "block";
    document.body.style.overflow = "hidden";
});

previewRight.addEventListener("click", () => {
    if (!images)
        return;

    if (currentImageIndex == images.data.length - 1) {
        currentImageIndex = 0;
    }
    else {
        currentImageIndex++;
    }

    imagePreview.src = images.data[currentImageIndex].image_url;
    imageOverlay.style.display = "block";
    document.body.style.overflow = "hidden";
});

previewClose.addEventListener("click", () => {
    imageOverlay.style.display = "none";
    document.body.style.overflow = "auto";
});

createImages();