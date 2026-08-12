document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const typedName = document.getElementById("typedName");
    if (typedName) {
        const name = typedName.dataset.text || typedName.textContent.trim();
        if (!reduceMotion) {
            typedName.textContent = "";
            let index = 0;
            const typeName = () => {
                typedName.textContent = name.slice(0, index + 1);
                index += 1;
                if (index < name.length) window.setTimeout(typeName, 70);
            };
            window.setTimeout(typeName, 280);
        }
    }

    document.querySelectorAll(".section-tag[data-messages]").forEach((tag) => {
        const messages = tag.dataset.messages.split("|").map((message) => message.trim()).filter(Boolean);
        if (reduceMotion || messages.length < 2) return;
        let index = 0;
        window.setInterval(() => {
            index = (index + 1) % messages.length;
            tag.classList.remove("is-switching");
            void tag.offsetWidth;
            tag.textContent = messages[index];
            tag.classList.add("is-switching");
        }, 3600);
    });

    const preloader = document.getElementById("preloader");
    preloader?.classList.add("hidden");

    const yearSpan = document.getElementById("year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    const menuBtn = document.getElementById("menuBtn") || document.querySelector(".menu-btn");
    const navLinks = document.getElementById("navLinks");
    const menuIcon = menuBtn?.querySelector("i");

    menuBtn?.addEventListener("click", () => {
        const expanded = navLinks?.classList.toggle("active");
        menuBtn.setAttribute("aria-expanded", String(Boolean(expanded)));
        menuIcon?.classList.toggle("fa-bars", !expanded);
        menuIcon?.classList.toggle("fa-xmark", expanded);
    });

    navLinks?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuBtn?.setAttribute("aria-expanded", "false");
            menuIcon?.classList.replace("fa-xmark", "fa-bars");
        });
    });

    const themeBtn = document.getElementById("theme-toggle");
    const themeIcon = themeBtn?.querySelector("i");
    const applyTheme = (theme) => {
        document.body.classList.toggle("dark-mode", theme === "dark");
        document.body.classList.toggle("light-mode", theme === "light");
        themeBtn?.setAttribute("aria-pressed", String(theme === "dark"));
        themeIcon?.classList.toggle("fa-sun", theme === "dark");
        themeIcon?.classList.toggle("fa-moon", theme === "light");
    };

    applyTheme(localStorage.getItem("theme") || "dark");
    themeBtn?.addEventListener("click", () => {
        const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
        localStorage.setItem("theme", nextTheme);
        applyTheme(nextTheme);
    });

    const header = document.querySelector(".header");
    const progressBar = document.getElementById("progressBar");
    const backToTopBtn = document.getElementById("backToTop");
    const sections = document.querySelectorAll("section[id]");
    const navItems = document.querySelectorAll(".nav-links a");

    const updateScrollUI = () => {
        const scrollY = window.scrollY;
        header?.classList.toggle("scrolled", scrollY > 30);
        backToTopBtn?.classList.toggle("active", scrollY > 400);

        if (progressBar) {
            const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = `${pageHeight > 0 ? (scrollY / pageHeight) * 100 : 0}%`;
        }

        sections.forEach((section) => {
            const active = scrollY >= section.offsetTop - 140 && scrollY < section.offsetTop + section.offsetHeight - 140;
            if (!active) return;
            navItems.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${section.id}`));
        });
    };

    updateScrollUI();
    window.addEventListener("scroll", updateScrollUI, { passive: true });
    backToTopBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

    const experienceObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -35px 0px" });
    document.querySelectorAll(".experience-card").forEach((card, index) => {
        card.style.transitionDelay = `${index * 110}ms`;
        experienceObserver.observe(card);
    });

    const countUp = (counter) => {
        const target = Number(counter.dataset.target);
        const suffix = counter.dataset.suffix || "";
        if (!Number.isFinite(target)) return;
        if (reduceMotion) {
            counter.textContent = `${target}${suffix}`;
            return;
        }

        const start = performance.now();
        const duration = Math.min(1800, Math.max(700, target * 1.2));
        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = `${Math.round(target * eased)}${suffix}`;
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            countUp(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.65 });
    document.querySelectorAll(".counter").forEach((counter) => counterObserver.observe(counter));

    const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (hoverCapable && !reduceMotion) {
        document.querySelectorAll(".about-card, .stat-card, .project-card, .skill-category").forEach((card) => {
            card.classList.add("card-spotlight");
            card.addEventListener("pointermove", (event) => {
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                card.style.setProperty("--x", `${x}px`);
                card.style.setProperty("--y", `${y}px`);
                const rotateX = ((y - rect.height / 2) / rect.height) * -3;
                const rotateY = ((x - rect.width / 2) / rect.width) * 3;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            card.addEventListener("pointerleave", () => { card.style.transform = ""; });
        });
    }

    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");
    filterButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.classList.contains("active")));
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;
            filterButtons.forEach((item) => {
                const active = item === button;
                item.classList.toggle("active", active);
                item.setAttribute("aria-pressed", String(active));
            });
            projectCards.forEach((card) => {
                const show = filter === "all" || card.dataset.category?.includes(filter);
                card.classList.toggle("is-hidden", !show);
            });
        });
    });

    document.querySelectorAll(".experience-content").forEach((content) => {
        const paragraph = content.querySelector("p");
        if (!paragraph || paragraph.textContent.trim().length <= 150) return;
        const fullText = paragraph.textContent.trim();
        const shortText = `${fullText.slice(0, 150).trimEnd()}…`;
        paragraph.textContent = shortText;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "read-more-btn";
        button.textContent = "Read more";
        content.appendChild(button);
        button.addEventListener("click", () => {
            const expanded = button.getAttribute("aria-expanded") === "true";
            paragraph.textContent = expanded ? shortText : fullText;
            button.textContent = expanded ? "Read more" : "Read less";
            button.setAttribute("aria-expanded", String(!expanded));
        });
    });

    if (hoverCapable && !reduceMotion) {
        const cursorDot = document.getElementById("cursorDot");
        const cursorGlow = document.getElementById("cursorGlow");
        window.addEventListener("pointermove", (event) => {
            if (cursorDot) {
                cursorDot.style.left = `${event.clientX}px`;
                cursorDot.style.top = `${event.clientY}px`;
            }
            if (cursorGlow) {
                cursorGlow.style.left = `${event.clientX}px`;
                cursorGlow.style.top = `${event.clientY}px`;
            }
        }, { passive: true });
    }
});
