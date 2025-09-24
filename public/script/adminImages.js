const imagesContainer = document.querySelector("#images-container");
const loader = document.querySelector("#loader");
const imageOverlay = document.querySelector("#image-overlay");
const imagePreview = document.querySelector("#image-preview");
const previewLeft = document.querySelector("#preview-left");
const previewRight = document.querySelector("#preview-right");
const previewClose = document.querySelector("#preview-close");
const pageButtonTop = document.querySelector("#page-buttons-top");
const pageButtonBottom = document.querySelector("#page-buttons-bottom");
const selectImages = document.querySelector("#select-button");
const removeImagesSubmit = document.querySelector("#remove-images-submit");
const removeImagesClose= document.querySelector("#remove-images-exit");
const removeImagesCont = document.querySelector("#remove-images-container");

let images;
let pageNumber = 1;
let isSelect = false;
let removingImages = [];
let currentImageIndex = null;
const checkCircle = "/assets/svg/check_circle_green.svg";

function createImage(id, link, index) {
    const container = document.createElement("div");
    const image = document.createElement("img");
    const memberClicked = document.createElement("img");

    container.classList.add("grid-item");
    image.classList.add("image");
    image.classList.add("border-radius-8");
    memberClicked.classList.add("clicked");
    
    image.src = link;
    memberClicked.src = checkCircle;

    let values = {
        id: id,
        key: link.split("/")[3].trim()
    };

    if (removingImages.some(data => data.id === values.id)) {
        memberClicked.style.display = "block";
    }

    container.addEventListener("click", () => {
        if (!isSelect) {
            imagePreview.src = link;
            imageOverlay.style.display = "block";
            document.body.style.overflow = "hidden";
            currentImageIndex = index;
        }
        else {
            if (removingImages.some(data => data.id === values.id)) {
                console.log("you got me");
                removingImages = removingImages.filter(x => x.id !== values.id);
                document.querySelector("#select-text").textContent =
                    `Selected members: ${removingImages.length}`;
                memberClicked.style.display = "none";
            }
            else {
                removingImages.push(values);
                document.querySelector("#select-text").textContent = 
                    `Selected members: ${removingImages.length}`;
                memberClicked.style.display = "block";
            }
        }
    });

    container.appendChild(image);
    container.appendChild(memberClicked);
    imagesContainer.appendChild(container);
}

async function createImages() {
    let response = null;
    response = await fetch (`/api/gallery?page=${pageNumber}`);
    images = await response.json();
    let counter = 0;

    imagesContainer.textContent = "";
    pageButtonBottom.textContent = "";
    pageButtonTop.textContent = "";

    for (let x of images.data) {
        createImage(x.id, x.image_url, counter);
        ++counter;
    }

    await createPageButtons();

    loader.style.display = "none";
    document.body.style.overflow = "auto";
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
    const btn = document.createElement("button");
    btn.textContent = page;

    btn.classList.add("page-button");
    if (page == pageNumber) {
        btn.classList.add("active");
    } else {
        btn.classList.add("bg-yellow");
    }

    btn.addEventListener("click", async () => {
        pageNumber = parseInt(page);
        await createImages();
    });

    pageButtonTop.appendChild(btn);

    const clone = btn.cloneNode(true);

    clone.addEventListener("click", async () => {
        pageNumber = parseInt(page);
        await createImages();
    });

    pageButtonBottom.appendChild(clone);
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
        img.classList.add("pad-top-6");

        img.src = "/assets/svg/chevron_left.svg";

        img.addEventListener("click", async () => {
            pageNumber--;
            await createImages();
        });

        const clone = img.cloneNode(true);

        clone.addEventListener("click", async () => {
            pageNumber--;
            await createImages();
        });

        pageButtonTop.appendChild(img);
        pageButtonBottom.appendChild(clone);
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
        img.classList.add("pad-top-6");

        img.src = "/assets/svg/chevron_right.svg";

        img.addEventListener("click", async ()=> {
            pageNumber++;
            await createImages();
        });

        const clone = img.cloneNode(true);

        clone.addEventListener("click", async ()=> {
            pageNumber++;
            await createImages();
        });

        pageButtonTop.appendChild(img);
        pageButtonBottom.appendChild(clone);
    }
    else {
        img.src = "/assets/svg/chevron_right_gray.svg";
        img.classList.add("page-arrow-disabled");
        pageButtonTop.appendChild(img);
        pageButtonBottom.appendChild(img.cloneNode(true));
    }
}

async function getTotalPages() {
    let response = null;
    response = await fetch("/api/gallery/total");

    const data = await response.json();
    console.log(data);
    return Math.ceil(data.data[0].total/30);
}

function clearEntries() {
    const items = document.querySelectorAll(".grid-item");

    removingImages = [];
    document.querySelector("#select-text").textContent = "Selected images: 0";
    removeImagesCont.style.display = "none";

    items.forEach((item)=> {
        item.querySelector(".clicked").style.display = "none";
    });
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

selectImages.addEventListener("click", () => {
    clearEntries();

    if (isSelect) {
        isSelect = false;
    }
    else {
        isSelect = true;
        removeImagesCont.style.display = "flex";
    }
});

removeImagesClose.addEventListener("click", () => {
    clearEntries();
    isSelect = false;
});

removeImagesSubmit.addEventListener("click", async () => {
    if (removingImages.length == 0)
        return;

    let keys = [];
    let ids = [];
    let response;
    let result;

    for (let x of removingImages) {
        keys.push(x.key);
        ids.push(x.id);
    }

    response = await fetch("/api/delete/bulk", {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ keys: keys })
    });

    result = await response.json();

    response = await fetch("/api/gallery/delete", {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ id:  ids})
    });

    result = await response.json();

    window.location.reload();
});

createImages();