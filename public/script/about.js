let teamMembers = document.querySelector(".team-members-container");
let loader = document.querySelector("#loader");
let membersData;

async function loadData() {
    const response = await fetch ("/api/member");
    const result = await response.json();

    membersData = result.data;
}

function addEmployee(name, title, description, mediaType, mediaURL, imageSource) {

    imageSource = imageSource || "/assets/images/dummyProfile.png";

    let newMember = document.createElement("div");

    newMember.classList.add("team-member");

    let memberImage = document.createElement("img");
    let memberName = document.createElement("div");
    let memberTitle = document.createElement("div");
    let memberDescription = document.createElement("div");
    let memberMedia = document.createElement("div");

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

    memberMedia.classList.add("member-socials");

    for (let i = 0; i < mediaType.length; i++) {
        let mediaAnchor = document.createElement("a");
        mediaAnchor.target = "_blank";
        let mediaImg = document.createElement("img");
        console.log(mediaType);

        switch(mediaType[i]) {
            case 'I':
                mediaImg.src = "/assets/svg/Instagram.svg";
                mediaImg.alt = "Instagram";
                mediaAnchor.href = mediaURL[i];
                console.log(mediaURL[i])
                break;
            case 'X':
                mediaImg.src = "/assets/svg/X.svg";
                mediaImg.alt = "X";
                mediaAnchor.href = mediaURL[i];
                break;
            case 'L':
                mediaImg.src = "/assets/svg/Linkedin.svg";
                mediaImg.alt = "Linkedin";
                mediaAnchor.href = mediaURL[i];
                break;
            case 'F':
                mediaImg.src = "/assets/svg/Facebook.svg";
                mediaImg.alt = "Facebook";
                mediaAnchor.href = mediaURL[i];
                break;
        }
        mediaAnchor.appendChild(mediaImg);
        memberMedia.appendChild(mediaAnchor);
    }

    newMember.appendChild(memberMedia);

    teamMembers.appendChild(newMember);
}

async function initializeMembers() {
    await loadData();
    for (let x of membersData) {
        addEmployee(x.name, x.job_title, x.description, [], [], x.imageURL);
    }
    document.body.style.overflow = "auto";
    loader.style.display = "none";
}

initializeMembers();