document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       MOBILE NAVIGATION
    ========================================== */

    const menuBtn = document.querySelector(".menu-btn");
    const navLinks = document.querySelector(".nav-links");
    const menuIcon = menuBtn?.querySelector("i");

    if (menuBtn && navLinks) {

        menuBtn.addEventListener("click", () => {

            navLinks.classList.toggle("active");

            menuIcon.classList.toggle("fa-bars");
            menuIcon.classList.toggle("fa-xmark");

        });

        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("active");

                menuIcon.classList.remove("fa-xmark");
                menuIcon.classList.add("fa-bars");

            });

        });

    }

    /* ==========================================
       THEME TOGGLE
    ========================================== */

    const themeBtn = document.getElementById("theme-toggle");
    const themeIcon = themeBtn?.querySelector("i");

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        themeIcon?.classList.replace("fa-moon", "fa-sun");

    }

    if (themeBtn) {

        themeBtn.addEventListener("click", () => {

            document.body.classList.toggle("dark-mode");

            const darkMode =
                document.body.classList.contains("dark-mode");

            localStorage.setItem(
                "theme",
                darkMode ? "dark" : "light"
            );

            themeIcon?.classList.toggle("fa-moon");
            themeIcon?.classList.toggle("fa-sun");

        });

    }

    /* ==========================================
       STICKY NAVBAR
    ========================================== */

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if (!navbar) return;

        navbar.classList.toggle(
            "scrolled",
            window.scrollY > 40
        );

    });

    /* ==========================================
       ACTIVE NAVIGATION
    ========================================== */

    const sections = document.querySelectorAll("section");
    const navItems = document.querySelectorAll(".nav-links a");

    function updateActiveLink() {

        let current = "";

        sections.forEach(section => {

            const top = section.offsetTop - 120;

            if (window.scrollY >= top) {

                current = section.getAttribute("id");

            }

        });

        navItems.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === `#${current}`) {

                link.classList.add("active");

            }

        });

    }

    window.addEventListener("scroll", updateActiveLink);

    updateActiveLink();

    /* ==========================================
       REVEAL ANIMATION
    ========================================== */

    const revealItems = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("active");

            }

        });

    }, {

        threshold: 0.15

    });

    revealItems.forEach(item => {

        observer.observe(item);

    });

    /* ==========================================
       STAGGER ABOUT CARDS
    ========================================== */

    document
        .querySelectorAll(".about-card")
        .forEach((card, index) => {

            card.style.transitionDelay =
                `${index * 120}ms`;

        });

    /* ==========================================
       STATS COUNTER
    ========================================== */

    const counters = document.querySelectorAll(".stat-card h3");

    const counterObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            const counter = entry.target;

            const text = counter.textContent.trim();

            const number = parseInt(text);

            if (isNaN(number)) return;

            let current = 0;

            const increment = Math.max(1, Math.ceil(number / 60));

            const timer = setInterval(() => {

                current += increment;

                if (current >= number) {

                    current = number;

                    clearInterval(timer);

                }

                counter.textContent = text.replace(number, current);

            }, 20);

            counterObserver.unobserve(counter);

        });

    });

    counters.forEach(counter => {

        counterObserver.observe(counter);

    });

    /* ==========================================
       CARD HOVER GLOW
    ========================================== */

    const cards = document.querySelectorAll(

        ".about-card, .skill-card, .project-card"

    );

    cards.forEach(card => {

        card.addEventListener("mousemove", e => {

            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;

            const y = e.clientY - rect.top;

            card.style.setProperty("--x", `${x}px`);
            card.style.setProperty("--y", `${y}px`);

        });

    });

    /* ==========================================
       FOOTER YEAR
    ========================================== */

    const year = document.getElementById("year");

    if (year) {

        year.textContent = new Date().getFullYear();

    }

});