const buttonMeow = document.querySelector("#upload-button");
const imageInput = document.querySelector("#imageInput");
const preview = document.querySelector("#preview");

buttonMeow.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", async () => {
    const files = imageInput.files;
    if (!files) return;

    for (let x of files) {
        const fileExt = x.name.split(".")[1];
        const allowedExt = ["png", "jpg", "webp", "svg", "gif"];

        if (!allowedExt.includes(fileExt)) {
            return;
        }
        
        const img = document.createElement("img");
        img.src = URL.createObjectURL(x);
        img.style.maxWidth = "200px";
        preview.innerHTML = "";
        preview.appendChild(img);

        console.log("Selected File:", x);

        const formData = new FormData();
        formData.append("image", x);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            const resp = await fetch("/api/gallery/insert", {
                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify({ data: result.values })
            });

            const result2 = await resp.json();

            console.log(result2);
        }
        catch(error) {
            console.error(error);
        }
    }
});