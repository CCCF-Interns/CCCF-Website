const albumGrid = document.querySelector("#album-grid");
const albumDropdown = document.querySelector("#album-dropdown");
const searchInput = document.querySelector("#album-input");
const searchLoader = document.querySelector("#album-loader");

let albumData = [];
let allPhotosData = null;
let searchResCount = 0;

async function loadAlbums() {
    let response = await fetch("/api/album/existing");
    let result = await response.json();
    albumData = result.data;

    response = await fetch("/api/gallery/latest");
    result = await response.json();
    allPhotosData = result.data[0];

    response = await fetch("/api/gallery/total");
    result = await response.json();
    allPhotosData["total"] = result.data[0].total;
}

async function searchAlbum(term) {
    searchLoader.classList.remove("hidden");
    albumDropdown.classList.add("hidden");

    let response = await fetch("/api/album/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: term })
    });

    let result = await response.json();
    console.log(result);

    if (searchInput.value.trim() == "") {
        searchLoader.classList.add("hidden");
        return;
    }

    if (result.data.length == 0) {
        searchLoader.classList.add("hidden");
        return;
    }

    createDropdownOptions(result.data);

    albumDropdown.classList.remove("hidden");
    searchLoader.classList.add("hidden");
}

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

    if (id == "")
        a.href = "/gallery/images?page=1";
    else
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
    createAlbum("", "All Photos", allPhotosData.total, allPhotosData.image_url);
    for (let x of albumData) {
        createAlbum(x.id, x.name, x.total, x.image_url);
    }
}

function createDropdownOptions(data) {
    albumDropdown.textContent = "";
    for (let x of data) {
        searchResCount++;
        createDropdownOption(x.id, x.name, x.total, x.image_url);
    }
}

function createDropdownOption(id, name, albumCount, imageLink) {
    const button = document.createElement("button");
    const img = document.createElement("img");
    const info = document.createElement("div");
    const title = document.createElement("span");
    const count = document.createElement("span");

    button.classList.add("album-option");
    info.classList.add("album-info");
    title.classList.add("album-name");
    count.classList.add("album-count");

    img.src = imageLink;
    img.alt = "album cover";
    title.textContent = name;
    count.textContent = albumCount + " photos";

    button.addEventListener("click", () => {
        window.location.href = `/gallery/images/${id}?page=1`;
    });

    info.appendChild(title);
    info.appendChild(count);
    button.appendChild(img);
    button.appendChild(info);
    albumDropdown.appendChild(button);
}

function clearDropdown() {
    searchResCount = 0;
    albumDropdown.textContent = "";
    albumDropdown.classList.add("hidden");
}

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const debouncedSearch = debounce(searchAlbum, 500);

searchInput.addEventListener("input", () => {
    const term = searchInput.value.trim();
    if (term && term != "") {
        debouncedSearch(term);
    } else {
        clearDropdown();
    }
});

searchInput.addEventListener("blur", () => {
    setTimeout(() => {
        albumDropdown.classList.add("hidden");
    }, 200);
});

searchInput.addEventListener("focus", () => {
    if (searchResCount > 0) {
        setTimeout(() => {
            albumDropdown.classList.remove("hidden");
        }, 200);
    }
});

createAlbums();