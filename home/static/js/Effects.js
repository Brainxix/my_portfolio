/* ==========================================================
   EFFECTS.JS — Generative circuit background, magnetic cursor,
   3D tilt cards, kinetic text reveal, marquee init
   Load this AFTER script.js (or merge into it), still deferred.
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const styles = getComputedStyle(document.documentElement);
    const COPPER = styles.getPropertyValue("--accent-copper").trim() || "#d9873f";

    /* ===================================================
       1. GENERATIVE CIRCUIT CANVAS BACKGROUND
    =================================================== */
    (function circuitCanvas() {
        const canvas = document.getElementById("circuitCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let width, height, nodes, pulses = [];

        function hexToRgb(hex) {
            const m = hex.replace("#", "");
            const bigint = parseInt(m.length === 3 ? m.split("").map(c => c + c).join("") : m, 16);
            return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
        }
        const copperRgb = hexToRgb(COPPER);

        function resize() {
            width = canvas.width = canvas.offsetWidth * devicePixelRatio;
            height = canvas.height = canvas.offsetHeight * devicePixelRatio;
        }

        function buildNodes() {
            const count = Math.max(18, Math.min(42, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 45000)));
            nodes = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.15 * devicePixelRatio,
                vy: (Math.random() - 0.5) * 0.15 * devicePixelRatio,
                r: (Math.random() * 1.5 + 1) * devicePixelRatio
            }));
        }

        function maybeSpawnPulse() {
            if (reduceMotion || Math.random() > 0.02 || nodes.length < 2) return;
            const a = nodes[Math.floor(Math.random() * nodes.length)];
            let b = nodes[Math.floor(Math.random() * nodes.length)];
            let tries = 0;
            while (b === a && tries < 5) { b = nodes[Math.floor(Math.random() * nodes.length)]; tries++; }
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist > width * 0.35) return;
            pulses.push({ a, b, t: 0, speed: 0.012 + Math.random() * 0.01 });
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            // Connections
            ctx.lineWidth = devicePixelRatio * 0.6;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i], b = nodes[j];
                    const dist = Math.hypot(a.x - b.x, a.y - b.y);
                    const maxDist = width * 0.16;
                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.32;
                        ctx.strokeStyle = `rgba(${copperRgb}, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            // Nodes
            nodes.forEach((n) => {
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${copperRgb}, 0.55)`;
                ctx.fill();

                if (!reduceMotion) {
                    n.x += n.vx;
                    n.y += n.vy;
                    if (n.x < 0 || n.x > width) n.vx *= -1;
                    if (n.y < 0 || n.y > height) n.vy *= -1;
                }
            });

            // Traveling pulses
            pulses.forEach((p) => {
                const x = p.a.x + (p.b.x - p.a.x) * p.t;
                const y = p.a.y + (p.b.y - p.a.y) * p.t;
                const grad = ctx.createRadialGradient(x, y, 0, x, y, 6 * devicePixelRatio);
                grad.addColorStop(0, `rgba(${copperRgb}, 0.9)`);
                grad.addColorStop(1, `rgba(${copperRgb}, 0)`);
                ctx.beginPath();
                ctx.arc(x, y, 6 * devicePixelRatio, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
                p.t += p.speed;
            });
            pulses = pulses.filter((p) => p.t < 1);
            maybeSpawnPulse();

            requestAnimationFrame(draw);
        }

        resize();
        buildNodes();
        window.addEventListener("resize", () => { resize(); buildNodes(); });
        draw();
    })();

    /* ===================================================
       2. MAGNETIC CURSOR TRAIL + MAGNETIC ELEMENTS
    =================================================== */
    const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (hoverCapable && !reduceMotion) {
        const trail = document.createElement("div");
        trail.className = "cursor-trail";
        document.body.appendChild(trail);
        let tx = 0, ty = 0, mx = 0, my = 0;
        window.addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
        (function loop() {
            tx += (mx - tx) * 0.18;
            ty += (my - ty) * 0.18;
            trail.style.transform = `translate(${tx}px, ${ty}px)`;
            requestAnimationFrame(loop);
        })();

        document.querySelectorAll(".magnetic").forEach((el) => {
            el.addEventListener("pointermove", (e) => {
                const rect = el.getBoundingClientRect();
                const relX = e.clientX - rect.left - rect.width / 2;
                const relY = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${relX * 0.18}px, ${relY * 0.28}px)`;
            });
            el.addEventListener("pointerleave", () => { el.style.transform = ""; });
        });
    }

    /* ===================================================
       3. 3D TILT CARDS
    =================================================== */
    if (hoverCapable && !reduceMotion) {
        document.querySelectorAll(".tilt-card").forEach((card) => {
            card.addEventListener("pointermove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty("--x", `${x}px`);
                card.style.setProperty("--y", `${y}px`);
                const rotateX = ((y - rect.height / 2) / rect.height) * -8;
                const rotateY = ((x - rect.width / 2) / rect.width) * 8;
                card.style.transform = `perspective(60rem) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-0.4rem)`;
            });
            card.addEventListener("pointerleave", () => { card.style.transform = ""; });
        });
    }

    /* ===================================================
       4. KINETIC TEXT — per-character reveal on scroll
    =================================================== */
    document.querySelectorAll(".kinetic-text").forEach((el) => {
        const text = el.textContent;
        el.textContent = "";
        el.setAttribute("aria-label", text);
        [...text].forEach((char, i) => {
            const span = document.createElement("span");
            span.className = "kinetic-char";
            span.textContent = char === " " ? "\u00A0" : char;
            span.style.transitionDelay = `${i * 0.02}s`;
            span.setAttribute("aria-hidden", "true");
            el.appendChild(span);
        });
    });

    const kineticObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.4 });
    document.querySelectorAll(".kinetic-text").forEach((el) => kineticObserver.observe(el));

    /* ===================================================
       5. EXPERIENCE — scroll-driven timeline fill
    =================================================== */
    const timelineContainer = document.querySelector(".experience-container");
    if (timelineContainer && !reduceMotion) {
        const updateTimeline = () => {
            const rect = timelineContainer.getBoundingClientRect();
            const viewportMid = window.innerHeight * 0.65;
            const progress = Math.min(1, Math.max(0, (viewportMid - rect.top) / rect.height));
            timelineContainer.style.setProperty("--timeline-progress", progress.toFixed(3));
        };
        updateTimeline();
        window.addEventListener("scroll", updateTimeline, { passive: true });
        window.addEventListener("resize", updateTimeline);
    }


    /* ===================================================
       7. CLICK RIPPLE — expanding ring on any click
    =================================================== */
    if (!reduceMotion) {
        document.addEventListener("pointerdown", (e) => {
            const ripple = document.createElement("div");
            ripple.className = "click-ripple";
            ripple.style.left = `${e.clientX}px`;
            ripple.style.top = `${e.clientY}px`;
            document.body.appendChild(ripple);
            ripple.addEventListener("animationend", () => ripple.remove());
        });
    }
});