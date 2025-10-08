let teamMembers = document.querySelector(".team-members-container");
let loader = document.querySelector("#loader");
let membersData;
let socialsData;

async function loadData() {
    let response = await fetch ("/api/member");
    let result = await response.json();

    membersData = result.data;

    response = await fetch ("/api/member/socials");
    result = await response.json();

    socialsData = result.data;
    console.log(socialsData);
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

        let url = mediaURL[i];

        if (!/^https?:\/\//i.test(url)) {
            url = "https://" + url;
        }

        mediaAnchor.href = url;
        switch(mediaType[i]) {
            case 'I':
                mediaImg.src = "/assets/svg/Instagram.svg";
                mediaImg.alt = "Instagram";
                console.log(mediaURL[i])
                break;
            case 'X':
                mediaImg.src = "/assets/svg/X.svg";
                mediaImg.alt = "X";
                break;
            case 'L':
                mediaImg.src = "/assets/svg/Linkedin.svg";
                mediaImg.alt = "Linkedin";
                break;
            case 'F':
                mediaImg.src = "/assets/svg/Facebook.svg";
                mediaImg.alt = "Facebook";
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
        console.log(x);
        let mediaTypes = [];
        let mediaURLs = [];
        for (let y of socialsData.filter(item => item.id === x.id)) {
            mediaTypes.push(y.social_type);
            mediaURLs.push(y.social_url);
        }
        addEmployee(x.name, x.job_title, x.description, mediaTypes, mediaURLs, x.image_url);
    }
    document.body.style.overflow = "auto";
    loader.style.display = "none";
}

initializeMembers();