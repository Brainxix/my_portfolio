document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // Mobile Navigation
    // =========================

    const menuBtn = document.querySelector(".menu-btn");
    const navLinks = document.querySelector(".nav-links");
    const icon = menuBtn.querySelector("i");

    menuBtn.addEventListener("click", function () {

        navLinks.classList.toggle("active");

        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");

    });

    navLinks.querySelectorAll("a").forEach(function(link){

        link.addEventListener("click", function(){

            navLinks.classList.remove("active");

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        });

    });


    // =========================
    // Theme Toggle
    // =========================

    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = themeToggle.querySelector("i");

    // Load saved theme
    if(localStorage.getItem("theme") === "dark"){

        document.body.classList.add("dark-mode");

        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");

    }

    themeToggle.addEventListener("click", function(){

        document.body.classList.toggle("dark-mode");

        if(document.body.classList.contains("dark-mode")){

            localStorage.setItem("theme","dark");

            themeIcon.classList.remove("fa-moon");
            themeIcon.classList.add("fa-sun");

        }else{

            localStorage.setItem("theme","light");

            themeIcon.classList.remove("fa-sun");
            themeIcon.classList.add("fa-moon");

        }

    });

});