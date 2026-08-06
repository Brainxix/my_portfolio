document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       1. PRELOADER DISMISSAL
    ========================================== */
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.classList.add("hidden");
        setTimeout(() => preloader.classList.add("hidden"), 400);
    }

    /* ==========================================
       2. FOOTER DYNAMIC YEAR
    ========================================== */
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* ==========================================
       3. MOBILE NAVIGATION TOGGLE
    ========================================== */
    const menuBtn = document.getElementById("menuBtn") || document.querySelector(".menu-btn");
    const navLinks = document.getElementById("navLinks") || document.querySelector(".nav-links");
    const menuIcon = menuBtn?.querySelector("i");

    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            menuBtn.setAttribute("aria-expanded", navLinks.classList.contains("active"));
            
            if (menuIcon) {
                menuIcon.classList.toggle("fa-bars");
                menuIcon.classList.toggle("fa-xmark");
            }
        });

        // Close menu on link click
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                if (menuIcon) {
                    menuIcon.classList.remove("fa-xmark");
                    menuIcon.classList.add("fa-bars");
                }
            });
        });
    }

    /* ==========================================
       4. THEME TOGGLE (LIGHT / DARK)
    ========================================== */
    const themeBtn = document.getElementById("theme-toggle");
    const themeIcon = themeBtn?.querySelector("i");
    const body = document.body;

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        themeIcon?.classList.replace("fa-sun", "fa-moon");
    } else {
        body.classList.add("dark-mode");
        themeIcon?.classList.replace("fa-moon", "fa-sun");
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const isDark = body.classList.contains("dark-mode");

            if (isDark) {
                body.classList.remove("dark-mode");
                body.classList.add("light-mode");
                themeIcon?.classList.replace("fa-sun", "fa-moon");
                localStorage.setItem("theme", "light");
            } else {
                body.classList.remove("light-mode");
                body.classList.add("dark-mode");
                themeIcon?.classList.replace("fa-moon", "fa-sun");
                localStorage.setItem("theme", "dark");
            }
        });
    }

    /* ==========================================
       5. HEADER ELEVATION & SCROLL PROGRESS
    ========================================== */
    const header = document.querySelector(".header");
    const progressBar = document.getElementById("progressBar");
    const backToTopBtn = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;

        // Navbar elevation styling
        if (header) {
            header.classList.toggle("scrolled", scrollY > 30);
        }

        // Scroll Progress Bar
        if (progressBar) {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
            progressBar.style.width = `${progress}%`;
        }

        // Back To Top Visibility
        if (backToTopBtn) {
            backToTopBtn.classList.toggle("active", scrollY > 400);
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* ==========================================
       6. ACTIVE NAV HIGHLIGHT ON SCROLL
    ========================================== */
    const sections = document.querySelectorAll("section[id]");
    const navItems = document.querySelectorAll(".nav-links a");

    function highlightActiveSection() {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navItems.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", highlightActiveSection);

    /* ==========================================
       7. REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    ========================================== */
    const revealItems = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach(item => revealObserver.observe(item));

    /* ==========================================
       8. NUMERIC COUNTER ANIMATION
    ========================================== */
    const counters = document.querySelectorAll(".counter");

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const targetNum = parseInt(counter.dataset.target || counter.textContent, 10);

            if (isNaN(targetNum)) return;

            let currentNum = 0;
            const step = Math.max(1, Math.ceil(targetNum / 50));

            const timer = setInterval(() => {
                currentNum += step;
                if (currentNum >= targetNum) {
                    counter.textContent = targetNum + "+";
                    clearInterval(timer);
                } else {
                    counter.textContent = currentNum;
                }
            }, 30);

            counterObserver.unobserve(counter);
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    /* ==========================================
       9. CARD SPOTLIGHT & TILT EFFECT
    ========================================== */
    const interactiveCards = document.querySelectorAll(".about-card, .stat-card, .project-card, .skill-card");

    interactiveCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set coordinates for CSS background glow
            card.style.setProperty("--x", `${x}px`);
            card.style.setProperty("--y", `${y}px`);

            // Subtle 3D Tilt calculation
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
        });
    });

});

/* Include .skill-category in card spotlight effects */
const interactiveCards = document.querySelectorAll(
    ".about-card, .stat-card, .project-card, .skill-card, .skill-category"
);

interactiveCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);
    });
});

/* ==========================================
   10. PROJECT FILTERING LOGIC
========================================== */
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // Update Active Button Class
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filterValue = btn.getAttribute("data-filter");

        projectCards.forEach(card => {
            const categories = card.getAttribute("data-category") || "";

            if (filterValue === "all" || categories.includes(filterValue)) {
                card.classList.remove("is-hidden");
            } else {
                card.classList.add("is-hidden");
            }
        });
    });
});

/* ==========================================
   SCROLL REVEAL INTERSECTION OBSERVER
========================================== */
document.addEventListener("DOMContentLoaded", () => {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // Animates once per scroll
            }
        });
    }, {
        threshold: 0.12, // Triggers when 12% of the element is visible
        rootMargin: "0px 0px -40px 0px"
    });

    // Attach observer to all elements carrying the .reveal class
    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
});

document.querySelectorAll('.experience-content').forEach((content) => {
    const p = content.querySelector('p');
    if (p.textContent.length > 150) {
        const fullText = p.textContent;
        const shortText = fullText.substring(0, 150) + '...';
        
        p.textContent = shortText;

        const btn = document.createElement('button');
        btn.textContent = 'Read More';
        btn.className = 'read-more-btn';
        content.appendChild(btn);

        btn.addEventListener('click', () => {
            const isExpanded = btn.textContent === 'Read Less';
            p.textContent = isExpanded ? shortText : fullText;
            btn.textContent = isExpanded ? 'Read More' : 'Read Less';
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".experience-card");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Animates once
            }
        });
    }, {
        threshold: 0.2
    });

    cards.forEach((card) => observer.observe(card));
});