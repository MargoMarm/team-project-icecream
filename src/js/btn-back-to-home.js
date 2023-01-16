const backHomeBtn = document.getElementById("back-home");
const firstSection = document.getElementById("hero");
const firstSectionPosition = firstSection.offsetTop;

window.addEventListener("scroll", () => {
    if (window.pageYOffset > firstSectionPosition) {
        backHomeBtn.classList.remove("hidden");
    } else {
        backHomeBtn.classList.add("hidden");
    }
});

backHomeBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});