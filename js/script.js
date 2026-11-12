// =====================================
// HERO SECTION - TYPING ANIMATION
// =====================================

document.addEventListener("DOMContentLoaded", function () {

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

    typeRole();
    
    // =====================================
    // AURA GLASS - MOUSE FOLLOWING GLOW
    // =====================================

    const glassCards = document.querySelectorAll(`
        .service-card,
        .skill-card,
        .project-card,
        .featured-project,
        .certification-card,
        .document-card,
        .resume-info,
        .resume-preview,
        .resume-card,
        .contact-card,
        .detail-item,
        .stat-box
    `);

    glassCards.forEach(function (card) {

        card.addEventListener("mousemove", function (event) {

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);

        });

    });


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
    // RESUME PREVIEW - CLICK TO LOAD
    // =====================================

    const loadResumeBtn = document.getElementById("loadResumeBtn");
    const resumeFrame = document.getElementById("resumeFrame");
    const resumeFrameContainer = document.getElementById("resumeFrameContainer");

    if (loadResumeBtn && resumeFrame && resumeFrameContainer) {

        loadResumeBtn.addEventListener("click", function () {

            resumeFrame.src = "assets/resume/Ajay_Pawar_AI_Engineer_al.pdf";

            resumeFrameContainer.style.display = "block";

            loadResumeBtn.style.display = "none";

        });

    }


    // =====================================
    // EMAILJS CONTACT FORM
    // =====================================

    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    if (contactForm) {

        if (
            typeof emailjs === "undefined" ||
            typeof portfolioConfig === "undefined" ||
            !portfolioConfig.emailjs
        ) {

            if (formStatus) {
                formStatus.textContent =
                    "Email service is currently unavailable. Please try again later.";
            }

        } else {

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
                        formStatus.textContent =
                            "Message sent successfully! Thank you for contacting me.";
                    }

                    contactForm.reset();

                })

                .catch(function (error) {

                    console.error("EmailJS Error:", error);

                    if (formStatus) {
                        formStatus.textContent =
                            "Message could not be sent. Please try again later.";
                    }

                })

                .finally(function () {

                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonHTML;

                });

            });

        }

    }

});
