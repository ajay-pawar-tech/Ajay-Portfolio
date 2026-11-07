// =====================================
// HERO SECTION - TYPING ANIMATION
// =====================================

const typingElement = document.getElementById("typing-role");

const roles = [
    "AI & Machine Learning Engineer",
    "Data Scientist",
    "Data Analyst",
    "Python Full-Stack Developer"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeRole() {
    if (!typingElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    typingElement.textContent = currentRole.substring(0, charIndex);

    let speed = isDeleting ? 45 : 90;

    if (!isDeleting && charIndex === currentRole.length) {
        speed = 1800;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 400;
    }

    setTimeout(typeRole, speed);
}

document.addEventListener("DOMContentLoaded", typeRole);


// =====================================
// PROFILE PHOTO COLOR TOGGLE
// =====================================

const profilePhoto = document.getElementById("profilePhoto");

if (profilePhoto) {
    profilePhoto.addEventListener("click", function () {
        this.classList.toggle("color-mode");
    });
}


// =====================================
// EMAILJS CONTACT FORM
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    if (!contactForm) return;

    if (
        typeof emailjs === "undefined" ||
        typeof portfolioConfig === "undefined" ||
        !portfolioConfig.emailjs
    ) {
        if (formStatus) {
            formStatus.textContent = "Email service is currently unavailable. Please try again later.";
        }
        return;
    }

    emailjs.init({
        publicKey: portfolioConfig.emailjs.publicKey
    });

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const submitButton = contactForm.querySelector('[type="submit"]');

        if (!submitButton) return;

        const originalButtonHTML = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.textContent = "Sending Message...";

        if (formStatus) {
            formStatus.textContent = "Sending your message...";
        }

        emailjs.sendForm(
            portfolioConfig.emailjs.serviceId,
            portfolioConfig.emailjs.templateId,
            contactForm
        )
        .then(function () {

            if (formStatus) {
                formStatus.textContent = "Message sent successfully! Thank you for contacting me.";
            }

            contactForm.reset();

        })
        .catch(function (error) {

            console.error("EmailJS Error:", error);

            if (formStatus) {
                formStatus.textContent = "Message could not be sent. Please try again later.";
            }

        })
        .finally(function () {

            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonHTML;

        });

    });

});
