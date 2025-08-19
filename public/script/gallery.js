const imagesContainer = document.querySelector("#images-container");
const loader = document.querySelector("#loader");
const imageOverlay = document.querySelector("#image-overlay");
const imagePreview = document.querySelector("#image-preview");
const previewLeft = document.querySelector("#preview-left");
const previewRight = document.querySelector("#preview-right");
const previewClose = document.querySelector("#preview-close");
const pageButtonTop = document.querySelector("#page-buttons-top");
const pageButtonBottom = document.querySelector("#page-buttons-bottom");

let images;
let currentImageIndex;

const pageNumber = parseInt(window.location.href.split("page=")[1]);

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
    const response = await fetch ("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pageNumber })
    });
    images = await response.json();
    let counter = 0;

    for (let x of images.data) {
        createImage(x.title, x.image_url, counter);
        ++counter;
    }

    await createPageButtons();

    loader.style.display = "none";
    document.body.style.overflow = "auto";
}

async function getTotalPages() {
    const response = await fetch("/api/gallery/total");
    const data = await response.json();
    console.log(data);
    return Math.ceil(data.data[0].total/30);
}

async function createPageButtons() {
    const n = await getTotalPages();

    if (pageNumber > n || pageNumber < 1) {
        return;
    }

    createPageArrowLeft();
    createPageButton(1);

    if (pageNumber != 1 && pageNumber != 2) {
        createPageDots();
        createPageButton(pageNumber - 1);
    }
    if (pageNumber != 1 && pageNumber != n) {
        createPageButton(pageNumber);
    }
    if (pageNumber != n && pageNumber != n - 1) {
        createPageButton(pageNumber + 1);
        createPageDots();
    }
    if (n != 1) { 
        createPageButton(n);
    }
    
    createPageArrowRight(n);
}

function createPageButton(page) {
    const anchor = document.createElement("a");
    const btn = document.createElement("button");

    btn.textContent = page;
    anchor.href = `/gallery?page=${page}`;

    btn.classList.add("page-button");
    btn.classList.add("bg-yellow");

    anchor.appendChild(btn);

    pageButtonTop.appendChild(anchor);
    pageButtonBottom.appendChild(anchor.cloneNode(true));
}

function createPageDots() {
    const dots = document.createElement("div");
    dots.textContent = ". . .";

    pageButtonTop.appendChild(dots);
    pageButtonBottom.appendChild(dots.cloneNode(true));
}

function createPageArrowLeft() {
    const img = document.createElement("img");

    img.classList.add("page-arrow");

    if (pageNumber != 1) {
        const anchor = document.createElement("a");
        img.classList.add("pad-top-6");

        img.src = "/assets/svg/chevron_left.svg";
        anchor.href = `/gallery?page=${pageNumber - 1}`;

        anchor.appendChild(img);
        pageButtonTop.appendChild(anchor);
        pageButtonBottom.appendChild(anchor.cloneNode(true));
    }
    else {
        img.src = "/assets/svg/chevron_left_gray.svg";

        pageButtonTop.appendChild(img);
        pageButtonBottom.appendChild(img.cloneNode(true));
    }
}

function createPageArrowRight(n) {
    const img = document.createElement("img");

    img.classList.add("page-arrow");

    if (pageNumber != n) {
        const anchor = document.createElement("a");
        img.classList.add("pad-top-6");

        img.src = "/assets/svg/chevron_right.svg";
        anchor.href = `/gallery?page=${pageNumber + 1}`;

        anchor.appendChild(img);
        pageButtonTop.appendChild(anchor);
        pageButtonBottom.appendChild(anchor.cloneNode(true));
    }
    else {
        img.src = "/assets/svg/chevron_right_gray.svg";
        pageButtonTop.appendChild(img);
        pageButtonBottom.appendChild(img.cloneNode(true));
    }
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