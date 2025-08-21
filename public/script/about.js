let teamMembers = document.querySelector(".team-members-container");
let loader = document.querySelector("#loader");
let membersData;

async function loadData() {
    const response = await fetch ("/api/member");
    const result = await response.json();

    membersData = result.data;
}

function addEmployee(name, title, description, imageSource) {

    imageSource = imageSource || "/assets/images/dummyProfile.png";

    let newMember = document.createElement("div");

    newMember.classList.add("team-member");

    let memberImage = document.createElement("img");
    let memberName = document.createElement("div");
    let memberTitle = document.createElement("div");
    let memberDescription = document.createElement("div");

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

    teamMembers.appendChild(newMember);
}

async function initializeMembers() {
    await loadData();
    for (let x of membersData) {
        addEmployee(x.name, x.job_title, x.description, x.image_url);
    }
    document.body.style.overflow = "auto";
    loader.style.display = "none";
}

initializeMembers();