
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

/* PROFILE PHOTO COLOR TOGGLE */

const profilePhoto = document.getElementById("profilePhoto");

if (profilePhoto) {
    profilePhoto.addEventListener("click", function () {
        this.classList.toggle("color-mode");
    });
}
