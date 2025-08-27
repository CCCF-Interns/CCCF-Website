const buttonMeow = document.querySelector("#upload-button");
const imageInput = document.querySelector("#imageInput");
const bgBlur = document.querySelector("#blur");
const preview = document.querySelector("#preview");
const imageProgressContainer = document.querySelector("#image-progress");
const imageProgressBar = document.querySelector("#image-progress-bar");
const imageProgressText = document.querySelector("#image-progress-text");
const notificationBar = document.querySelector("#notification-bar");

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
let membersData;

const checkCircle = "/assets/svg/check_circle_green.svg";
let isEditing = false;
let isRemoving = false;
let socials = 0;
let totalNotifs = 0;
let removingMembers = [];

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

function createSocialInput() {
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
    container.appendChild(select);
    container.appendChild(remove);

    socialsContainer.appendChild(container);

    ++socials;
    updateAddSocial();
}

function updateAddSocial() {
    if (socials >= 3) {
        addSocialContainer.style.display = "none";
    }
    else {
        addSocialContainer.style.display = "flex";
    }
}

function checkFields() {
    let checker = true;
    let errorImage = "/assets/svg/error_red.svg";

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
    bgBlur.style.display = "none";
    teamMembers.style.display = "none";
    document.querySelector("#edit-member-text").style.display = "none";
    document.querySelector("#remove-member-container").style.display = "none";
    isEditing = false;
    isRemoving = false;
}

// Creating team members
async function loadData() {
    const response = await fetch ("/api/member");
    const result = await response.json();

    membersData = result.data;
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
        key: imageSource.split('/')[3].trim()
    };

    newMember.addEventListener("click", () => {
        if (isEditing) {
            addMemberImage.src = imageSource;
            addMemberName.value = name;
            addMemberJob.value = title;
            addMemberLevel.value = level;
            addMemberDesc.value = description;
            bgBlur.style.display = "block";
            addMemberForm.style.display = "block";
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

async function initializeMembers() {
    await loadData();
    for (let x of membersData) {
        addEmployee(x.id, x.name, x.job_title, x.job_level, x.description, 
            x.image_url);
    }
    document.body.style.overflow = "auto";
    loader.style.display = "none";
}

// All the event listeners
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
            createNotification("/assets/svg/error_red.svg", errorText);
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
            createNotification("/assets/svg/error_red.svg", errorText);
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
    const file = addMemberImageInput.files[0];
    if (!file) return;

    const fileSplit = file.name.split(".");
    const fileExt = fileSplit[fileSplit.length - 1];
    const allowedExt = ["png", "jpg", "webp", "svg", "gif"];

    if (!allowedExt.includes(fileExt)) {
        const errorText = `Could not read file extension: ${file.name}`;
        createNotification("/assets/svg/error_red.svg", errorText);
        return;
    }

    addMemberImage.src = URL.createObjectURL(file);
});

addSocial.addEventListener("click", createSocialInput);

submitAddMember.addEventListener("click", async () => {
    if (checkFields() === false) {
        return;
    }

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
            createNotification("/assets/svg/error_red.svg", errorText);
        }
    }
    
    const image_url = result.values.image_url || null;

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

    addMemberForm.style.display = "none";
    bgBlur.style.display = "none";
    clearFields();

    createNotification(
        checkCircle, `Inserted member "${values.name}" succesfully!`
    );
});

closeAddMember.addEventListener("click", () => {
    clearFields();
    submitAddMember.style.display = "none";
    addMemberForm.style.display = "none";
    bgBlur.style.display = "none";
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
    }
    else {
        closeAll();
        isEditing = false;
    }
});

deleteMemberButton.addEventListener("click", () => {
    const element = document.querySelector("#remove-member-container");
    if (!isRemoving) {
        closeAll();
        teamMembers.style.display = "flex";
        element.style.display = "flex";
        isRemoving = true;
    }
    else {
        closeAll();
        isRemoving = false;
    }
});

deleteMemberSubmit.addEventListener("click", async () => {
    if (removingMembers.length <= 0)
        return;

    for (let x of removingMembers) {
        let response = await fetch("/api/delete", {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify({ key: x.key })
        });

        let result = await response.json();

        console.log(result);

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

    window.location.reload();
});

deleteMemberClose.addEventListener("click", () => {
    removingMembers = [];
    closeAll();
});

initializeMembers();