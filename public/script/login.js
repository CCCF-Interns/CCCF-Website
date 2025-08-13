const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const submitButton = document.querySelector("#submit");
const passwordVisibility = document.querySelector("#password-visibility");
let isVisible = false;

submitButton.addEventListener("click", async () => {
    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                email: emailInput.value, 
                password: passwordInput.value
            })
        });

        const data = await response.json();
        
        console.log(data);
        
        window.location.href = "/admin";
    }
    catch(error) {
        console.error(error);
    }
});

passwordVisibility.addEventListener("mouseenter", () => {
    if (isVisible)
        passwordVisibility.src = "/assets/svg/visibility_off.svg";
    else
        passwordVisibility.src = "/assets/svg/visibility.svg";
});

passwordVisibility.addEventListener("mouseleave", () => {
    if (isVisible)
        passwordVisibility.src = "/assets/svg/visibility.svg";
    else
        passwordVisibility.src = "/assets/svg/visibility_off.svg";
});

passwordVisibility.addEventListener("click", () => {
    if (isVisible) {
        passwordVisibility.src = "/assets/svg/visibility_off.svg";
        passwordInput.type = "password";
        isVisible = false;
    }
    else {
        passwordVisibility.src = "/assets/svg/visibility.svg";
        passwordInput.type = "text";
        isVisible = true;
    }
});