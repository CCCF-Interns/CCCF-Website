// let locationIcon = document.querySelector("#location");
// let locationArea = document.querySelector("#location-area");
// let locationHeading = document.querySelector("#location-heading");

// locationArea.addEventListener("mouseenter", () => {
//     locationIcon.style.width = "76px";
//     locationHeading.style.color = "#0000EE";
// });

// locationArea.addEventListener("mouseleave", () => {
//     locationIcon.style.width = "64px";
//     locationHeading.style.color = "black";
// });

// locationHeading.addEventListener("mouseenter", () => {
//     locationHeading.style.color = "#5555FF";   // lighter blue
//     locationHeading.style.textDecoration = "underline";
//     locationHeading.style.cursor = "pointer";
// });

// locationHeading.addEventListener("mouseleave", () => {
//     locationHeading.style.color = "#0000EE";   // normal blue
//     locationHeading.style.textDecoration = "none";
// });

// locationHeading.addEventListener("click", () => {
//     window.open("https://maps.app.goo.gl/gAY9EXMF4ZhD6J9NA");
// });

// Email Form Handling
const emailForm = document.getElementById('email-form');
const formMessage = document.getElementById('form-message');
const submitBtn = emailForm.querySelector("#email-submit");

console.log("MEOW");
emailForm.addEventListener('click', async (e) => {
    e.preventDefault();
    
    console.log("MEOW NIGGA");
    // Reset message
    formMessage.textContent = '';
    formMessage.className = 'form-message';
    
    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        description: document.getElementById('description').value
    };
    
    try {
        const response = await fetch('/contact/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            formMessage.textContent = 'Message sent successfully! We will get back to you soon.';
            formMessage.classList.add('success');
        } else {
            formMessage.textContent = data.error || 'Failed to send message. Please try again.';
            formMessage.classList.add('error');
        }
    } catch (error) {
        console.error('Error:', error);
        formMessage.textContent = 'An error occurred. Please try again later.';
        formMessage.classList.add('error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
});