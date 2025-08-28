document.addEventListener('DOMContentLoaded', function () {
    renderBlogs(0, 5)
    lastActive = null
    renderPaginator()    
})

async function renderBlogs(start, end) {
    fetch(`/api/blogs/${start}/${end}`)
    .then(res => res.json())
    .then(data => {
        const container = document.querySelector(".container")
        for (item of data) {
            const card = document.createElement("div")
            card.className = "card"

            const posterContainer = document.createElement("div")
            posterContainer.className = "card-poster"
            const img = document.createElement("img")
            img.src = item.poster
            posterContainer.appendChild(img)
            card.appendChild(posterContainer)


            const cardInfo = document.createElement("div")
            cardInfo.className = "card-info"
            const title = document.createElement("h2")
            title.innerText = item.title
            cardInfo.appendChild(title);
            const author = document.createElement("h3")
            if (item.author)
            author.innerText = item.author.name
            cardInfo.appendChild(author)
            const publishedAt = document.createElement("p")
            publishedAt.style.cssText = "font-style: italic;";
            if (item.publishedAt)
            publishedAt.innerText = item.publishedAt.split("T")[0]
            cardInfo.append(publishedAt)

            const categories = document.createElement("categories")
            categories.className = "categories"

            if (item.categories)
            for (category of item.categories) {
                const name = category.title
                const label = document.createElement("div");
                label.innerText = name;
                categories.appendChild(label)
            }

            cardInfo.appendChild(categories)

            card.appendChild(cardInfo)

            container.appendChild(card)
        }
    })
}

async function renderPaginator() {
    fetch("/api/blogs/total")
    .then(res => res.json())
    .then(data => {
        const paginator = document.createElement("div")
        paginator.className = "pages"

        const number = data.number
        const numOfPages = Math.ceil(number / 6) 
        for (i = 1; i <= numOfPages; i++) {
            const pageIcon = document.createElement("div")
            if (i == 1) {
                pageIcon.id = "activePage"
                lastActive = pageIcon
            }
            pageIcon.innerText = i;
            pageIcon.className = "page"
            paginator.appendChild(pageIcon)
        }
        const container = document.querySelector(".paginator")
        container.appendChild(paginator)
    })
    .then(() => document.querySelectorAll(".page").forEach((page) => page.addEventListener("click", changePage)))
}



async function changePage(e) {
    console.log(lastActive)
    lastActive.id = ""
    e.target.id = "activePage"
    lastActive = e.target
    const pageNumber = e.target.innerText
    document.querySelector(".container").innerHTML = ""
    
    const start = 6*(pageNumber-1);
    const end = start + 5
    await renderBlogs(start, end)
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}
