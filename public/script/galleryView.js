const albumTitle = document.querySelector("#album-title");
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

const params = new URLSearchParams(window.location.search);
const pageNumber = parseInt(params.get("page")) || 1;
let albumID = window.location.href.split("/")[5] || "";

if (albumID != "") {
    albumID = albumID.split("?")[0];
}

console.log(albumID);

function createImage(link, thumbnail, index) {
    const container = document.createElement("div");
    const image = document.createElement("img");

    container.classList.add("grid-item");
    image.classList.add("image");
    image.classList.add("border-radius-8");
    image.src = thumbnail;
    image.alt = "CCCF Gallery Image";

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
    let response = null;

    pageButtonBottom.textContent = "";
    pageButtonTop.textContent = "";

    if (albumID == "") {
        albumTitle.textContent = "All Photos";

        response = await fetch (`/api/gallery?page=${pageNumber}`);
    }
    else {
        response = await fetch (`/api/album/${albumID}`);

        let title = await response.json();
        albumTitle.textContent = title.data[0].name;

        response = await fetch ("/api/gallery/album", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: albumID, page: pageNumber, is_lim: true })
        });
    }

    images = await response.json();
    let counter = 0;

    for (let x of images.data) {
        createImage(x.image_url, x.thumbnail_url, counter);
        ++counter;
    }

    await createPageButtons();

    loader.style.display = "none";
    document.body.style.overflow = "auto";
}

async function getTotalPages() {
    let response = null;

    if (albumID == ""){
        response = await fetch("/api/gallery/total");
    }
    else {
        response = await fetch (`/api/gallery/album/total/${albumID}`);
    } 

    const data = await response.json();
    console.log(data);
    return Math.ceil(data.data[0].total/30);
}

async function createPageButtons() {
    const n = await getTotalPages();

    console.log(pageNumber);

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
    anchor.href = `/gallery/images/${albumID}?page=${page}`;

    btn.classList.add("page-button");

    if (page == pageNumber) {
        btn.classList.add("active");
    } else {
        btn.classList.add("bg-yellow");
    }

    anchor.appendChild(btn);
    pageButtonTop.appendChild(anchor);
    pageButtonBottom.appendChild(anchor.cloneNode(true));
}

function createPageDots() {
    const dots = document.createElement("div");
    dots.textContent = "...";
    dots.classList.add("page-dots");

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
        anchor.href = `/gallery/images/${albumID}?page=${pageNumber - 1}`;

        anchor.appendChild(img);
        pageButtonTop.appendChild(anchor);
        pageButtonBottom.appendChild(anchor.cloneNode(true));
    }
    else {
        img.src = "/assets/svg/chevron_left_gray.svg";
        img.classList.add("page-arrow-disabled");
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
        anchor.href = `/gallery/images/${albumID}?page=${
            parseInt(pageNumber) + 1
        }`;

        anchor.appendChild(img);
        pageButtonTop.appendChild(anchor);
        pageButtonBottom.appendChild(anchor.cloneNode(true));
    }
    else {
        img.src = "/assets/svg/chevron_right_gray.svg";
        img.classList.add("page-arrow-disabled");
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