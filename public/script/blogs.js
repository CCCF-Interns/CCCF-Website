let lastActive;
let globCategory = "all"
let globSortBy = "date"
let globSearchString = "_all_"

document.addEventListener("DOMContentLoaded", function () {
    renderCategories();
    renderBlogs(0, 5, globCategory, globSortBy, globSearchString);
    document.querySelector(".selections").addEventListener("submit", (e) => {
        e.preventDefault();
        handleFilter();
    });
    lastActive = null;
});

async function renderBlogs(start, end, category, sortBy, searchString) {
    searchString = searchString.replaceAll(" ", "_")
    fetch(`/api/blogs/${category}/${sortBy}/${searchString}/${start}/${end}`)
    .then(res => res.json())
    .then(res => {
        const container = document.querySelector(".container");
        const data = res.blogs 
        const total = res.total
        if (document.querySelector(".paginator").innerHTML === "")
            renderPaginator(total)

        for (const item of data) {
            const card = document.createElement("div");
            card.className = "card";
            card.addEventListener("click", () => {
                window.location.href = `/blogs/${item._id}`;
            });

            const posterContainer = document.createElement("div");
            posterContainer.className = "card-poster";
            const img = document.createElement("img");
            img.src = item.poster;
            posterContainer.appendChild(img);
            card.appendChild(posterContainer);


            const cardInfo = document.createElement("div");
            cardInfo.className = "card-info";
            const title = document.createElement("h2");
            title.innerText = item.title;
            cardInfo.appendChild(title);
            const author = document.createElement("h3");
            if (item.author)
            author.innerText = item.author.name;
            cardInfo.appendChild(author);
            const publishedAt = document.createElement("p");
            publishedAt.style.cssText = "font-style: italic;";
            if (item.publishedAt)
            publishedAt.innerText = item.publishedAt.split("T")[0];
            cardInfo.append(publishedAt);

            const categories = document.createElement("categories");
            categories.className = "categories";

            if (item.categories)
            for (const cat of item.categories) {
                const name = cat.title;
                const label = document.createElement("div");
                label.innerText = name;
                categories.appendChild(label);
            }

            cardInfo.appendChild(categories);

            card.appendChild(cardInfo);

            container.appendChild(card);
        }
    });
}

async function renderPaginator(total) {
    const paginator = document.createElement("div");
    paginator.className = "pages";

    const numOfPages = Math.ceil(total / 6);
    for (let i = 1; i <= numOfPages; i++) {
        const pageIcon = document.createElement("div");
        if (i == 1) {
            pageIcon.id = "activePage";
            lastActive = pageIcon;
        }
        pageIcon.innerText = i;
        pageIcon.className = "page";
        paginator.appendChild(pageIcon);
    }
    const container = document.querySelector(".paginator");
    container.appendChild(paginator);
    document.querySelectorAll(".page").forEach((page) => page.addEventListener("click", changePage))
}

async function changePage(e) {
    lastActive.id = "";
    e.target.id = "activePage";
    lastActive = e.target;
    const pageNumber = e.target.innerText;
    document.querySelector(".container").innerHTML = "";
    
    const start = 6*(pageNumber-1);
    const end = start + 5;
    await renderBlogs(start, end, globCategory, globSortBy, globSearchString);
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
}

async function handleFilter() {
    globCategory = document.querySelector("#categories").value
    globSortBy = document.querySelector("#sort").value
    let search = document.querySelector(".selections input").value
    globSearchString = search !== "" ? search : "_all_"
    document.querySelector(".container").innerHTML = ""
    document.querySelector(".paginator").innerHTML = ""
    renderBlogs(0, 5, globCategory, globSortBy, globSearchString);
}

async function renderCategories() {
    fetch("/api/blogs/categories")
    .then(res => res.json())
    .then(data => {
        const categories = document.querySelector("#categories")
        for (const cat of data) {
            const option = document.createElement("option")
            option.value = cat.title
            option.text = cat.title
            categories.appendChild(option)
        }
    })
}
