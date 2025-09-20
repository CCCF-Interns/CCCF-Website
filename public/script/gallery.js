const albumGrid = document.querySelector("#album-grid");

let albumData = [];
let imagesData = [];
let alternate = false;

async function loadAlbums() {
    let response = await fetch("/api/album/existing");
    let result = await response.json();
    albumData = result.data;
}

// async function loadImages(albumId) {
//     let response = await fetch("/api/gallery/album", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id: albumId, limit: 5})
//     });

//     let result = await response.json();
    
//     let object = {
//         id: albumId,
//         images: result.data
//     };

//     imagesData.push(object);
// }

// function createAlbum(name, images) {
//     if (images.length == 0) return;

//     let container = document.createElement("div");
//     let title = document.createElement("h2");
//     let imagesContainer = document.createElement("div");
//     let imagesSlider = document.createElement("div");
//     let showContainer = document.createElement("div");
//     let showLink = document.createElement("a");
//     let showImg = document.createElement("img");
//     let showText = document.createElement("span");

//     container.classList.add("album-container");
//     if (alternate) {
//         container.classList.add("bg-cream");
//         alternate = false;
//     }
//     else {
//         container.classList.add("bg-yellow");
//         alternate = true;
//     }

//     title.classList.add("heading");

//     imagesContainer.classList.add("album-images-container");
//     imagesContainer.classList.add("flex-container");

//     imagesSlider.classList.add("album-images");
//     imagesSlider.classList.add("flex-container");

//     showContainer.classList.add("album-images-show");
//     showContainer.classList.add("flex-container");

//     showLink.classList.add("album-images-show-button");
//     showLink.classList.add("clickable");
//     showLink.classList.add("flex-container");

//     title.textContent = name;
//     showImg.src = "/assets/svg/chevron_right.svg";
//     showText.textContent = "Show More";
    
//     for(let x of images) {
//         let imageCont = document.createElement("div");
//         let image = document.createElement("img");

//         imageCont.classList.add("album-image");
//         image.classList.add("image");

//         image.src = x.image_url;

//         imageCont.appendChild(image);
//         imagesSlider.appendChild(imageCont);
//     }

//     showLink.appendChild(showImg);
//     showContainer.appendChild(showLink);
//     showContainer.appendChild(showText);
//     imagesContainer.appendChild(imagesSlider);
//     imagesContainer.appendChild(showContainer);
//     container.appendChild(title);
//     container.appendChild(imagesContainer);
//     albumContainer.appendChild(container);
// }

function createAlbum(id, title, imageCount, imageLink) {
    const a = document.createElement("a");
    const img = document.createElement("img");
    const overlay = document.createElement("div");
    const textCont = document.createElement("div");
    const imgTitle = document.createElement("div");
    const imgCount = document.createElement("div");

    a.classList.add("grid-item");
    overlay.classList.add("image-overlay");
    imgTitle.classList.add("image-title");
    imgCount.classList.add("image-count");

    a.href = `/gallery/images/${id}?page=1`;
    img.src = imageLink;
    img.alt = "Album Cover";
    imgTitle.textContent = title;
    imgCount.textContent = `${imageCount} photos`;

    textCont.appendChild(imgTitle);
    textCont.appendChild(imgCount);
    overlay.appendChild(textCont);
    a.appendChild(img);
    a.appendChild(overlay);
    albumGrid.appendChild(a);
}

async function createAlbums() {
    await loadAlbums();
    for (let x of albumData) {
        createAlbum(x.id, x.name, x.total, x.image_url);
    }
}

createAlbums();