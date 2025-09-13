const buttonMeow = document.querySelector("#upload-button");
const imageInput = document.querySelector("#imageInput");
const bgBlur = document.querySelector("#blur");
const preview = document.querySelector("#preview");
const imageProgressContainer = document.querySelector("#image-progress");
const imageProgressBar = document.querySelector("#image-progress-bar");
const imageProgressText = document.querySelector("#image-progress-text");
const notificationBar = document.querySelector("#notification-bar");
const imageForm = document.querySelector("#add-image-form");

// Add album thingies
const addAlbumButton = document.querySelector("#add-album");
const addAlbumForm = document.querySelector("#add-album-form");
const addAlbumInput = document.querySelector("#add-album-input");
const addAlbumSubmit = document.querySelector("#add-album-submit");
const addAlbumClose = document.querySelector("#add-album-close");

// Delete album thingies
const deleteAlbumButton = document.querySelector("#delete-album");
const deleteAlbumForm = document.querySelector("#delete-album-form");
const deleteAlbumDropDown = document.querySelector("#delete-album-dropdown");
const deleteAlbumSubmit = document.querySelector("#delete-album-submit");
const deleteAlbumClose = document.querySelector("#delete-album-close");

// Add member thingies
const addMemberButton = document.querySelector("#add-member");
const addMemberForm = document.querySelector("#add-member-form");
const addMemberImageInput = document.querySelector("#add-member-image-input");
const addMemberPreview = document.querySelector("#add-member-preview");
const addMemberImage = document.querySelector("#add-member-image");
const addSocial = document.querySelector("#add-social");
const addSocialContainer = document.querySelector("#add-member-add-social");
const socialsContainer = document.querySelector(
    "#add-member-socials-container");
const submitAddMember = document.querySelector("#add-member-submit");
const closeAddMember = document.querySelector("#add-member-close");
const addMemberName = document.querySelector("#add-member-name");
const addMemberJob = document.querySelector("#add-member-job");
const addMemberLevel = document.querySelector("#add-member-level");
const addMemberDesc = document.querySelector("#add-member-description");

// Edit and Delete member
const editMemberButton = document.querySelector("#edit-member");
const editMemberSubmit = document.querySelector("#edit-member-submit");
const deleteMemberButton = document.querySelector("#remove-member");
const deleteMemberSubmit = document.querySelector("#remove-member-submit");
const deleteMemberClose = document.querySelector("#remove-member-exit");

// team members
let teamMembers = document.querySelector(".team-members-container");
let loader = document.querySelector("#loader");
let submitLoader = document.querySelector("#submit-loader");
let membersData;
let membersSocials;
let albumsData;

const checkCircle = "/assets/svg/check_circle_green.svg";
const errorImage = "/assets/svg/error_red.svg";
let isEditing = false;
let isRemoving = false;
let socials = 0;
let totalNotifs = 0;
let removingMembers = [];
let currentAlbum = 0;

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

function createSocialInput(url, select_val) {
    const container = document.createElement("div");
    const input = document.createElement("input");
    const select = document.createElement("select");
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");
    const option3 = document.createElement("option");
    const option4 = document.createElement("option");
    const remove = document.createElement("img");

    container.classList.add("add-member-social");
    container.classList.add("flex-container");
    select.classList.add("add-member-social-dropdown");
    remove.classList.add("clickable");

    input.type = "text";
    input.placeholder = "* Social";
    remove.src = "/assets/svg/remove.svg";
    option1.value = "X";
    option1.text = "X";
    option2.value = "L";
    option2.text = "LinkedIn";
    option3.value = "F";
    option3.text = "Facebook";
    option4.value = "I";
    option4.text = "Instagram";

    input.value = url || "";

    remove.addEventListener("click", () => {
        socialsContainer.removeChild(container);
        --socials;
        updateAddSocial();
    });

    select.appendChild(option1);
    select.appendChild(option2);
    select.appendChild(option3);
    select.appendChild(option4);
    container.appendChild(input);

    select.value = select_val || "X";

    container.appendChild(select);
    container.appendChild(remove);

    socialsContainer.appendChild(container);

    ++socials;
    updateAddSocial();
}

function updateAddSocial() {
    console.log(socials);
    if (socials >= 3) {
        addSocialContainer.style.display = "none";
    }
    else {
        addSocialContainer.style.display = "flex";
    }
}

function checkFields() {
    let checker = true;

    if (addMemberName.value.trim() == "") {
        createNotification(
            errorImage, "Required Field! Member name left empty."
        );
        checker = false;
    }
    if (addMemberJob.value.trim() == "") {
        createNotification(
            errorImage, "Required Field! Member job left empty."
        );
        checker = false;
    }
    if (addMemberLevel.value.trim() == "") {
        createNotification(
            errorImage, "Required Field! Member level left empty."
        );
        checker = false;
    }

    if (socials > 0) {
        const socialConts = document.querySelectorAll(".add-member-social");
        socialConts.forEach((e, index) => {
            const social = e.querySelector("input");
            const type = e.querySelector(".add-member-social-dropdown");
            
            if (social.value.trim() == "") {
                createNotification(
                    errorImage, "Required Field! Member social left empty."
                );
                checker = false;
            }
            if (type.value.trim() == "") {
                createNotification(
                    errorImage, "Required Field! Member social type left empty."
                );
                checker = false;
            }
        });
    }

    return checker;
}

function clearFields() {
    addMemberImage.src = "/assets/images/dummyProfile.png";
    addMemberName.value = "";
    addMemberJob.value = "";
    addMemberLevel.value = "";
    addMemberDesc.value = "";

    if (socials > 0) {
        const socialConts = document.querySelectorAll(".add-member-social");
        socialConts.forEach((e) => {
            const social = e.querySelector("input");
            const type = e.querySelector(".add-member-social-dropdown");
            
            social.value = "";
            type.value = "X";
        });
    }

    socials = 0;

    updateAddSocial();
}

function closeAll() {
    addMemberForm.style.display = "none";
    addAlbumForm.style.display = "none";
    deleteAlbumForm.style.display = "none";
    bgBlur.style.display = "none";
    teamMembers.style.display = "none";
    document.querySelector("#edit-member-text").style.display = "none";
    document.querySelector("#remove-member-container").style.display = "none";
    isEditing = false;
    isRemoving = false;
    socials = 0;
    socialsContainer.textContent = "";
}

// Creating team members
async function loadData() {
    let response = await fetch ("/api/member");
    let result = await response.json();
    membersData = result.data;

    response = await fetch("/api/member/socials");
    result = await response.json();
    membersSocials = result.data;

    console.log(membersSocials);
}

async function loadAlbumData() {
    let response = await fetch("/api/album");
    let result = await response.json();
    albumsData = result.data;
    if (albumsData.length > 0)
        currentAlbum = albumsData[0].id;
    console.log(albumsData);
}

function addEmployee(id, name, title, level, description, imageSource) {

    imageSource = imageSource || "/assets/images/dummyProfile.png";

    let newMember = document.createElement("div");
    let isClicked = false;

    newMember.classList.add("team-member");

    let memberImage = document.createElement("img");
    let memberName = document.createElement("div");
    let memberTitle = document.createElement("div");
    let memberDescription = document.createElement("div");
    let memberClicked = document.createElement("img");

    memberImage.classList.add("member-image");
    memberImage.src = imageSource;
    newMember.appendChild(memberImage);

    memberName.classList.add("member-name");
    memberName.textContent = name;
    newMember.appendChild(memberName);

    memberTitle.classList.add("member-title");
    memberTitle.textContent = title;
    newMember.appendChild(memberTitle);

    memberDescription.classList.add("member-description");
    memberDescription.textContent = description;
    newMember.appendChild(memberDescription);

    memberClicked.classList.add("clicked");
    memberClicked.src = checkCircle;
    newMember.appendChild(memberClicked);

    let values = {
        id: id,
        key: imageSource.split("/")[3].trim()
    };

    let socialValues = membersSocials.filter(item => item.id === id);

    newMember.addEventListener("click", async () => {
        if (isEditing) {
            addMemberImage.src = imageSource;
            addMemberName.value = name;
            addMemberJob.value = title;
            addMemberLevel.value = level;
            addMemberDesc.value = description;

            bgBlur.style.display = "block";
            addMemberForm.style.display = "block";

            for (let i = 0; i < socialValues.length; i++) {
                const socialUrl = socialValues[i]["social_url"];
                const socialType = socialValues[i]["social_type"];
                createSocialInput(socialUrl, socialType);
            }

            updateAddSocial();
            await setFileInputFromUrl(imageSource, addMemberImageInput);
            removingMembers.push(values);
        }
        else if (isRemoving) {
            if (!isClicked) {
                removingMembers.push(values);
                document.querySelector("#select-text").textContent = 
                    `Selected members: ${removingMembers.length}`;
                memberClicked.style.display = "block";
                isClicked = true;
            }
            else {
                removingMembers = removingMembers.filter(x => x !== values);
                document.querySelector("#select-text").textContent =
                    `Selected members: ${removingMembers.length}`;
                memberClicked.style.display = "none";
                isClicked = false;
            }
        }
    });

    teamMembers.appendChild(newMember);
}

function addAlbum(id, name) {
    const option = document.createElement("option");
    const album_id = id;

    option.text = name;
    option.value = album_id;

    deleteAlbumDropDown.appendChild(option);
}

async function initializeAlbums() {
    deleteAlbumDropDown.textContent = "";
    await loadAlbumData();

    for (let x of albumsData) {
        addAlbum(x.id, x.name);
    }
}

async function initializeMembers() {
    teamMembers.textContent = "";
    await loadData();

    for (let x of membersData) {
        addEmployee(x.id, x.name, x.job_title, x.job_level, x.description, 
            x.image_url);
    }
}

async function initialize() {
    await initializeMembers();
    await initializeAlbums();
    document.body.style.overflow = "auto";
    loader.style.display = "none";
}

async function removeMembers(imageDelete) {
    if (removingMembers.length <= 0)
        return;
    closeAll();
    bgBlur.style.display = "block";
    submitLoader.style.display = "block";

    let response;
    let result;
    
    for (let x of removingMembers) {
        if (imageDelete) {
            response = await fetch("/api/delete", {
                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify({ key: x.key })
            });

            result = await response.json();

            console.log(result);
        }

        response = await fetch("/api/member/socials/delete", {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify({ id: x.id })
        });

        result = await response.json();

        console.log(result);

        response = await fetch("/api/member/delete", {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify({ id: x.id })
        });

        result = await response.json();
        
        console.log(result);
    }

    removingMembers = [];

    bgBlur.style.display = "none";
    submitLoader.style.display = "none";
}

async function addMember() {
    if (checkFields() === false) {
        return;
    }
    closeAll();
    bgBlur.style.display = "block";

    const file = addMemberImageInput.files[0];
    let result = null;
    if (file) {
        console.log("Selected File:", file);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            result = await response.json();
        }
        catch(error) {
            console.error(error);
            const errorText = `Could not upload file: ${file.name}`;
            createNotification(errorImage, errorText);
        }
    }
    
    let image_url;

    if (result)
        image_url = result.values.image_url;
    else
        image_url = "/assets/images/dummyProfile.png"

    let values = {
        id: crypto.randomUUID(),
        name: addMemberName.value,
        job: addMemberJob.value,
        level: addMemberLevel.value,
        image_url: image_url,
        description: addMemberDesc.value,
        socials: [],
        social_types: []
    };

    if (socials > 0) {
        const socialConts = document.querySelectorAll(".add-member-social");
        socialConts.forEach((e) => {
            const social = e.querySelector("input");
            const type = e.querySelector(".add-member-social-dropdown");
            
            values.socials.push(social.value);
            values.social_types.push(type.value);
        });
    }

    const resp = await fetch("/api/member/insert", {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ data: values })
    });

    const resp2 = await fetch("/api/member/socials/insert", {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ data: values })
    });

    const result2 = await resp.json();
    const result3 = await resp2.json();

    console.log(result2);
    console.log(result3);

    clearFields();

    createNotification(
        checkCircle, `Inserted member "${values.name}" succesfully!`
    );
}

function loadAddImage() {
    const file = addMemberImageInput.files[0];
    if (!file) return;

    const fileSplit = file.name.split(".");
    const fileExt = fileSplit[fileSplit.length - 1];
    const allowedExt = ["png", "jpg", "webp", "svg", "gif"];

    if (!allowedExt.includes(fileExt)) {
        const errorText = `Could not read file extension: ${file.name}`;
        createNotification(errorImage, errorText);
        return;
    }

    addMemberImage.src = URL.createObjectURL(file);
}

async function setFileInputFromUrl(url, input) {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileName = url.split("/").pop();
    const file = new File([blob], fileName, { type: blob.type });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    input.files = dataTransfer.files;
}

// All the event listeners
buttonMeow.addEventListener("click", () => {

    // imageInput.click();
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
            createNotification(errorImage, errorText);
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
            createNotification(errorImage, errorText);
        }

        totalSpeed += progressSpeed;
        imageProgressBar.style.width = `${totalSpeed}%`;
    }

    imageProgressContainer.style.display = "none";
    const notif = `Successfully uploaded ${files.length} images!`;
    createNotification(checkCircle, notif);
});

addMemberPreview.addEventListener("click", () => {
    addMemberImageInput.click();
});

addMemberImageInput.addEventListener("change", () => {
    loadAddImage();
});

addSocial.addEventListener("click", () => {
    createSocialInput(null, null);
});

submitAddMember.addEventListener("click", async () => {
    submitLoader.style.display = "block";
    await addMember();
    await initializeMembers();
    addMemberForm.style.display = "none";
    bgBlur.style.display = "none";
    submitLoader.style.display = "none";
});

closeAddMember.addEventListener("click", () => {
    clearFields();
    socialsContainer.textContent = "";
    submitAddMember.style.display = "none";
    addMemberForm.style.display = "none";
    bgBlur.style.display = "none";
    removingMembers = [];
});

addMemberButton.addEventListener("click", () => {
    closeAll();
    submitAddMember.style.display = "flex";
    editMemberSubmit.style.display = "none";
    addMemberForm.style.display = "block";
    bgBlur.style.display = "block";
});

editMemberButton.addEventListener("click", () => {
    if (!isEditing) {
        closeAll();
        teamMembers.style.display = "flex";
        submitAddMember.style.display = "none";
        editMemberSubmit.style.display = "flex";
        document.querySelector("#edit-member-text").style.display = "block";
        isEditing = true;
        loadAddImage();
        removingMembers = [];
    }
    else {
        closeAll();
        isEditing = false;
        removingMembers = [];
    }
});

editMemberSubmit.addEventListener("click", async () => {
    loadAddImage();
    await addMember();
    await removeMembers(false);
});

deleteMemberButton.addEventListener("click", () => {
    const element = document.querySelector("#remove-member-container");
    if (!isRemoving) {
        closeAll();
        teamMembers.style.display = "flex";
        element.style.display = "flex";
        isRemoving = true;
        removingMembers = [];
    }
    else {
        closeAll();
        isRemoving = false;
        removingMembers = [];
    }
});

deleteMemberSubmit.addEventListener("click", async () => {
    await removeMembers(true);

    window.location.reload();
});

deleteMemberClose.addEventListener("click", () => {
    removingMembers = [];
    closeAll();
});

// Album Event listeners
addAlbumButton.addEventListener("click", () => {
    closeAll();
    bgBlur.style.display = "block";
    addAlbumForm.style.display = "flex";
});

addAlbumSubmit.addEventListener("click", async () => {
    if (addAlbumInput.value.trim() == "") {
        createNotification(errorImage, "Enter album name!");
        return;
    }

    closeAll();
    bgBlur.style.display = "block";
    submitLoader.style.display = "block";
    
    const values = {
        id: crypto.randomUUID(),
        name: addAlbumInput.value
    };

    const response = await fetch("/api/album/insert", {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ data: values })
    });

    await initializeAlbums();

    createNotification(checkCircle, `Inserted album ${values.name}!`);

    bgBlur.style.display = "none";
    submitLoader.style.display = "none";

    console.log(await response.json());
});

addAlbumClose.addEventListener("click", () => {
    closeAll();
});

deleteAlbumButton.addEventListener("click", () => {
    closeAll();
    bgBlur.style.display = "block";
    deleteAlbumForm.style.display = "flex";
});

deleteAlbumClose.addEventListener("click", () => {
    closeAll();
});

deleteAlbumDropDown.addEventListener("change", () => {
    currentAlbum = deleteAlbumDropDown.value;
    console.log(currentAlbum);
});

deleteAlbumSubmit.addEventListener("click", async () => {
    let found = false;
    for (let x of albumsData) {
        if (x.id == currentAlbum) {
            found = true;
            break;
        }
    }

    if (!found)
        return;
    
    closeAll();
    bgBlur.style.display = "block";
    submitLoader.style.display = "block";
    let response = await fetch("/api/gallery/delete/album", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentAlbum })
    });

    response = await fetch("/api/album/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentAlbum })
    });

    await initializeAlbums();
    createNotification(checkCircle, `Deleted album successfully!`);

    closeAll();
    submitLoader.style.display = "none";
});

initialize();