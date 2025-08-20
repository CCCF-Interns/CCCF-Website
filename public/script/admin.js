const buttonMeow = document.querySelector("#upload-button");
const imageInput = document.querySelector("#imageInput");
const preview = document.querySelector("#preview");
const imageProgressContainer = document.querySelector("#image-progress");
const imageProgressBar = document.querySelector("#image-progress-bar");
const imageProgressText = document.querySelector("#image-progress-text");
const notificationBar = document.querySelector("#notification-bar");

let totalNotifs = 0;

function calculateProgressSpeed(n) {
    return 100/n;
}

function createNotification(iconLink, text) {
    const container = document.createElement("div");
    const p = document.createElement("p");
    const close = document.createElement("img");

    container.classList.add("notification");
    container.classList.add("flex-container");
    p.classList.add("notification-text");
    close.classList.add("notification-icon");
    close.classList.add("clickable");

    p.textContent = text;
    close.src = "/assets/svg/close.svg";


    close.addEventListener("click", () => {
        notificationBar.removeChild(container);
        container.textContent = "";
        --totalNotifs;
        updateNotificationBar();
    });

    if (iconLink != null) {
        const icon = document.createElement("img");
        icon.classList.add("notification-icon");
        icon.src = iconLink;
        container.appendChild(icon);
    }

    container.appendChild(p);
    container.appendChild(close);
    notificationBar.appendChild(container);

    ++totalNotifs;
    updateNotificationBar();
}

function updateNotificationBar() {
    if (totalNotifs == 0) {
        notificationBar.style.display = "none";
    }
    else {
        notificationBar.style.display = "flex";
    }
}

buttonMeow.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", async () => {
    const files = imageInput.files;
    if (!files) return;

    imageProgressContainer.style.display = "flex";
    imageProgressText.textContent = `Uploading ${files.length} images...`;

    const progressSpeed = calculateProgressSpeed(files.length);
    let totalSpeed = 0;
    for (let x of files) {
        const fileSplit = x.name.split(".");
        const fileExt = fileSplit[fileSplit.length - 1];
        const allowedExt = ["png", "jpg", "webp", "svg", "gif"];

        if (!allowedExt.includes(fileExt)) {
            totalSpeed += progressSpeed;
            imageProgressBar.style.width = `${totalSpeed}%`;
            const errorText = `Could not upload file: ${x.name}`;
            createNotification("/assets/svg/error_red.svg", errorText)
            continue;
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
            const errorText = `Could not upload file: ${x.name}`;
            createNotification("/assets/svg/error_red.svg", errorText)
        }

        totalSpeed += progressSpeed;
        imageProgressBar.style.width = `${totalSpeed}%`;
    }

    imageProgressContainer.style.display = "none";
});